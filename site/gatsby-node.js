const path = require('node:path')

const CAMPING_CATEGORY_PATH = '/category/kampcilik/'

exports.onCreatePage = ({ page, actions }) => {
  if (
    page.path !== CAMPING_CATEGORY_PATH ||
    page.context?.campingGuide === true
  ) {
    return
  }

  actions.deletePage(page)
  actions.createPage({
    ...page,
    component: path.resolve('./src/templates/camping-category.js'),
    context: {
      ...page.context,
      campingGuide: true
    }
  })
}
