#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const sax = require('sax')

const DEFAULT_SITE_HOST = 'ibrahimuylas.com'

const truncate = (value, max) => Array.from(value).slice(0, max).join('')

const decodeEntities = value =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
    .replace(/&#([0-9]+);/g, (_, decimal) =>
      String.fromCodePoint(Number.parseInt(decimal, 10))
    )
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/gi,
      (_, name) =>
        ({
          amp: '&',
          lt: '<',
          gt: '>',
          quot: '"',
          apos: "'",
          nbsp: ' '
        })[name.toLowerCase()]
    )

const commentText = value =>
  truncate(
    decodeEntities(String(value || ''))
      .replace(/<\s*br\s*\/?\s*>/gi, '\n')
      .replace(/<\s*li\b[^>]*>/gi, '- ')
      .replace(/<\s*\/\s*li\s*>/gi, '\n')
      .replace(/<\s*\/\s*(p|div|blockquote|pre|h[1-6])\s*>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
    5000
  )

const parseXml = xml => {
  const document = { local: '#document', attributes: [], content: [] }
  const stack = [document]
  const parser = sax.parser(true, { xmlns: true, trim: false, normalize: false })

  parser.onopentag = tag => {
    const node = {
      local: tag.local,
      attributes: Object.values(tag.attributes),
      content: []
    }
    stack.at(-1).content.push(node)
    stack.push(node)
  }
  parser.ontext = text => stack.at(-1).content.push(text)
  parser.oncdata = text => stack.at(-1).content.push(text)
  parser.onclosetag = () => stack.pop()
  parser.onerror = error => {
    throw error
  }

  parser.write(xml).close()
  return document
}

const childNodes = (node, local) =>
  node.content.filter(item => typeof item !== 'string' && item.local === local)

const childNode = (node, local) => childNodes(node, local)[0]

const nodeText = node =>
  node
    ? node.content
        .map(item => (typeof item === 'string' ? item : nodeText(item)))
        .join('')
        .trim()
    : ''

const childText = (node, local) => nodeText(childNode(node, local))

const nodeAttribute = (node, local, prefix) => {
  const attribute = node?.attributes.find(
    item => item.local === local && (!prefix || item.prefix === prefix)
  )
  return attribute ? String(attribute.value) : ''
}

const booleanText = value => ['1', 'true', 'yes'].includes(value.toLowerCase())

const timestamp = value => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const normalizePath = (link, siteHost = DEFAULT_SITE_HOST) => {
  try {
    const url = new URL(link, `https://${siteHost}`)
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
    if (hostname !== siteHost.toLowerCase().replace(/^www\./, '')) return null
    const pathname = url.pathname.replace(/\/{2,}/g, '/')
    const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`
    return normalized.length <= 500 ? normalized : null
  } catch {
    return null
  }
}

const elementAliases = node =>
  [...new Set([childText(node, 'id'), nodeAttribute(node, 'id', 'dsq')])].filter(
    Boolean
  )

const referenceAliases = node =>
  [...new Set([nodeText(node), nodeAttribute(node, 'id', 'dsq')])].filter(Boolean)

function prepareDisqusImport(xml, options = {}) {
  const siteHost = options.siteHost || DEFAULT_SITE_HOST
  const document = parseXml(xml)
  const disqus = childNode(document, 'disqus')
  if (!disqus) throw new Error('Disqus export root element was not found')

  const threadByAlias = new Map()
  const threads = []
  let skippedThreads = 0

  for (const node of childNodes(disqus, 'thread')) {
    const aliases = elementAliases(node)
    const sourceId = aliases[0]
    const link = childText(node, 'link')
    const normalizedPath = normalizePath(link, siteHost)
    if (!sourceId || !normalizedPath) {
      skippedThreads += 1
      continue
    }

    const thread = {
      sourceId,
      aliases,
      path: normalizedPath,
      title: truncate(childText(node, 'title') || normalizedPath, 300),
      createdAt: timestamp(childText(node, 'createdAt'))
    }
    threads.push(thread)
    for (const alias of aliases) threadByAlias.set(alias, thread)
  }

  const rawPosts = []
  const postByAlias = new Map()
  let skippedModerated = 0
  let skippedInvalid = 0

  for (const node of childNodes(disqus, 'post')) {
    const aliases = elementAliases(node)
    const sourceId = aliases[0]
    const threadReference = referenceAliases(childNode(node, 'thread'))
    const parentReference = referenceAliases(childNode(node, 'parent'))
    const author = childNode(node, 'author')
    const body = commentText(childText(node, 'message'))
    const moderated =
      booleanText(childText(node, 'isSpam')) ||
      booleanText(childText(node, 'isDeleted')) ||
      booleanText(childText(node, 'isDeletedByAuthor'))

    const post = {
      sourceId,
      aliases,
      threadReference,
      parentReference,
      authorName: truncate(childText(author, 'name') || 'Anonim', 80),
      body,
      createdAt: timestamp(childText(node, 'createdAt')),
      moderated
    }
    rawPosts.push(post)
    for (const alias of aliases) postByAlias.set(alias, post)

    if (moderated) skippedModerated += 1
    else if (!sourceId || !body || !post.createdAt) skippedInvalid += 1
  }

  const eligible = rawPosts.filter(post => {
    if (post.moderated || !post.sourceId || !post.body || !post.createdAt)
      return false
    return post.threadReference.some(alias => threadByAlias.has(alias))
  })
  const eligibleIds = new Set(eligible.map(post => post.sourceId))

  const nearestEligibleParent = post => {
    let references = post.parentReference
    const seen = new Set()
    while (references.length) {
      const candidate = references.map(alias => postByAlias.get(alias)).find(Boolean)
      if (!candidate || seen.has(candidate.sourceId)) return null
      seen.add(candidate.sourceId)
      if (eligibleIds.has(candidate.sourceId)) return candidate.sourceId
      references = candidate.parentReference
    }
    return null
  }

  const pending = eligible.map(post => ({
    ...post,
    thread: post.threadReference.map(alias => threadByAlias.get(alias)).find(Boolean),
    parentSourceId: nearestEligibleParent(post)
  }))
  const prepared = []
  const preparedById = new Map()

  while (pending.length) {
    const index = pending.findIndex(
      post => !post.parentSourceId || preparedById.has(post.parentSourceId)
    )
    const post = pending.splice(index === -1 ? 0 : index, 1)[0]
    const parent = preparedById.get(post.parentSourceId)
    const preparedPost = {
      sourceId: post.sourceId,
      aliases: post.aliases,
      threadPath: post.thread.path,
      parentSourceId: parent ? parent.sourceId : null,
      rootSourceId: parent ? parent.rootSourceId || parent.sourceId : null,
      authorName: post.authorName,
      body: post.body,
      createdAt: post.createdAt
    }
    prepared.push(preparedPost)
    preparedById.set(preparedPost.sourceId, preparedPost)
  }

  const rootActivity = new Map()
  for (const post of prepared) {
    const rootSourceId = post.rootSourceId || post.sourceId
    const current = rootActivity.get(rootSourceId)
    if (!current || post.createdAt > current) {
      rootActivity.set(rootSourceId, post.createdAt)
    }
  }

  const referencedThreadPaths = new Set(prepared.map(post => post.threadPath))
  const referencedThreads = threads.filter(thread =>
    referencedThreadPaths.has(thread.path)
  )

  return {
    threads: referencedThreads.map(({ aliases, ...thread }) => thread),
    posts: prepared,
    rootActivity,
    summary: {
      threads: referencedThreads.length,
      comments: prepared.length,
      roots: prepared.filter(post => !post.parentSourceId).length,
      replies: prepared.filter(post => post.parentSourceId).length,
      skippedThreads,
      unreferencedThreads: threads.length - referencedThreads.length,
      skippedModerated,
      skippedInvalid,
      skippedWithoutThread: rawPosts.length -
        skippedModerated -
        skippedInvalid -
        prepared.length
    }
  }
}

const restRequest = async (baseUrl, secret, resource, init = {}) => {
  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/rest/v1/${resource}`, {
    ...init,
    headers: {
      apikey: secret,
      'Content-Type': 'application/json',
      ...init.headers
    },
    signal: AbortSignal.timeout(15000)
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const message = data?.message || data?.hint || `HTTP ${response.status}`
    throw new Error(`Supabase import request failed: ${message}`)
  }
  return data
}

async function applyDisqusImport(plan, options) {
  const { supabaseUrl, secret } = options
  const threadIds = new Map()
  let inserted = 0
  let updated = 0

  for (const thread of plan.threads) {
    const rows = await restRequest(
      supabaseUrl,
      secret,
      'comment_threads?on_conflict=path&select=id,path',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({ path: thread.path, title: thread.title })
      }
    )
    threadIds.set(thread.path, rows[0].id)
  }

  const existingRows =
    (await restRequest(
      supabaseUrl,
      secret,
      'comments?source=eq.disqus&select=id,source_id,root_comment_id,reply_to_comment_id&limit=10000'
    )) || []
  const commentsBySourceId = new Map(
    existingRows.map(row => [row.source_id, row])
  )

  for (const post of plan.posts) {
    const parent = post.parentSourceId
      ? commentsBySourceId.get(post.parentSourceId)
      : null
    if (post.parentSourceId && !parent) {
      throw new Error(`Imported parent ${post.parentSourceId} was not found`)
    }

    const rootId = parent ? parent.root_comment_id || parent.id : null
    const payload = {
      thread_id: threadIds.get(post.threadPath),
      root_comment_id: rootId,
      reply_to_comment_id: parent?.id || null,
      author_name: post.authorName,
      body: post.body,
      status: 'published',
      source: 'disqus',
      source_id: post.sourceId,
      created_at: post.createdAt,
      updated_at: post.createdAt,
      last_activity_at: plan.rootActivity.get(post.sourceId) || post.createdAt
    }

    const existing = commentsBySourceId.get(post.sourceId)
    let rows
    if (existing) {
      rows = await restRequest(
        supabaseUrl,
        secret,
        `comments?id=eq.${encodeURIComponent(existing.id)}&select=id,source_id,root_comment_id,reply_to_comment_id`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(payload)
        }
      )
      updated += 1
    } else {
      rows = await restRequest(
        supabaseUrl,
        secret,
        'comments?select=id,source_id,root_comment_id,reply_to_comment_id',
        {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(payload)
        }
      )
      inserted += 1
    }
    commentsBySourceId.set(post.sourceId, rows[0])
  }

  for (const [rootSourceId, lastActivityAt] of plan.rootActivity) {
    const root = commentsBySourceId.get(rootSourceId)
    if (!root) continue
    await restRequest(
      supabaseUrl,
      secret,
      `comments?id=eq.${encodeURIComponent(root.id)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ last_activity_at: lastActivityAt })
      }
    )
  }

  return { inserted, updated }
}

const parseArguments = argv => {
  const options = { apply: false, siteHost: DEFAULT_SITE_HOST }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--apply') options.apply = true
    else if (argument === '--input') options.input = argv[++index]
    else if (argument === '--site-host') options.siteHost = argv[++index]
    else if (argument === '--supabase-url') options.supabaseUrl = argv[++index]
    else throw new Error(`Unknown argument: ${argument}`)
  }
  if (!options.input) throw new Error('Usage: --input <disqus-export.xml[.gz]> [--apply]')
  return options
}

const loadExport = inputPath => {
  const absolutePath = path.resolve(inputPath)
  const data = fs.readFileSync(absolutePath)
  return absolutePath.endsWith('.gz')
    ? zlib.gunzipSync(data).toString('utf8')
    : data.toString('utf8')
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const plan = prepareDisqusImport(loadExport(options.input), options)
  const result = { mode: options.apply ? 'apply' : 'dry-run', ...plan.summary }

  if (options.apply) {
    const supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL
    const secret = process.env.SUPABASE_SECRET_KEY
    if (!supabaseUrl || !secret) {
      throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY are required with --apply')
    }
    Object.assign(
      result,
      await applyDisqusImport(plan, { supabaseUrl, secret })
    )
  }

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

if (require.main === module) {
  main().catch(error => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}

module.exports = {
  childNode,
  childNodes,
  childText,
  commentText,
  nodeAttribute,
  normalizePath,
  parseXml,
  prepareDisqusImport
}
