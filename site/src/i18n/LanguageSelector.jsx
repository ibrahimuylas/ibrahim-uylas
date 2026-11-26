import React, { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { Box, Flex } from 'theme-ui'
import { getLanguageSuggestion, languageNames, preferenceKey } from './language'

const switchDuration = 160
const reduceMotion = '(prefers-reduced-motion: reduce)'
const switchStyle = {
  position: 'relative',
  flexShrink: 0,
  borderRadius: 'full',
  bg: 'languageSwitchTrack'
}

const linkStyle = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 48,
  fontFamily: 'body',
  fontSize: 0,
  fontWeight: 'bold',
  lineHeight: 1,
  textDecoration: 'none',
  touchAction: 'manipulation',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    bg: 'rgba(15, 23, 42, 0.12)',
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${switchDuration}ms ease`
  },
  '&[data-highlighted="false"]::before': { opacity: 1 },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover::before': { opacity: 0 }
  },
  '&:focus-visible': {
    zIndex: 2,
    outline: '3px solid',
    outlineColor: 'alpha',
    outlineOffset: 2
  },
  [`@media ${reduceMotion}`]: {
    '&::before': { transition: 'none' }
  }
}

// Flag artwork from Wikimedia Commons (Flag of Turkey and Flag of England).
const flagStyles = {
  tr: {
    pl: '16px',
    color: '#fff',
    bg: '#e30a17',
    borderRadius: '999px 0 0 999px',
    backgroundImage:
      'linear-gradient(130deg, rgba(255, 131, 135, .24), transparent 43%, rgba(51, 0, 22, .58)), linear-gradient(90deg, transparent 36%, rgba(59, 2, 21, .60)), url("/flags/tr.png")',
    backgroundSize: 'cover, cover, 88% auto',
    backgroundPosition: 'left center',
    textShadow: '0 1px 3px rgba(55, 0, 15, .9)'
  },
  en: {
    color: '#122743',
    bg: '#f8f6f4',
    borderRadius: '0 999px 999px 0',
    backgroundImage:
      'radial-gradient(ellipse 52% 32% at center, #fff 35%, rgba(255, 255, 255, .65) 65%, transparent 100%), linear-gradient(140deg, rgba(255, 255, 255, .25), transparent 45%, rgba(99, 51, 54, .14)), url("/flags/en.png")',
    backgroundPosition: 'center',
    textShadow: '0 0 2px #fff'
  }
}

const indicatorStyle = {
  position: 'absolute',
  zIndex: 1,
  inset: '0 auto 0 0',
  width: '50%',
  pointerEvents: 'none',
  borderRadius: '999px 8px 8px 999px',
  boxShadow: 'inset 0 0 0 1px #fff, inset 0 0 0 3px #122743',
  transform: 'translateX(0)',
  transition: `transform ${switchDuration}ms ease-out, border-radius ${switchDuration}ms ease-out`,
  '&[data-side="en"]': {
    borderRadius: '8px 999px 999px 8px',
    transform: 'translateX(100%)'
  },
  [`@media ${reduceMotion}`]: { transition: 'none' }
}

const checkStyle = {
  position: 'absolute',
  right: 2,
  bottom: 1,
  display: 'grid',
  placeItems: 'center',
  width: 14,
  height: 14,
  border: '1px solid #fff',
  borderRadius: 'full',
  bg: '#122743',
  color: '#fff',
  svg: {
    width: 8,
    height: 8
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
  const [pendingLanguage, setPendingLanguage] = useState(null)
  const navigationTimer = useRef()

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
    const reset = () => {
      setPendingLanguage(null)
      update()
    }
    update()
    window.addEventListener('pageshow', reset)
    window.addEventListener('storage', update)
    return () => {
      window.clearTimeout(navigationTimer.current)
      window.removeEventListener('pageshow', reset)
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
    const { href } = event.currentTarget
    window.clearTimeout(navigationTimer.current)

    if (
      selectedLanguage === language ||
      window.matchMedia(reduceMotion).matches
    ) {
      window.location.assign(href)
      return
    }

    setPendingLanguage(selectedLanguage)
    navigationTimer.current = window.setTimeout(
      () => window.location.assign(href),
      switchDuration
    )
  }

  const highlightedLanguage = pendingLanguage || language

  return (
    <Flex
      as='nav'
      aria-label={language === 'en' ? 'Language' : 'Dil'}
      data-language-switch='true'
      sx={switchStyle}
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
            data-highlighted={targetLanguage === highlightedLanguage}
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
            sx={{ ...linkStyle, ...flagStyles[targetLanguage] }}
          >
            <Box as='span' sx={{ position: 'relative' }}>
              {code}
            </Box>
          </Box>
        )
      })}
      <Box
        as='span'
        aria-hidden='true'
        data-side={highlightedLanguage}
        sx={indicatorStyle}
      >
        <Box as='span' sx={checkStyle}>
          <FaCheck focusable='false' />
        </Box>
      </Box>
    </Flex>
  )
}
