exports.createSchemaCustomization = require('./src/createSchemaCustomization')

exports.onCreateNode = require('./src/onCreateNode')

exports.createPages = require('./src/createPages')

exports.onCreatePage = require('./src/onCreatePage')

// Temporary warning for Sanity CMS
exports.onPreInit = ({ reporter }, pluginOptions) => {
  if (
    pluginOptions &&
    pluginOptions.sources &&
    pluginOptions.sources.sanity === true
  ) {
    reporter.panic(
      `
      !===================!
      Sanity CMS sourcing plugin is not compatible with Gatsby v3 yet and it's
      temporary disabled in the theme. All other CMSes are compatible with Gatsby v3.
      Once Sanity releases an update to their plugin we'll implement it in the theme.
      !===================!
      `
    )
  }
}
