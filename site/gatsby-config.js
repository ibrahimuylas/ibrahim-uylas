const googleAnalyticsMeasurementId = process.env.GATSBY_GA_MEASUREMENT_ID
const siteUrl = 'https://www.ibrahimuylas.com'
const isProductionDeploy = process.env.CONTEXT === 'production'

const giscus = {
  repo: process.env.GATSBY_GISCUS_REPO || 'ibrahimuylas/ibrahim-uylas',
  repoId:
    process.env.GATSBY_GISCUS_REPO_ID || 'MDEwOlJlcG9zaXRvcnkzMzAyODIzNzg=',
  category: process.env.GATSBY_GISCUS_CATEGORY || 'Blog Comments',
  categoryId: process.env.GATSBY_GISCUS_CATEGORY_ID || 'DIC_kwDOE6-1is4DCaw9'
}

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
        excludes: [
          '/admin/**',
          '/author/**',
          '/tag/**',
          '/**/page/**',
          '/authors/',
          '/contact/'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-decap-cms',
      options: {}
    },
    {
      resolve: '@elegantstack/gatsby-theme-flexiblog-agency',
      options: {
        // Add theme options here. Check documentation for available options.
        siteUrl,
        fonts: false,
        homeCategoryPostsPerGroup: 6,
        services: {
          giscus,
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
      'Kampçılık ve doğa yürüyüşleriyle ilgili ne ararsan var, ne vereyim abime!',
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
