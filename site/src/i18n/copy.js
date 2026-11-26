const { getLocalizedLink, fallbackLinkTitle } = require('./language')

const copy = {
  tr: {
    home: 'Ana sayfa',
    homePath: '/',
    backHome: 'Ana sayfaya dön',
    menu: 'Menü',
    mainMenu: 'Ana Menü',
    scrollTop: 'Sayfanın başına dön',
    mobileActions: 'Mobil hızlı işlemler',
    themeLight: 'Açık temaya geç',
    themeDark: 'Koyu temaya geç',
    search: 'Arama',
    searchPosts: 'Yazılarda ara',
    closeSearch: 'Aramayı kapat',
    searchPrompt: 'Aramak istediğiniz kelimeyi yazın.',
    searchMinimum: 'Aramak için en az iki karakter yazın.',
    searchLoading: 'Sonuçlar aranıyor…',
    searchUnavailable:
      'Arama şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
    searchEmpty: 'Sonuç bulunamadı.',
    searchCount: count => `${count} sonuç bulundu.`,
    loadingMore: 'Yükleniyor…',
    more: 'Daha fazla göster',
    author: 'Yazan',
    category: 'Kategori',
    published: 'Yayımlandı',
    updated: 'Güncellendi',
    readingTime: 'Okuma Süresi',
    relatedPosts: 'İlgili Yazılar',
    openGuide: 'Ana rehbere git',
    newsletter: {
      title: 'Yeni rota ve kamp rehberlerini kaçırma',
      description:
        'Yeni bir rota, kamp alanı veya ekipman rehberi yayımladığımda kısa bir e-postayla haber almak için listeye katıl.',
      email: 'Email adresi',
      placeholder: 'Email adresiniz buraya...',
      submit: 'Kayıt ol'
    },
    minutes: count => `${count} dk`,
    copyright: 'Tüm hakları saklıdır.'
  },
  en: {
    home: 'Home',
    homePath: '/en/',
    backHome: 'Back to homepage',
    menu: 'Menu',
    mainMenu: 'Main menu',
    scrollTop: 'Back to top',
    mobileActions: 'Mobile quick actions',
    themeLight: 'Switch to light mode',
    themeDark: 'Switch to dark mode',
    search: 'Search',
    searchPosts: 'Search posts',
    closeSearch: 'Close search',
    searchPrompt: 'Enter a search term.',
    searchMinimum: 'Enter at least two characters to search.',
    searchLoading: 'Searching…',
    searchUnavailable:
      'Search is temporarily unavailable. Please try again later.',
    searchEmpty: 'No results found.',
    searchCount: count =>
      `${count} ${count === 1 ? 'result' : 'results'} found.`,
    loadingMore: 'Loading…',
    more: 'Show more',
    author: 'By',
    category: 'Category',
    published: 'Published',
    updated: 'Updated',
    readingTime: 'Reading time',
    relatedPosts: 'Related posts',
    openGuide: 'Open the guide',
    newsletter: {
      title: 'Get new route and camping guides',
      description:
        'Sign up for a short email when I publish a new route, campsite or gear guide.',
      email: 'Email address',
      placeholder: 'you@example.com',
      submit: 'Subscribe'
    },
    minutes: count => `${count} min`,
    copyright: 'All rights reserved.',
    description:
      'Camping, hiking, routes and gear. Personal stories from the trail, preparation notes and practical guides.'
  }
}

const namesByPath = {
  '/': 'Home',
  '/iletisim/': 'Contact',
  '/category/kampcilik/': 'Camping',
  '/category/doga-yuruyusleri/': 'Hiking',
  '/category/rotalar/': 'Routes',
  '/category/doga-yuruyusleri-ve-kamp-ekipmanlari/': 'Gear',
  '/category/diger-her-sey/': 'Everything else',
  '/trekking-ne-demek/': 'Trekking',
  '/hiking-ne-demek/': 'Hiking',
  '/ibrahim-uylas-kimdir/': 'About İbrahim',
  '/neden-yola-cikmali/': 'Why Get Out There?'
}

const groupTitles = {
  'Hızlı Linkler': 'Quick links',
  Hakkında: 'About',
  Categories: 'Categories'
}

const categoryName = (category, language) =>
  language === 'en'
    ? namesByPath[category.slug] || category.name
    : category.name

const englishDate = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'long',
  timeZone: 'UTC'
})

const localizeArticle = (source, translation) => {
  if (!translation) return source

  return {
    ...source,
    ...translation.frontmatter,
    date:
      source.datePublished &&
      englishDate.format(new Date(source.datePublished)),
    modified:
      source.dateModified && englishDate.format(new Date(source.dateModified)),
    timeToRead: translation.timeToRead,
    tableOfContents: translation.tableOfContents,
    category: source.category && {
      ...source.category,
      name: categoryName(source.category, 'en')
    },
    tags: source.tags?.filter(Boolean).map(tag => {
      const { href, fallbackLanguage } = getLocalizedLink(tag.slug, 'en')
      return { ...tag, slug: href, hrefLang: fallbackLanguage }
    })
  }
}

const localizeMenu = (items, language) => {
  if (language === 'tr' || !items) return items

  return items.map(item => {
    if (item.items) {
      return {
        ...item,
        title: groupTitles[item.title] || item.title,
        items: localizeMenu(item.items, language)
      }
    }

    const { href, fallbackLanguage } = getLocalizedLink(item.slug, language)
    const name = namesByPath[item.slug] || item.name
    return {
      ...item,
      slug: href,
      name,
      fallbackLanguage,
      title: item.title || fallbackLinkTitle[fallbackLanguage]
    }
  })
}

module.exports = { copy, localizeArticle, localizeMenu }
