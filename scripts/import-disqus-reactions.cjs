#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const zlib = require('node:zlib')
const {
  childNode,
  childNodes,
  childText,
  nodeAttribute,
  normalizePath,
  parseXml
} = require('./import-disqus-comments.cjs')

const DEFAULT_SITE_HOST = 'ibrahimuylas.com'
const DISQUS_ENDPOINT =
  'https://disqus.com/api/3.0/threadReactions/loadReactions.json'
const REACTION_KEYS = ['like', 'funny', 'love', 'surprised', 'angry', 'sad']
const REACTION_BY_TEXT = new Map([
  ['Beğendim', 'like'],
  ['Eğlendim', 'funny'],
  ['Bayıldım', 'love'],
  ['Şaşırdım', 'surprised'],
  ['Kızdım', 'angry'],
  ['Üzüldüm', 'sad']
])

const emptyCounts = () => Object.fromEntries(REACTION_KEYS.map(key => [key, 0]))

const truncate = (value, max) => Array.from(value).slice(0, max).join('')

const loadExport = inputPath => {
  const absolutePath = path.resolve(inputPath)
  const data = fs.readFileSync(absolutePath)
  return absolutePath.endsWith('.gz')
    ? zlib.gunzipSync(data).toString('utf8')
    : data.toString('utf8')
}

function prepareReactionThreads(xml, options = {}) {
  const siteHost = options.siteHost || DEFAULT_SITE_HOST
  const document = parseXml(xml)
  const disqus = childNode(document, 'disqus')
  if (!disqus) throw new Error('Disqus export root element was not found')

  const pairs = new Map()
  let skippedThreads = 0

  for (const node of childNodes(disqus, 'thread')) {
    const sourceId = nodeAttribute(node, 'id', 'dsq')
    const normalizedPath = normalizePath(childText(node, 'link'), siteHost)
    if (!sourceId || !/^\d+$/.test(sourceId) || !normalizedPath) {
      skippedThreads += 1
      continue
    }

    const pairKey = `${sourceId}\u0000${normalizedPath}`
    if (!pairs.has(pairKey)) {
      pairs.set(pairKey, {
        sourceId,
        path: normalizedPath,
        title: truncate(childText(node, 'title') || normalizedPath, 300)
      })
    }
  }

  return {
    threads: [...pairs.values()],
    summary: {
      exportedThreadRows: childNodes(disqus, 'thread').length,
      skippedThreads,
      uniqueThreadPaths: pairs.size,
      uniqueDisqusThreads: new Set(
        [...pairs.values()].map(thread => thread.sourceId)
      ).size
    }
  }
}

async function fetchThreadReactions(sourceId, apiKey, fetchImpl = fetch) {
  const url = new URL(DISQUS_ENDPOINT)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('thread', sourceId)
  const response = await fetchImpl(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15000)
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.code !== 0) {
    throw new Error(
      `Disqus reactions request for thread ${sourceId} failed (${response.status})`
    )
  }
  return body.response || { reactions: [], eligible: false }
}

const countsFromResponse = response => {
  const counts = emptyCounts()
  for (const item of response?.reactions || []) {
    const key = REACTION_BY_TEXT.get(item.text)
    const votes = Number(item.votes)
    if (key && Number.isSafeInteger(votes) && votes >= 0) counts[key] += votes
  }
  return counts
}

