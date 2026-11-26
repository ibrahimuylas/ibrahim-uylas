import React, { useEffect, useState } from 'react'
import { Box, Flex, Link } from 'theme-ui'
import {
  getLanguageLinks,
  getLanguageSuggestion,
  languageNames,
  preferenceKey
} from './language'

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  px: 2,
  borderRadius: 'default',
  color: 'heading',
  textDecoration: 'underline',
  touchAction: 'manipulation',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': { bg: 'omegaLighter' }
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'alpha',
    outlineOffset: 2
  },
  '&[aria-current="page"]': { fontWeight: 'bold', textDecoration: 'none' }
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

export default function LanguageSelector({ pathname, language }) {
  const links = getLanguageLinks(pathname)
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

  const select = selectedLanguage => {
    rememberPreference(selectedLanguage)
    setSuggestion(null)
  }

  return (
    <Box
      as='nav'
      aria-label={language === 'en' ? 'Language' : 'Dil'}
      sx={{ fontSize: 0 }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          whiteSpace: 'nowrap'
        }}
      >
        {Object.entries(links).map(([targetLanguage, href]) => (
          <Link
            key={targetLanguage}
            href={href}
            hrefLang={targetLanguage}
            lang={targetLanguage}
            aria-current={targetLanguage === language ? 'page' : undefined}
            onClick={() => select(targetLanguage)}
            sx={linkStyle}
          >
            {languageNames[targetLanguage]}
          </Link>
        ))}
      </Flex>
      {suggestion && links[suggestion] && (
        <Box sx={{ textAlign: 'right' }}>
          <Link
            href={links[suggestion]}
            hrefLang={suggestion}
            lang={suggestion}
            onClick={() => select(suggestion)}
            sx={linkStyle}
          >
            {suggestion === 'en'
              ? 'Read this page in English'
              : 'Bu sayfayı Türkçe oku'}
          </Link>
        </Box>
      )}
    </Box>
  )
}
