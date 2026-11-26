const translations = require('./translations.json')

const languageNames = { tr: 'Türkçe', en: 'English' }
const fallbackLinkTitle = { tr: 'Page in Turkish', en: 'İngilizce sayfa' }
const preferenceKey = 'site-language-v1'

const normalizePath = pathname =>
  pathname === '/' || pathname.endsWith('.html')
    ? pathname
    : `${pathname.replace(/\/+$/, '')}/`

const pairsByPath = new Map(
  translations.flatMap(({ tr, en }) => [
    [tr, { tr, en }],
    [en, { tr, en }]
  ])
)

const getPageLanguage = (pathname = '/') =>
  normalizePath(pathname).startsWith('/en/') ? 'en' : 'tr'

const getLanguageLinks = (pathname = '/') =>
  pairsByPath.get(normalizePath(pathname))

const preferredLanguage = (stored, browserLanguages) => {
  if (Object.hasOwn(languageNames, stored)) return stored

  return browserLanguages
    .map(tag => tag.toLowerCase().split('-')[0])
    .find(language => Object.hasOwn(languageNames, language))
}

const getLanguageSuggestion = (pathname, stored, browserLanguages = []) => {
  const preferred = preferredLanguage(stored, browserLanguages)
  return preferred !== getPageLanguage(pathname) &&
    getLanguageLinks(pathname)?.[preferred]
    ? preferred
    : null
}

const getLocalizedLink = (href, language) => {
  if (
    typeof href !== 'string' ||
    !href.startsWith('/') ||
    href.startsWith('//')
  )
    return { href }

  const [, pathname, suffix] = href.match(/^([^?#]*)(.*)$/)
  const links = getLanguageLinks(pathname)
  if (!links && /\.[a-z]{2,5}$/i.test(pathname) && !pathname.endsWith('.html'))
    return { href }
  const target = links?.[language] || pathname
  const targetLanguage = getPageLanguage(target)

  return {
    href: `${target}${suffix}`,
    fallbackLanguage: language !== targetLanguage ? targetLanguage : undefined
  }
}

const getSourcePath = pathname => {
  const path = normalizePath(pathname)
  return getLanguageLinks(path)?.tr || path
}

const shouldNoIndex = pathname =>
  /^\/(?:author|tag)\//.test(getSourcePath(pathname)) ||
  /\/page\/\d+\/?$/.test(getSourcePath(pathname))

module.exports = {
  fallbackLinkTitle,
  getLanguageLinks,
  getLanguageSuggestion,
  getLocalizedLink,
  getPageLanguage,
  getSourcePath,
  languageNames,
  normalizePath,
  preferenceKey,
  shouldNoIndex
}
