const googleAnalyticsMeasurementId = process.env.GATSBY_GA_MEASUREMENT_ID
const {
  getSourcePath,
  normalizePath,
  shouldNoIndex
} = require('./src/i18n/language')
const { homeCategoryPostsPerGroup } = require('./src/i18n/collections')
const siteUrl = 'https://www.ibrahimuylas.com'
const isProductionDeploy = process.env.CONTEXT === 'production'
const nativeCommentsEnabled =
  process.env.GATSBY_NATIVE_COMMENTS_ENABLED === 'true'

const googleAnalyticsPlugin =
  googleAnalyticsMeasurementId && isProductionDeploy
    ? {
        resolve: 'gatsby-plugin-google-gtag',
        options: {
          trackingIds: [googleAnalyticsMeasurementId]
        }
      }
    : null

module.exports = {
  plugins: [
    googleAnalyticsPlugin,
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `{
          site { siteMetadata { siteUrl } }
          allSitePage { nodes { path } }
          privateArticles: allArticle(filter: { private: { eq: true } }) {
            nodes { slug }
          }
        }`,
        resolvePages: ({ allSitePage, privateArticles }) => {
          const privatePaths = new Set(
            privateArticles.nodes.map(({ slug }) => normalizePath(slug))
          )
          return allSitePage.nodes.filter(
            ({ path }) => !privatePaths.has(getSourcePath(path))
          )
        },
        excludes: [
          '/admin/**',
          '/404/',
          '/author/**',
          '/tag/**',
          '/**/page/**',
          '/authors/',
          '/contact/'
        ],
        filterPages: ({ path }, pattern, { minimatch, withoutTrailingSlash }) =>
          shouldNoIndex(path) ||
          minimatch(
            withoutTrailingSlash(getSourcePath(path)),
            withoutTrailingSlash(pattern)
          )
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'englishContent',
        path: `${__dirname}/content/translations/en`
      }
    },
    {
      resolve: 'gatsby-plugin-decap-cms',
      options: {
        modulePath: `${__dirname}/src/cms/comments-management.jsx`
      }
    },
    {
      resolve: '@elegantstack/gatsby-theme-flexiblog-agency',
      options: {
        // Add theme options here. Check documentation for available options.
        siteUrl,
        fonts: false,
        homeCategoryPostsPerGroup,
        services: {
          comments: {
            enabled: nativeCommentsEnabled,
            turnstileSiteKey: process.env.GATSBY_TURNSTILE_SITE_KEY || ''
          },
          reactions: {
            enabled: nativeCommentsEnabled
          },
          mailchimp: true
        },
        sources: {
          local: true
        }
      }
    }
  ].filter(Boolean),
  // Customize your site metadata:
  siteMetadata: {
    siteUrl, // Your site URL without trailing slash,
    //General Site Metadata
    title: 'İbrahim Uylaş',
    name: 'IbrahimUylas',
    description:
      'Kampçılık, doğa yürüyüşü, trekking, rota ve kamp ekipmanı rehberleri. Kişisel deneyimler, hazırlık notları ve yol hikâyeleri.',
    address: 'An itibariyle Londra',
    email: 'ibrahim@uylas.net',
    phone: '',

    //Site Social Media Links
    social: [
      {
        name: 'Youtube',
        url: 'https://www.youtube.com/ibrahimuylas'
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/uylasonwheels/'
      },
      {
        name: 'Facebook',
        url: 'https://facebook.com/ibrahimuylas'
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/ibrahimuylas'
      },
      {
        name: 'Github',
        url: 'https://github.com/ibrahimuylas'
      }
    ],

    //Header Menu Items
    headerMenu: [
      {
        name: 'Ana Sayfa',
        slug: '/'
      },
      {
        name: 'İletişim',
        slug: '/iletisim/'
      }
    ],

    //Footer Menu Items (2 Sets)
    footerMenu: [
      {
        title: 'Hızlı Linkler',
        items: [
          {
            name: 'Kampçılık',
            slug: '/category/kampcilik/'
          },
          {
            name: 'Doğa Yürüyüşleri',
            slug: '/category/doga-yuruyusleri/'
          },
          {
            name: 'Trekking',
            slug: '/trekking-ne-demek/'
          },
          {
            name: 'Hiking',
            slug: '/hiking-ne-demek/'
          }
        ]
      },
      {
        title: 'Hakkında',
        items: [
          {
            name: 'İletişim',
            slug: '/iletisim/'
          },
          {
            name: 'Bu Adam Kim?',
            slug: '/ibrahim-uylas-kimdir/'
          },
          {
            name: 'Neden Yola Çıkmalı?',
            slug: '/neden-yola-cikmali/'
          }
        ]
      }
    ]
  }
}
