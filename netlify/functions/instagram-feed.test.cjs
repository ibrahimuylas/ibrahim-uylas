const assert = require('node:assert/strict')
const { test } = require('node:test')
const { createHandler, normalizePost } = require('./instagram-feed.js')

const secret = 'fixture-secret-token'
const env = {
  INSTAGRAM_ACCESS_TOKEN: secret,
  INSTAGRAM_USER_ID: '17841400000000000',
  INSTAGRAM_API_VERSION: 'v24.0'
}
const profile = {
  name: 'İbrahim Uylaş',
  username: 'uylasonwheels',
  biography: 'Londra’dan vahşi doğaya',
  profile_picture_url: 'https://cdn.example.com/profile.jpg'
}
const media = (id, type = 'IMAGE', overrides = {}) => ({
  id: String(id),
  media_type: type,
  media_url: `https://cdn.example.com/${id}.jpg`,
  thumbnail_url: `https://cdn.example.com/${id}-thumb.jpg`,
  permalink: `https://www.instagram.com/${type === 'VIDEO' ? 'reel' : 'p'}/${id}/`,
  caption: `caption ${id}`,
  timestamp: `2026-07-${String(id).padStart(2, '0')}T12:00:00+0000`,
  ...overrides
})
const response = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  async json() {
    return body
  }
})
const quietLogger = { error() {} }

test('returns six newest sanitized posts using fixed requests and bearer auth', async () => {
  const calls = []
  const pages = [
    {
      data: [
        media(2),
        media(9, 'AUDIO'),
        media(1, 'IMAGE', {
          media_url: 'https://cdn.example.com/unsafe.jpg?access_token=leak'
        }),
        media(4, 'VIDEO')
      ],
      paging: {
        cursors: { after: 'opaque-cursor' },
        next: `https://evil.example/?access_token=${secret}`
      }
    },
    {
      data: [media(7, 'CAROUSEL_ALBUM'), media(6, 'VIDEO'), media(5), media(3)]
    }
  ]
  const fetchImpl = async (url, options) => {
    calls.push({ url: String(url), options })
    return calls.length === 1
      ? response(profile)
      : response(pages[calls.length - 2])
  }
  const logs = []
  const handler = createHandler({
    fetchImpl,
    env,
    logger: { error: message => logs.push(message) }
  })

  const result = await handler({ httpMethod: 'GET' })
  const body = JSON.parse(result.body)

  assert.equal(result.statusCode, 200)
  assert.equal(
    result.headers['Cache-Control'],
    'public, max-age=300, stale-while-revalidate=86400'
  )
  assert.equal(
    result.headers['Netlify-CDN-Cache-Control'],
    'public, max-age=3600, stale-while-revalidate=86400'
  )
  assert.deepEqual(body.profile, {
    name: profile.name,
    username: profile.username,
    biography: profile.biography,
    profileImageUrl: profile.profile_picture_url
  })
  assert.deepEqual(
    body.posts.map(post => post.id),
    ['7', '6', '5', '4', '3', '2']
  )
  assert.equal(
    body.posts.find(post => post.id === '4').imageUrl,
    'https://cdn.example.com/4-thumb.jpg'
  )
  assert.equal(
    body.posts.find(post => post.id === '7').imageUrl,
    'https://cdn.example.com/7.jpg'
  )
  assert.equal(calls.length, 3)
  for (const call of calls) {
    const url = new URL(call.url)
    assert.equal(url.origin, 'https://graph.instagram.com')
    assert.match(url.pathname, /^\/v24\.0\/17841400000000000(?:\/media)?$/)
    assert.equal(url.searchParams.has('access_token'), false)
    assert.equal(call.options.headers.Authorization, `Bearer ${secret}`)
  }
  assert.equal(new URL(calls[2].url).searchParams.get('after'), 'opaque-cursor')
  assert.doesNotMatch(
    JSON.stringify({ body, logs }),
    /fixture-secret|evil\.example/
  )
})

