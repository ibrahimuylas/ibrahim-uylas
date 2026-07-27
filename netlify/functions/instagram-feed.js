const API_ORIGIN = 'https://graph.instagram.com'
const SUCCESS_CACHE = 'public, max-age=300, stale-while-revalidate=86400'
const CDN_CACHE = 'public, durable, max-age=3600, stale-while-revalidate=86400'
const NO_STORE = 'no-store'
const POST_COUNT = 6
const MAX_MEDIA_PAGES = 3
const DEFAULT_TIMEOUT_MS = 8000
const PROFILE_FIELDS = ['name', 'username', 'biography', 'profile_picture_url']
const MEDIA_FIELDS = [
  'id',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'caption',
  'timestamp'
]

const jsonResponse = (statusCode, body, success = false) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': success ? SUCCESS_CACHE : NO_STORE,
    ...(success ? { 'Netlify-CDN-Cache-Control': CDN_CACHE } : {})
  },
  body: JSON.stringify(body)
})

const boundedString = (value, maximum, required = true) => {
  if (typeof value !== 'string') return null
  const normalized = value.trim()
  if ((required && !normalized) || normalized.length > maximum) return null
  return normalized
}

const isSafeImageUrl = value => {
  try {
    const url = new URL(value)
    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      url.hash ||
      url.port
    ) {
      return false
    }

    return ![...url.searchParams.keys()].some(key =>
      /(?:access[_-]?token|token)/i.test(key)
    )
  } catch {
    return false
  }
}

const isInstagramPermalink = value => {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      url.hostname === 'www.instagram.com' &&
      !url.username &&
      !url.password &&
      !url.port &&
      !url.search &&
      !url.hash &&
      /^\/(?:p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
    )
  } catch {
    return false
  }
}

const normalizeProfile = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const name = boundedString(value.name, 100)
  const username = boundedString(value.username, 30)
  const biography = boundedString(value.biography, 500, false)
  const profileImageUrl = boundedString(value.profile_picture_url, 2048)

  if (
    !name ||
    !username ||
    !/^[A-Za-z0-9._]+$/.test(username) ||
    biography === null ||
    !profileImageUrl ||
    !isSafeImageUrl(profileImageUrl)
  ) {
    return null
  }

  return { name, username, biography, profileImageUrl }
}

const normalizePost = value => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null

  const id = boundedString(value.id, 100)
  const type = value.media_type
  const imageSource =
    type === 'VIDEO'
      ? value.thumbnail_url
      : type === 'IMAGE' || type === 'CAROUSEL_ALBUM'
        ? value.media_url
        : null
  const imageUrl = boundedString(imageSource, 2048)
  const permalink = boundedString(value.permalink, 2048)
  const caption =
    value.caption === undefined ? '' : boundedString(value.caption, 2200, false)
  const timestamp = boundedString(value.timestamp, 64)
  const timestampValue = timestamp ? Date.parse(timestamp) : NaN

  if (
    !id ||
    !/^[A-Za-z0-9_-]+$/.test(id) ||
    !imageUrl ||
    !isSafeImageUrl(imageUrl) ||
    !permalink ||
    !isInstagramPermalink(permalink) ||
    caption === null ||
    !timestamp ||
    !Number.isFinite(timestampValue)
  ) {
    return null
  }

  return { id, type, imageUrl, permalink, caption, timestamp }
}

const readJson = async response => {
  try {
    return await response.json()
  } catch {
    throw new Error('invalid-json')
  }
}

const createHandler =
  ({
    fetchImpl = globalThis.fetch,
    env = process.env,
    logger = console,
    setTimeoutImpl = setTimeout,
    clearTimeoutImpl = clearTimeout,
    timeoutMs = DEFAULT_TIMEOUT_MS
  } = {}) =>
  async event => {
    if (event?.httpMethod !== 'GET') {
      const response = jsonResponse(405, { ok: false })
      response.headers.Allow = 'GET'
      return response
    }

    const token = env.INSTAGRAM_ACCESS_TOKEN
    const userId = env.INSTAGRAM_USER_ID
    const version = env.INSTAGRAM_API_VERSION

    if (
      !boundedString(token, 4096) ||
      !/^[0-9]{1,30}$/.test(userId || '') ||
      !/^v[0-9]{1,3}\.[0-9]{1,3}$/.test(version || '') ||
      typeof fetchImpl !== 'function'
    ) {
      logger.error('Instagram feed configuration is invalid')
      return jsonResponse(500, { ok: false })
    }

    const controller = new AbortController()
    const timeout = setTimeoutImpl(() => controller.abort(), timeoutMs)
    const request = async (path, fields, after) => {
      const url = new URL(`${API_ORIGIN}/${version}/${path}`)
      url.searchParams.set('fields', fields.join(','))
      if (after) url.searchParams.set('after', after)
      if (path.endsWith('/media')) url.searchParams.set('limit', '25')

      const response = await fetchImpl(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      })

      if (!response || typeof response.ok !== 'boolean') {
        throw new Error('invalid-response')
      }
      if (!response.ok) {
        const error = new Error('upstream-status')
        error.status = Number.isInteger(response.status) ? response.status : 0
        throw error
      }
      return readJson(response)
    }

    try {
      const profile = normalizeProfile(await request(userId, PROFILE_FIELDS))
      if (!profile) throw new Error('invalid-profile')

      const candidates = []
      const seenIds = new Set()
      let after

      for (let page = 0; page < MAX_MEDIA_PAGES; page += 1) {
        const payload = await request(`${userId}/media`, MEDIA_FIELDS, after)
        if (
          !payload ||
          typeof payload !== 'object' ||
          !Array.isArray(payload.data)
        ) {
          throw new Error('invalid-media')
        }

        for (const item of payload.data) {
          const post = normalizePost(item)
          if (post && !seenIds.has(post.id)) {
            seenIds.add(post.id)
            candidates.push(post)
          }
        }

        if (candidates.length >= POST_COUNT) break
        const cursor = payload.paging?.cursors?.after
        after = boundedString(cursor, 512)
        if (!after) break
      }

      const posts = candidates
        .sort(
          (left, right) =>
            Date.parse(right.timestamp) - Date.parse(left.timestamp)
        )
        .slice(0, POST_COUNT)

      if (posts.length !== POST_COUNT) throw new Error('incomplete-feed')

      return jsonResponse(200, { ok: true, profile, posts }, true)
    } catch (error) {
      if (error?.name === 'AbortError') {
        logger.error('Instagram feed request timed out')
      } else if (error?.message === 'upstream-status') {
        logger.error(`Instagram feed upstream request failed (${error.status})`)
      } else if (
        error?.message === 'invalid-json' ||
        error?.message === 'invalid-profile' ||
        error?.message === 'invalid-media' ||
        error?.message === 'incomplete-feed' ||
        error?.message === 'invalid-response'
      ) {
        logger.error('Instagram feed upstream data is invalid')
      } else {
        logger.error('Instagram feed request could not be completed')
      }
      return jsonResponse(502, { ok: false })
    } finally {
      clearTimeoutImpl(timeout)
    }
  }

exports.createHandler = createHandler
exports.handler = createHandler()
exports.normalizePost = normalizePost
exports.normalizeProfile = normalizeProfile
exports.isSafeImageUrl = isSafeImageUrl
exports.isInstagramPermalink = isInstagramPermalink
