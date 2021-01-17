const types = require('./types')

module.exports = async ({ actions, schema }, pluginOptions) => {
  const { createTypes } = actions

  const allTypeDefs = [
    /**
     * Schema Interfaces
     *
     * For a semantic schema we define an interface for file and
     * api sources of data
     */
    types.interfaces,
    /**
     * Image Asset Type
     *
     * Union type for image assets from file or api locations
     */
    schema.buildUnionType({
      name: 'ImageAsset',
      types: [
        'File', //Used for file system (eg. category SVG icons)
        'ImageSharp',
        'ContentfulAsset',
        'SanityImageAsset'
      ],
      resolveType: node => node.internal && node.internal.type
    })
  ]

  createTypes(allTypeDefs)
}
