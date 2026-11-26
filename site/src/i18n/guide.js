const english = require('./guide-copy.en.json')
const { getLocalizedLink } = require('./language')

const copyFields = new Set([
  'allContentDescription',
  'context',
  'ctaLabel',
  'description',
  'eyebrow',
  'imageAlt',
  'journalLabel',
  'label',
  'navLabel',
  'secondaryCtaLabel',
  'summary',
  'text',
  'title'
])

const guideCopy = (value, language) =>
  language === 'en' ? english[value] || value : value

const localizeGuide = (guide, language) => {
  if (language === 'tr') return guide
  const translate = value => {
    if (Array.isArray(value)) return value.map(translate)
    if (!value || typeof value !== 'object') return value
    return Object.fromEntries(
      Object.entries(value).map(([key, data]) => [
        key,
        copyFields.has(key) ? guideCopy(data, language) : translate(data)
      ])
    )
  }
  return translate(guide)
}

const guidePath = (path, language) => {
  if (language === 'tr') return path
  const alias =
    path === '/category/ekipmanlar/'
      ? '/category/doga-yuruyusleri-ve-kamp-ekipmanlari/'
      : path
  return getLocalizedLink(alias, language).href
}

const guideCategoryName = (name, language) =>
  language === 'en'
    ? {
        Kampçılık: 'Camping',
        Ekipmanlar: 'Gear',
        Rotalar: 'Routes',
        'Doğa Yürüyüşleri': 'Hiking',
        Diğer: 'Everything else'
      }[name] || name
    : name

module.exports = { guideCategoryName, guideCopy, guidePath, localizeGuide }
