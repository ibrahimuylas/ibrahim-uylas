const categoryGuidePolicy = require('./categoryGuidePolicy')

const isCampingArticle = article =>
  categoryGuidePolicy.isGuideArticle(article, {
    primaryCategory: 'Kampçılık',
    tagNames: ['#kampçılık']
  })

const selectGuideArticles = ({ articles = [], curatedSlugs = [] }) =>
  categoryGuidePolicy.selectGuideArticles({
    articles,
    curatedSlugs,
    primaryCategory: 'Kampçılık',
    tagNames: ['#kampçılık']
  })

module.exports = {
  ...categoryGuidePolicy,
  isCampingArticle,
  selectGuideArticles,
  articleKey: categoryGuidePolicy.articleKey,
  articlePath: categoryGuidePolicy.articlePath,
  createCategoryHubActivation: categoryGuidePolicy.createCategoryHubActivation,
  filterArticles: categoryGuidePolicy.filterArticles,
  normalizeSearchText: categoryGuidePolicy.normalizeSearchText,
  selectRandomArticles: categoryGuidePolicy.selectRandomArticles
}
