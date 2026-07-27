const test = require('node:test')
const assert = require('node:assert/strict')
const {
  boundedAlt,
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
    username: 'uylasonwheels',
    profileImageUrl: 'https://cdn.example.com/profile.jpg'
  },
  posts: Array.from({ length: 6 }, (_, index) => post(index + 1)),
  ...overrides
})

test('accepts only a complete expected-account feed', () => {
  const feed = validateFeed(response())
  assert.equal(feed.posts.length, 6)
  assert.equal(feed.posts[0].alt, 'Paylaşım 1')

  assert.equal(
    validateFeed(response({ posts: response().posts.slice(0, 5) })),
    null
  )
  assert.equal(
    validateFeed(
      response({
        profile: {
          username: 'another-account',
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
