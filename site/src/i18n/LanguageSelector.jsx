import React, { useEffect, useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { getLanguageSuggestion, languageNames, preferenceKey } from './language'

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 'full',
  color: 'article',
  fontFamily: 'body',
  fontSize: 0,
  fontWeight: 'semibold',
  lineHeight: 1,
  textDecoration: 'none',
  touchAction: 'manipulation',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': { color: 'heading', bg: 'headerBg' }
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'alpha',
    outlineOffset: -2
  },
  '&[aria-current="page"]': {
    color: 'heading',
    bg: 'languageSwitchSelected',
    fontWeight: 'bold',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)'
  }
}

function readPreference() {
  try {
    return window.localStorage.getItem(preferenceKey)
  } catch {
    return null
  }
}

function rememberPreference(language) {
  try {
    window.localStorage.setItem(preferenceKey, language)
  } catch {
    // The links remain usable when the browser denies storage.
  }
}

export default function LanguageSelector({ pathname, language, links }) {
  const [suggestion, setSuggestion] = useState(null)

  useEffect(() => {
    if (!links) return undefined

    const update = () => {
      setSuggestion(
        getLanguageSuggestion(
          pathname,
          readPreference(),
          window.navigator.languages ||
            [window.navigator.language].filter(Boolean)
        )
      )
    }
    update()
    window.addEventListener('pageshow', update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener('pageshow', update)
      window.removeEventListener('storage', update)
    }
  }, [links, pathname])

  if (!links) return null

  const select = (event, selectedLanguage) => {
    rememberPreference(selectedLanguage)
    setSuggestion(null)

    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return

    // Load the destination document instead of letting Gatsby intercept the link.
    event.preventDefault()
    window.location.assign(event.currentTarget.href)
  }

  return (
    <Flex
      as='nav'
      aria-label={language === 'en' ? 'Language' : 'Dil'}
      data-language-switch='true'
      sx={{ p: '2px', bg: 'languageSwitchTrack', borderRadius: 'full' }}
    >
      {Object.entries(links).map(([targetLanguage, href]) => {
        const code = targetLanguage.toUpperCase()
        const isSuggested = targetLanguage === suggestion

        return (
          <Box
            as='a'
            key={targetLanguage}
            href={href}
            hrefLang={targetLanguage}
            lang={targetLanguage}
            aria-label={`${code} ${languageNames[targetLanguage]}`}
            aria-current={targetLanguage === language ? 'page' : undefined}
            title={
              isSuggested
                ? targetLanguage === 'en'
                  ? 'Read this page in English'
                  : 'Bu sayfayı Türkçe oku'
                : languageNames[targetLanguage]
            }
            onClick={event => select(event, targetLanguage)}
            sx={
              isSuggested ? { ...linkStyle, color: 'alphaDarker' } : linkStyle
            }
          >
            {code}
          </Box>
        )
      })}
    </Flex>
  )
}
