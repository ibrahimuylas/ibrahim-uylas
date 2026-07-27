const test = require('node:test')
const assert = require('node:assert/strict')
const {
  boundedAlt,
  createInstagramActivation,
  createRequestGuard,
  validateFeed
} = require('./instagramShowcasePolicy')

const post = (index, overrides = {}) => ({
  id: `post-${index}`,
  type: 'IMAGE',
  imageUrl: `https://cdn.example.com/image-${index}.jpg`,
  permalink: `https://www.instagram.com/p/post_${index}/`,
  caption: `Paylaşım ${index}`,
  ...overrides
})

const response = overrides => ({
  ok: true,
  profile: {
    name: 'İbrahim Uylaş',
    username: 'uylasonwheels',
    biography: 'Londra’dan vahşi doğaya',
    profileImageUrl: 'https://cdn.example.com/profile.jpg'
  },
  posts: Array.from({ length: 6 }, (_, index) => post(index + 1)),
  ...overrides
})

test('accepts only a complete expected-account feed', () => {
  const feed = validateFeed(response())
  assert.equal(feed.posts.length, 6)
  assert.equal(feed.posts[0].alt, 'Paylaşım 1')
  assert.deepEqual(feed.profile, {
    name: 'İbrahim Uylaş',
    username: 'uylasonwheels',
    biography: 'Londra’dan vahşi doğaya',
    profileImageUrl: 'https://cdn.example.com/profile.jpg'
  })

  assert.equal(
    validateFeed(response({ posts: response().posts.slice(0, 5) })),
    null
  )
  assert.equal(
    validateFeed(
      response({
        profile: {
          name: 'Başka Hesap',
          username: 'another-account',
          biography: 'Başka profil',
          profileImageUrl: 'https://cdn.example.com/profile.jpg'
        }
      })
    ),
    null
  )
  assert.equal(
    validateFeed(
      response({
        profile: {
          name: '',
          username: 'uylasonwheels',
          biography: 'Eksik ad',
          profileImageUrl: 'https://cdn.example.com/profile.jpg'
        }
      })
    ),
    null
  )
})

test('rejects unsafe image and Instagram URLs', () => {
  const credentialImage = response()
  credentialImage.posts[0] = post(1, {
    imageUrl: 'https://user:secret@cdn.example.com/image.jpg'
  })
  assert.equal(validateFeed(credentialImage), null)

  const tokenImage = response()
  tokenImage.posts[0] = post(1, {
    imageUrl: 'https://cdn.example.com/image.jpg?access_token=secret'
  })
  assert.equal(validateFeed(tokenImage), null)

  const unsafeLink = response()
  unsafeLink.posts[0] = post(1, {
    permalink: 'https://example.com/p/post_1/'
  })
  assert.equal(validateFeed(unsafeLink), null)
})

test('collapses, bounds, and falls back from captions', () => {
  assert.equal(
    boundedAlt('  Dağda\n güzel   bir gün  ', 2),
    'Dağda güzel bir gün'
  )
  assert.equal(boundedAlt('', 3), 'Instagram paylaşımı 3')
  assert.equal(boundedAlt('a'.repeat(200), 1).length, 120)
  assert.match(boundedAlt('a'.repeat(200), 1), /…$/)
})

test('prevents stale async work from committing after cancellation', () => {
  const guard = createRequestGuard()
  let value = 'initial'
  assert.equal(
    guard.commit(() => (value = 'active')),
    true
  )
  guard.cancel()
  assert.equal(
    guard.commit(() => (value = 'stale')),
    false
  )
  assert.equal(value, 'active')
})

test('builds allowlisted CTA analytics and remains inert without gtag', () => {
  const calls = []
  const track = (eventName, parameters) => calls.push([eventName, parameters])

  createInstagramActivation({
    action: 'profile',
    sourcePath: '/',
    track,
    caption: 'private caption',
    biography: 'private biography',
    token: 'token-shaped-secret'
  })()
  createInstagramActivation({
    action: 'message',
    sourcePath: '/kampcilik/',
    track,
    username: 'uylasonwheels',
    visitorId: 'visitor-secret'
  })()
  createInstagramActivation({
    action: 'profile',
    sourcePath: '/',
    track: undefined
  })()

  assert.deepEqual(calls, [
    ['instagram_profile_click', { source_path: '/' }],
    ['instagram_message_click', { source_path: '/kampcilik/' }]
  ])
})

test('builds allowlisted post analytics with normalized media values only', () => {
  const calls = []
  const sensitiveFixture = {
    caption: 'caption-secret',
    name: 'İbrahim Uylaş',
    username: 'uylasonwheels',
    biography: 'biography-secret',
    visitorEmail: 'visitor@example.com',
    imageUrl: 'https://cdn.example.com/token-shaped-secret.jpg',
    permalink: 'https://www.instagram.com/p/private/'
  }

  ;['IMAGE', 'CAROUSEL_ALBUM', 'VIDEO'].forEach((mediaType, index) => {
    createInstagramActivation({
      action: 'post',
      sourcePath: '/',
      postPosition: index + 1,
      mediaType,
      track: (eventName, parameters) => calls.push([eventName, parameters]),
      ...sensitiveFixture
    })()
  })

  assert.deepEqual(calls, [
    [
      'instagram_post_click',
      { source_path: '/', post_position: 1, media_type: 'image' }
    ],
    [
      'instagram_post_click',
      { source_path: '/', post_position: 2, media_type: 'carousel' }
    ],
    [
      'instagram_post_click',
      { source_path: '/', post_position: 3, media_type: 'video' }
    ]
  ])
  assert.doesNotMatch(JSON.stringify(calls), /secret|uylasonwheels|İbrahim/)
})
