const assert = require('node:assert/strict')
const test = require('node:test')
const {
  getLanguageLinks,
  getLanguageSuggestion,
  getLocalizedLink
} = require('./language')
const { localizeMenu } = require('./copy')

test('keeps navigation labels clean and maps destinations to English', () => {
  const [contact, camping] = localizeMenu(
    [
      { name: 'İletişim', slug: '/iletisim/' },
      { name: 'Kampçılık', slug: '/category/kampcilik/' }
    ],
    'en'
  )
  assert.equal(contact.name, 'Contact')
  assert.equal(contact.slug, '/en/contact/')
  assert.equal(contact.fallbackLanguage, undefined)
  assert.equal(contact.title, undefined)
  assert.equal(camping.name, 'Camping')
  assert.equal(camping.slug, '/en/category/camping/')
  assert.equal(camping.fallbackLanguage, undefined)
})

test('keeps both URLs authoritative and offers the matching article in the preferred language', () => {
  assert.deepEqual(getLanguageLinks('/outdoor-ne-demek/'), {
    tr: '/outdoor-ne-demek/',
    en: '/en/what-does-outdoor-mean/'
  })
  assert.equal(
    getLanguageSuggestion('/outdoor-ne-demek/', null, ['fr', 'en-GB', 'tr-TR']),
    'en'
  )
  assert.equal(
    getLanguageSuggestion('/en/what-does-outdoor-mean/', 'tr', ['en-GB']),
    'tr'
  )
  assert.equal(
    getLanguageSuggestion('/outdoor-ne-demek/', 'tr', ['en-GB']),
    null
  )
  assert.equal(
    getLanguageSuggestion('/untranslated-example/', null, [
      'en'
    ]),
    null
  )
})

test('follows published translations and identifies fallback destinations without losing fragments', () => {
  assert.deepEqual(
    getLocalizedLink('/outdoor-ne-demek/?ref=gear#outdoor', 'en'),
    {
      href: '/en/what-does-outdoor-mean/?ref=gear#outdoor',
      fallbackLanguage: undefined
    }
  )
  assert.deepEqual(getLocalizedLink('/untranslated-example/', 'en'), {
    href: '/untranslated-example/',
    fallbackLanguage: 'tr'
  })
  assert.deepEqual(getLocalizedLink('https://example.com/', 'en'), {
    href: 'https://example.com/'
  })
  assert.equal(
    getLanguageSuggestion('/outdoor-ne-demek/', null, ['fr', 'de']),
    null
  )
  assert.equal(
    getLanguageSuggestion('/en/what-does-outdoor-mean/', null, ['TR-tr', 'en']),
    'tr'
  )
})
