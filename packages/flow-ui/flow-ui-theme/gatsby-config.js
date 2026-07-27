const defaultFonts = require('./src/theme/typography-fonts.json')

module.exports = options => {
  const hasFontsOverride =
    options && Object.prototype.hasOwnProperty.call(options, 'fonts')
  const fontConfig = hasFontsOverride ? options.fonts : defaultFonts.fonts
  const usesGoogleFonts = Boolean(fontConfig && fontConfig.google)

  return {
    plugins: [
      `gatsby-plugin-emotion`,
      //Add preconnect to google fonts servers for performance
      usesGoogleFonts && {
        resolve: 'gatsby-plugin-preconnect',
        options: {
          domains: [
            'https://fonts.gstatic.com/',
            'https://fonts.googleapis.com/'
          ]
        }
      },
      fontConfig && {
        resolve: `gatsby-plugin-web-font-loader`,
        options: {
          ...fontConfig
        }
      }
    ].filter(Boolean)
  }
}
