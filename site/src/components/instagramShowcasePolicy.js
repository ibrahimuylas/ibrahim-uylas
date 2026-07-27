const EXPECTED_USERNAME = 'uylasonwheels'
const POST_TYPES = new Set(['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'])
const MAX_ALT_LENGTH = 120

const safeImageUrl = value => {
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.hash &&
      ![...url.searchParams.keys()].some(key => /token/i.test(key))
    )
  } catch {
    return false
  }
}

const instagramPermalink = value => {
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

const boundedAlt = (caption, position) => {
  const collapsed =
    typeof caption === 'string' ? caption.replace(/\s+/g, ' ').trim() : ''
  if (!collapsed) return `Instagram paylaşımı ${position}`

  if (collapsed.length <= MAX_ALT_LENGTH) return collapsed
  return `${collapsed.slice(0, MAX_ALT_LENGTH - 1).trimEnd()}…`
}

const validateFeed = value => {
  if (
    !value ||
    value.ok !== true ||
    !value.profile ||
    value.profile.username !== EXPECTED_USERNAME ||
    !safeImageUrl(value.profile.profileImageUrl) ||
    !Array.isArray(value.posts) ||
    value.posts.length !== 6
  ) {
    return null
  }

  const posts = value.posts.map((post, index) => {
    if (
      !post ||
      typeof post.id !== 'string' ||
      !post.id ||
      !POST_TYPES.has(post.type) ||
      !safeImageUrl(post.imageUrl) ||
      !instagramPermalink(post.permalink)
    ) {
      return null
    }

    return {
      id: post.id,
      type: post.type,
      imageUrl: post.imageUrl,
      permalink: post.permalink,
      alt: boundedAlt(post.caption, index + 1)
    }
  })

  if (posts.some(post => post === null)) return null

  return {
    profileImageUrl: value.profile.profileImageUrl,
    posts
  }
}

const createRequestGuard = () => {
  let active = true

  return {
    cancel: () => {
      active = false
    },
    commit: callback => {
      if (!active) return false
      callback()
      return true
    }
  }
}

module.exports = {
  boundedAlt,
  createRequestGuard,
  validateFeed
}
