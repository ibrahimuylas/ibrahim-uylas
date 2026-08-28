const path = require('node:path')
const likya = require('./src/content-guides/likya')

const GUIDE_ROUTES = {
  '/category/kampcilik/': 'kampcilik',
  '/category/doga-yuruyusleri/': 'doga-yuruyusleri',
  '/category/rotalar/': 'rotalar',
  '/category/doga-yuruyusleri-ve-kamp-ekipmanlari/': 'ekipmanlar',
  '/category/diger-her-sey/': 'diger'
}

exports.onCreatePage = ({ page, actions }) => {
  const guideId = GUIDE_ROUTES[page.path]

  if (!guideId || page.context?.guideId === guideId) {
    return
  }

  actions.deletePage(page)
  actions.createPage({
    ...page,
    component: path.resolve('./src/templates/camping-category.js'),
    context: {
      ...page.context,
      guideId
    }
  })
}

exports.createPages = ({ actions }) => {
  const publicationReadiness = likya.buildPaftaPublicationReadiness({
    routeSections: likya.routeSections,
    stageResearchRecords: likya.stageResearchRecords,
    paftaReconciliationReviews: likya.paftaReconciliationReviews,
    officialPaftaObservations: likya.officialPaftaObservations,
    paftaPublicationRecords: likya.paftaPublicationRecords
  })
  const paftaPages = likya.buildPublishedPaftaGuidePages({
    routeSections: likya.routeSections,
    paftaPublicationRecords: likya.paftaPublicationRecords,
    publicationReadiness
  })

  paftaPages.forEach(page => {
    actions.createPage({
      path: page.path,
      component: path.resolve('./src/templates/likya-pafta-guide.jsx'),
      context: {
        sectionId: page.sectionId
      }
    })
  })
}
