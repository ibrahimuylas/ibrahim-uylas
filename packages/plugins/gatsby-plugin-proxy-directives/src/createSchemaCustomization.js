const { reduce, proxyField, proxyResolver } = require('./schema/extensions')

module.exports = async ({ actions }) => {
  const { createFieldExtension } = actions

  createFieldExtension(reduce)
  createFieldExtension(proxyField)
  createFieldExtension(proxyResolver)
}