test('rejects methods and invalid configuration without calling fetch', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
  }
  const handler = createHandler({ fetchImpl, env, logger: quietLogger })
  const methodResult = await handler({ httpMethod: 'POST' })
  assert.equal(methodResult.statusCode, 405)
  assert.equal(methodResult.headers.Allow, 'GET')
  assert.equal(methodResult.headers['Cache-Control'], 'no-store')

  for (const invalidEnv of [
    {},
    { ...env, INSTAGRAM_USER_ID: '../me' },
    { ...env, INSTAGRAM_API_VERSION: 'latest' }
  ]) {
    const result = await createHandler({
      fetchImpl,
      env: invalidEnv,
      logger: quietLogger
    })({ httpMethod: 'GET' })
    assert.equal(result.statusCode, 500)
    assert.deepEqual(JSON.parse(result.body), { ok: false })
    assert.equal(result.headers['Cache-Control'], 'no-store')
  }
  assert.equal(calls, 0)
})

test('skips malformed media and stops after the bounded page cap', async () => {
  let mediaPage = 0
  const fetchImpl = async url => {
    if (
      !String(url).endsWith(
        '/media?fields=id%2Cmedia_type%2Cmedia_url%2Cthumbnail_url%2Cpermalink%2Ccaption%2Ctimestamp&limit=25'
      ) &&
      mediaPage === 0
    ) {
      return response(profile)
    }
    mediaPage += 1
    return response({
      data: [
        media(mediaPage, 'IMAGE', { permalink: 'https://evil.example/p/x/' })
      ],
      paging: { cursors: { after: `cursor-${mediaPage}` } }
    })
  }
  const result = await createHandler({
    fetchImpl,
    env,
    logger: quietLogger
  })({ httpMethod: 'GET' })
  assert.equal(result.statusCode, 502)
  assert.equal(mediaPage, 3)
  assert.deepEqual(JSON.parse(result.body), { ok: false })
})

test('sanitizes malformed JSON, upstream status, rejection, and timeout', async () => {
  const cases = [
    async () => ({
      ok: true,
      status: 200,
      async json() {
        throw new Error(secret)
      }
    }),
    async () => response({ raw: secret }, 403),
    async () => {
      throw new Error(secret)
    },
    async (_url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const error = new Error(secret)
          error.name = 'AbortError'
          reject(error)
        })
      })
  ]

  for (const [index, fetchImpl] of cases.entries()) {
    const logs = []
    const result = await createHandler({
      fetchImpl,
      env,
      logger: { error: message => logs.push(message) },
      timeoutMs: index === 3 ? 1 : 8000
    })({ httpMethod: 'GET' })
    assert.equal(result.statusCode, 502)
    assert.equal(result.headers['Cache-Control'], 'no-store')
    assert.deepEqual(JSON.parse(result.body), { ok: false })
    assert.doesNotMatch(JSON.stringify(logs), /fixture-secret/)
  }
})

test('requires safe bounded media fields and video thumbnails', () => {
  assert.equal(
    normalizePost(media(1, 'VIDEO', { thumbnail_url: undefined })),
    null
  )
  assert.equal(
    normalizePost(media(1, 'IMAGE', { media_url: 'http://cdn.example/x' })),
    null
  )
  assert.equal(
    normalizePost(
      media(1, 'IMAGE', { media_url: 'https://user@cdn.example/x' })
    ),
    null
  )
  assert.equal(
    normalizePost(
      media(1, 'IMAGE', { media_url: 'https://cdn.example/x#fragment' })
    ),
    null
  )
  assert.equal(
    normalizePost(media(1, 'IMAGE', { caption: 'x'.repeat(2201) })),
    null
  )
  assert.equal(
    normalizePost(media(1, 'IMAGE', { timestamp: 'not-a-date' })),
    null
  )
  assert.equal(
    normalizePost(media(1, 'IMAGE', { caption: undefined })).caption,
    ''
  )
})
