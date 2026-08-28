const assert = require('node:assert/strict')
const test = require('node:test')

const {
  isLikyaGuideRoute,
  isLikyaGuideShellEnabled,
  isLikyaStageGuideEnabled,
  isLikyaStageGuideRoute,
  normalizePath
} = require('./likyaGuideShellPolicy')

test('normalizes canonical and legacy-shaped Likya route values', () => {
  assert.equal(normalizePath('likya-yolu-rotasi'), '/likya-yolu-rotasi/')
  assert.equal(normalizePath('/likya-yolu-rotasi/'), '/likya-yolu-rotasi/')
  assert.equal(isLikyaGuideRoute({ slug: '/likya-yolu-rotasi/' }), true)
  assert.equal(isLikyaGuideRoute({ slug: 'likya-yolu-1.-gun' }), false)
})

test('finds retained stage guides only through the central stage lookup', () => {
  const stageGuideByArticleSlug = {
    'likya-yolu-rotasi-oludenizden-kabak-koyuna': { id: 'stage-1' }
  }

  assert.equal(
    isLikyaStageGuideRoute({
      slug: '/likya-yolu-rotasi-oludenizden-kabak-koyuna/',
      stageGuideByArticleSlug
    }),
    true
  )
  assert.equal(
    isLikyaStageGuideEnabled({
      slug: 'likya-yolu-rotasi-oludenizden-kabak-koyuna',
      stageGuideByArticleSlug,
      guideMeta: { stageGuideEnabled: false }
    }),
    false
  )
})

test('keeps the incomplete guide shell behind its release gate', () => {
  assert.equal(
    isLikyaGuideShellEnabled({
      path: '/likya-yolu-rotasi/',
      guideMeta: { shellEnabled: false }
    }),
    false
  )
  assert.equal(
    isLikyaGuideShellEnabled({
      path: '/likya-yolu-rotasi/',
      guideMeta: { shellEnabled: true, releaseStatus: 'ready' }
    }),
    true
  )
})

test('does not enable the canonical guide shell before release readiness is explicit', () => {
  assert.equal(
    isLikyaGuideShellEnabled({
      path: '/likya-yolu-rotasi/',
      guideMeta: { shellEnabled: true, releaseStatus: 'foundation' }
    }),
    false
  )
})

test('allows the complete guide and retained stages in an explicit local preview only', () => {
  const stageGuideByArticleSlug = {
    'likya-yolu-rotasi-oludenizden-kabak-koyuna': { id: 'stage-1' }
  }

  assert.equal(
    isLikyaGuideShellEnabled({
      path: '/likya-yolu-rotasi/',
      guideMeta: { shellEnabled: false, releaseStatus: 'foundation' },
      preview: true
    }),
    true
  )
  assert.equal(
    isLikyaStageGuideEnabled({
      slug: 'likya-yolu-rotasi-oludenizden-kabak-koyuna',
      stageGuideByArticleSlug,
      guideMeta: { stageGuideEnabled: false },
      preview: true
    }),
    true
  )
})
