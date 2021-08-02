module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
        endpoint: "https://uylas.us7.list-manage.com/subscribe/post?u=56f18106e942eac04fac11bc7&amp;id=b37cfb1ab8"
      }
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-190518336-1"
      },
    },
    {
      resolve: "gatsby-plugin-disqus",
      options: {
        shortname: 'ibrahim-uylas',
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {},
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {},
    },
    {
      // ATTENTION: Match the theme name with the theme you're using
      resolve: "@elegantstack/gatsby-theme-flexiblog-agency",
      options: {
        services: {
          mailchimp: true,
          disqus: true,
        },
        sources: {
          local: true,
        },
      },
    },
  ],
  // Customize your site metadata:
  siteMetadata: {
    siteUrl: "https://www.ibrahimuylas.com", // Your site URL without trailing slash,
    //General Site Metadata
    title: 'İbrahim Uylaş',
     name: 'IbrahimUylas',
     description: 'Kampçılık ve doğa yürüyüşleriyle ilgili ne ararsan var, ne vereyim abime!',
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
        url: 'https://instagram.com/ibrahimuylas'
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
        slug: '/contact'
      }
    ],

    //Footer Menu Items (2 Sets)
    footerMenu: [
      {
        title: 'Hızlı Linkler',
        items: [
          {
            name: 'Kampçılık',
            slug: '/category/kampcilik'
          },
          {
            name: 'Doğa Yürüyüşleri',
            slug: '/category/doga-yuruyusleri'
          },
          {
            name: 'Trekking',
            slug: '/tag/trekking'
          },
          {
            name: 'Hiking',
            slug: '/tag/hiking'
          }
        ]
      },
      {
        title: 'Hakkında',
        items: [
          {
            name: 'İletişim',
            slug: '/contact'
          },
          {
            name: 'Bu Adam Kim?',
            slug: '/ibrahim-uylas-kimdir'
          },
          {
            name: 'Neden Yola Çıkmalı?',
            slug: '/neden-yola-cikmali'
          }
        ]
      }
    ]
  }
}
