let slugPlugin

module.exports = () => async tree => {
  if (!slugPlugin) {
    slugPlugin = import('rehype-slug').then(module => module.default())
  }

  const transform = await slugPlugin
  return transform(tree)
}
