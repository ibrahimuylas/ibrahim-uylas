const {
  makeSlug,
  normalizeSocial,
  blockContentToMarkdown
} = require('./schema/extensions')

module.exports = async ({ actions }) => {
  const { createFieldExtension } = actions

  createFieldExtension(makeSlug)
  createFieldExtension(normalizeSocial)
  createFieldExtension(blockContentToMarkdown)
}
