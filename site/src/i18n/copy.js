const { getLocalizedLink, fallbackLinkTitle } = require('./language')
const { tagName } = require('./collections')

const copy = {
  tr: {
    home: 'Ana sayfa',
    homePath: '/',
    backHome: 'Ana sayfaya dön',
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
    sectionMore: 'Daha Fazla',
    author: 'Yazan',
    category: 'Kategori',
    published: 'Yayımlandı',
    updated: 'Güncellendi',
    readingTime: 'Okuma Süresi',
    relatedPosts: 'İlgili Yazılar',
    openGuide: 'Ana rehbere git',
    homepage: {
      title: 'Kampçılık, Doğa Yürüyüşü ve Rota Rehberleri',
      heading: 'Kampçılık, doğa yürüyüşü ve rota rehberleri',
      description:
        'Kampçılık, doğa yürüyüşü, trekking, rota ve kamp ekipmanı rehberleri. Kişisel deneyimler, hazırlık notları ve yol hikâyeleri.',
      introduction:
        'Kamp hazırlığı, rota seçimi, ekipman kullanımı ve yol hikâyeleri; gerçek deneyimlerden süzülen pratik rehberler.',
      start: 'Doğaya çıkmaya buradan başla',
      featured: 'Öne çıkanlar ve son yazılar',
      authorImage: 'İbrahim Uylaş doğa yürüyüşünde',
      authorIntro:
        'Ben İbrahim Uylaş. Kampçı, doğa yürüyüşçüsü, maceracı, motosiklet tutkunu, yol yapmayı seven, yolda olan ve yolda yaşayan bir bilgisayar mühendisiyim.',
      authorAbout:
        "Şu aralar Londra'da yaşamaktayım ve kampçılık, doğa yürüyüşleri, ekipmanlar, rotalar ve yol anılarımı sizinle paylaşıyorum. Sende tecrübelerini yorum olarak ekleyip katkıda bulunabilirsin.",
      authorLink: 'Bu adam kim?',
      authorLinkLabel: 'İbrahim Uylaş kimdir'
    },
    pagination: {
      previous: 'Önceki',
      next: 'Sonraki',
      page: 'Sayfa',
      label: 'Sayfalama'
    },
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
    backHome: 'Back to the homepage',
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
    sectionMore: 'See more',
    author: 'By',
    category: 'Category',
    published: 'Published',
    updated: 'Updated',
    readingTime: 'Reading time',
    relatedPosts: 'Related posts',
    openGuide: 'Go to the main guide',
    homepage: {
      title: 'Camping, Hiking and Route Guides',
      heading: 'Camping, hiking and route guides',
      description:
        'Camping, hiking, trekking and gear guides, with route notes and personal stories from the road.',
      introduction:
        'Practical guides drawn from my own experience of planning camping trips, choosing routes and using gear, along with stories from the road.',
      start: 'Heading outdoors? Start here.',
      featured: 'Featured and recent articles',
      authorImage: 'İbrahim Uylaş out hiking',
      authorIntro:
        'I’m İbrahim Uylaş, a computer engineer who loves camping, hiking, adventure, motorcycling and life on the road.',
      authorAbout:
        'I’m currently based in London. I share camping and hiking advice, gear tips, routes and stories from my travels. I’d love to hear your own stories in the comments.',
      authorLink: 'Who’s this guy?',
      authorLinkLabel: 'About İbrahim Uylaş'
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      label: 'Pagination'
    },
    newsletter: {
      title: 'Get new route and camping guides',
      description:
        'Sign up for a short email when I publish a new route, campsite or gear guide.',
      email: 'Email address',
      placeholder: 'you@example.com',
      submit: 'Subscribe',
      success:
        'Thanks for signing up. Check your inbox for the confirmation link.',
      error: 'We couldn’t complete your subscription. Please try again shortly.'
    },
    minutes: count => `${count} min`,
    copyright: 'All rights reserved.'
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
      return {
        ...tag,
        name: tagName(tag.slug) || tag.name,
        slug: href,
        hrefLang: fallbackLanguage
      }
    })
  }
}

const localizePreview = (post, previews, { preserveSource = false } = {}) => {
  const preview = previews?.[post.slug]
  if (!preview) return post
  const category = post.category && {
    ...post.category,
    name: categoryName(post.category, 'en'),
    slug: getLocalizedLink(post.category.slug, 'en').href
  }
  return {
    ...post,
    title: preview.title,
    excerpt: preview.description,
    thumbnailText: preview.thumbnailText,
    date: preserveSource
      ? post.date
      : preview.date && englishDate.format(new Date(preview.date)),
    category: preserveSource ? post.category : category,
    slug: preserveSource ? post.slug : getLocalizedLink(post.slug, 'en').href,
    ...(post.author && {
      author: {
        ...post.author,
        slug: getLocalizedLink(post.author.slug, 'en').href
      }
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

module.exports = {
  categoryName,
  copy,
  localizeArticle,
  localizeMenu,
  localizePreview
}
