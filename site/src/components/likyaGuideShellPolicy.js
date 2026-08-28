const normalizePath = value => {
  if (!value || typeof value !== 'string') return ''

  return `/${value.replace(/^\/+|\/+$/g, '')}/`
}

const isLikyaGuideRoute = ({ path, slug } = {}) =>
  normalizePath(path) === '/likya-yolu-rotasi/' ||
  normalizePath(slug) === '/likya-yolu-rotasi/'

const isLikyaGuideShellEnabled = ({
  path,
  slug,
  guideMeta,
  preview = false
} = {}) =>
  isLikyaGuideRoute({ path, slug }) &&
  (preview ||
    (Boolean(guideMeta?.shellEnabled) && guideMeta?.releaseStatus === 'ready'))

const normalizeSlug = value =>
  typeof value === 'string' ? value.replace(/^\/+|\/+$/g, '') : ''

const isLikyaStageGuideRoute = ({ slug, stageGuideByArticleSlug } = {}) =>
  Boolean(stageGuideByArticleSlug?.[normalizeSlug(slug)])

const isLikyaStageGuideEnabled = ({
  slug,
  stageGuideByArticleSlug,
  guideMeta,
  preview = false
} = {}) =>
  (preview || Boolean(guideMeta?.stageGuideEnabled)) &&
  isLikyaStageGuideRoute({ slug, stageGuideByArticleSlug })

module.exports = {
  isLikyaGuideRoute,
  isLikyaGuideShellEnabled,
  isLikyaStageGuideEnabled,
  isLikyaStageGuideRoute,
  normalizePath
}
