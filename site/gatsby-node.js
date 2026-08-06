const path = require('node:path')

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
