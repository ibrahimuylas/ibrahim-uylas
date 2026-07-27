const EXPECTED_USERNAME = 'uylasonwheels'
const POST_TYPES = new Set(['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'])
const MAX_ALT_LENGTH = 120
const ANALYTICS_EVENTS = Object.freeze({
  profile: 'instagram_profile_click',
  message: 'instagram_message_click',
  post: 'instagram_post_click'
})
const ANALYTICS_MEDIA_TYPES = Object.freeze({
  IMAGE: 'image',
  CAROUSEL_ALBUM: 'carousel',
  VIDEO: 'video'
})

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

const createInstagramActivation = ({
  action,
  sourcePath,
  track,
  postPosition,
  mediaType
}) => {
  const eventName = ANALYTICS_EVENTS[action]
  const parameters = { source_path: sourcePath }

  if (action === 'post') {
    parameters.post_position = postPosition
    parameters.media_type = ANALYTICS_MEDIA_TYPES[mediaType]
  }

  return () => {
    if (
      typeof track !== 'function' ||
      !eventName ||
      typeof sourcePath !== 'string' ||
      !sourcePath.startsWith('/') ||
      (action === 'post' &&
        (!Number.isInteger(postPosition) ||
          postPosition < 1 ||
          !parameters.media_type))
    ) {
      return
    }

    track(eventName, parameters)
  }
}

module.exports = {
  boundedAlt,
  createInstagramActivation,
  createRequestGuard,
  validateFeed
}