async function prepareReactionImport(xml, options) {
  const prepared = prepareReactionThreads(xml, options)
  const uniqueIds = [
    ...new Set(prepared.threads.map(thread => thread.sourceId))
  ]
  const responses = new Map()
  const concurrency = Math.min(
    Math.max(Number(options.concurrency) || 6, 1),
    12
  )
  let nextIndex = 0

  const worker = async () => {
    while (nextIndex < uniqueIds.length) {
      const index = nextIndex
      nextIndex += 1
      const sourceId = uniqueIds[index]
      responses.set(
        sourceId,
        await fetchThreadReactions(sourceId, options.apiKey, options.fetchImpl)
      )
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker))

  const paths = new Map()
  const sourceIdsWithVotes = new Set()
  const eligibleSourceIds = new Set()

  for (const thread of prepared.threads) {
    const response = responses.get(thread.sourceId)
    if (response?.eligible) eligibleSourceIds.add(thread.sourceId)
    if (!response?.reactions?.length) continue
    const counts = countsFromResponse(response)
    if (Object.values(counts).some(Boolean))
      sourceIdsWithVotes.add(thread.sourceId)

    const current = paths.get(thread.path) || {
      path: thread.path,
      title: thread.title,
      counts: emptyCounts(),
      sourceIds: []
    }
    if (!current.sourceIds.includes(thread.sourceId)) {
      current.sourceIds.push(thread.sourceId)
      for (const key of REACTION_KEYS) current.counts[key] += counts[key]
    }
    paths.set(thread.path, current)
  }

  const articles = [...paths.values()].sort((left, right) =>
    left.path.localeCompare(right.path, 'tr')
  )
  const byReaction = emptyCounts()
  for (const article of articles) {
    for (const key of REACTION_KEYS) byReaction[key] += article.counts[key]
  }

  return {
    articles,
    summary: {
      ...prepared.summary,
      eligibleDisqusThreads: eligibleSourceIds.size,
      disqusThreadsWithVotes: sourceIdsWithVotes.size,
      articlePaths: articles.length,
      articlePathsWithVotes: articles.filter(article =>
        Object.values(article.counts).some(Boolean)
      ).length,
      totalImportedVotes: Object.values(byReaction).reduce(
        (total, count) => total + count,
        0
      ),
      byReaction
    }
  }
}

const restRequest = async (baseUrl, secret, resource, init = {}) => {
  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/rest/v1/${resource}`,
    {
      ...init,
      headers: {
        apikey: secret,
        'Content-Type': 'application/json',
        ...init.headers
      },
      signal: AbortSignal.timeout(15000)
    }
  )
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    const message = data?.message || data?.hint || `HTTP ${response.status}`
    throw new Error(`Supabase reaction import failed: ${message}`)
  }
  return data
}

async function applyReactionImport(plan, options) {
  let updatedArticles = 0
  let updatedTotals = 0

  for (const article of plan.articles) {
    const rows = await restRequest(
      options.supabaseUrl,
      options.secret,
      'article_reaction_threads?on_conflict=path&select=id',
      {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({ path: article.path, title: article.title })
      }
    )
    const threadId = rows[0].id
    const totals = REACTION_KEYS.map(reaction => ({
      thread_id: threadId,
      reaction,
      imported_count: article.counts[reaction],
      updated_at: new Date().toISOString()
    }))
    await restRequest(
      options.supabaseUrl,
      options.secret,
      'article_reaction_totals?on_conflict=thread_id,reaction',
      {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(totals)
      }
    )
    updatedArticles += 1
    updatedTotals += totals.length
  }

  return { updatedArticles, updatedTotals }
}

const parseArguments = argv => {
  const options = {
    apply: false,
    concurrency: 6,
    siteHost: DEFAULT_SITE_HOST
  }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--apply') options.apply = true
    else if (argument === '--input') options.input = argv[++index]
    else if (argument === '--output') options.output = argv[++index]
    else if (argument === '--site-host') options.siteHost = argv[++index]
    else if (argument === '--supabase-url') options.supabaseUrl = argv[++index]
    else if (argument === '--concurrency') options.concurrency = argv[++index]
    else throw new Error(`Unknown argument: ${argument}`)
  }
  if (!options.input) {
    throw new Error(
      'Usage: --input <disqus-export.xml[.gz]> [--output plan.json] [--apply]'
    )
  }
  return options
}

async function main() {
  const options = parseArguments(process.argv.slice(2))
  const apiKey = process.env.DISQUS_API_KEY
  if (!apiKey) throw new Error('DISQUS_API_KEY is required')

  const plan = await prepareReactionImport(loadExport(options.input), {
    ...options,
    apiKey
  })
  const result = { mode: options.apply ? 'apply' : 'dry-run', ...plan.summary }

  if (options.output) {
    fs.writeFileSync(
      path.resolve(options.output),
      `${JSON.stringify(plan, null, 2)}\n`
    )
  }

  if (options.apply) {
    const supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL
    const secret = process.env.SUPABASE_SECRET_KEY
    if (!supabaseUrl || !secret) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SECRET_KEY are required with --apply'
      )
    }
    Object.assign(
      result,
      await applyReactionImport(plan, { supabaseUrl, secret })
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
  REACTION_KEYS,
  countsFromResponse,
  prepareReactionImport,
  prepareReactionThreads
}
