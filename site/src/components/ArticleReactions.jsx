import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Heading, Message, Spinner, Text } from 'theme-ui'

const VISITOR_STORAGE_KEY = 'article-reaction-visitor-v1'

const reactionOptions = [
  { key: 'like', emoji: '👍', label: { tr: 'Beğendim', en: 'Like' } },
  { key: 'funny', emoji: '😂', label: { tr: 'Eğlendim', en: 'Funny' } },
  { key: 'love', emoji: '😍', label: { tr: 'Bayıldım', en: 'Love' } },
  { key: 'surprised', emoji: '😮', label: { tr: 'Şaşırdım', en: 'Surprised' } },
  { key: 'angry', emoji: '😡', label: { tr: 'Kızdım', en: 'Angry' } },
  { key: 'sad', emoji: '😢', label: { tr: 'Üzüldüm', en: 'Sad' } }
]

const createVisitorId = () => {
  if (typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  const bytes = new Uint8Array(20)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, value => value.toString(16).padStart(2, '0')).join(
    ''
  )
}

const getVisitorId = () => {
  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY)
  if (existing) return existing
  const created = createVisitorId()
  window.localStorage.setItem(VISITOR_STORAGE_KEY, created)
  return created
}

const parseResponse = async response => {
  const responseText = await response.text()
  let result = null
  try {
    result = responseText ? JSON.parse(responseText) : null
  } catch {
    result = null
  }

  if (!response.ok || result?.ok === false) {
    throw new Error(result?.error || 'Tepkiler şu anda kullanılamıyor.')
  }
  return result
}

const reactionLabels = {
  tr: {
    heading: 'Bu yazıyı nasıl buldun?',
    first: 'İlk tepkiyi sen verebilirsin.',
    toolbar: 'Yazı tepkileri',
    loading: 'Yükleniyor…',
    loadError: 'Tepkiler şu anda yüklenemiyor.',
    voteError: 'Tepkin kaydedilemedi.',
    count: number => `${number} tepki`
  },
  en: {
    heading: 'What did you think of this article?',
    first: 'Be the first to react.',
    toolbar: 'Article reactions',
    loading: 'Loading…',
    loadError: 'Reactions could not be loaded.',
    voteError: 'Your reaction could not be saved.',
    count: number => `${number} ${number === 1 ? 'reaction' : 'reactions'}`
  }
}

const ArticleReactions = ({ title, slug, language = 'tr' }) => {
  const labels = reactionLabels[language]
  const path = slug?.startsWith('/')
    ? slug
    : typeof window !== 'undefined'
      ? window.location.pathname
      : '/'
  const [visitor, setVisitor] = useState('')
  const [counts, setCounts] = useState({})
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const applyResult = useCallback(result => {
    setCounts(
      Object.fromEntries(
        (result?.items || []).map(item => [
          item.reaction,
          Number(item.count) || 0
        ])
      )
    )
    setSelected(result?.selected || null)
  }, [])

  useEffect(() => {
    let cancelled = false
    const visitorId = getVisitorId()
    setVisitor(visitorId)

    const load = async () => {
      try {
        const query = new URLSearchParams({ post: path })
        const response = await fetch(`/api/reactions?${query}`, {
          headers: { 'X-Reaction-Visitor': visitorId }
        })
        const result = await parseResponse(response)
        if (cancelled) return
        applyResult(result)
        setStatus('ready')
      } catch (loadError) {
        if (cancelled) return
        setError(
          language === 'en'
            ? labels.loadError
            : loadError.message || labels.loadError
        )
        setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [applyResult, labels, language, path])

  const total = useMemo(
    () =>
      reactionOptions.reduce(
        (sum, option) => sum + (counts[option.key] || 0),
        0
      ),
    [counts]
  )

  const vote = async reaction => {
    if (!visitor || status === 'saving') return
    setStatus('saving')
    setError('')
    try {
      const response = await fetch('/api/reactions/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          title: title || 'Yazı',
          reaction,
          visitor
        })
      })
      applyResult(await parseResponse(response))
      setStatus('ready')
    } catch (voteError) {
      setError(
        language === 'en'
          ? labels.voteError
          : voteError.message || labels.voteError
      )
      setStatus('error')
    }
  }

  return (
    <Box
      as='section'
      data-article-reactions
      aria-labelledby='article-reactions-heading'
      sx={{
        mt: 4,
        p: [3, 4],
        bg: 'contentBg',
        border: '1px solid',
        borderColor: 'omegaLight',
        borderRadius: '18px'
      }}
    >
      <Flex
        sx={{
          alignItems: ['flex-start', 'center'],
          justifyContent: 'space-between',
          flexDirection: ['column', 'row'],
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Heading
            id='article-reactions-heading'
            as='h2'
            sx={{ color: 'heading', fontSize: [2, 3], m: 0 }}
          >
            {labels.heading}
          </Heading>
          <Text as='p' sx={{ color: 'omegaDark', fontSize: 1, mt: 1, mb: 0 }}>
            {total ? labels.count(total) : labels.first}
          </Text>
        </Box>
        {status === 'loading' && (
          <Flex role='status' sx={{ alignItems: 'center', gap: 2 }}>
            <Spinner size={18} />{' '}
            <Text sx={{ fontSize: 1 }}>{labels.loading}</Text>
          </Flex>
        )}
      </Flex>

      <Box
        role='toolbar'
        aria-label={labels.toolbar}
        sx={{
          display: 'grid',
          gridTemplateColumns: [
            'repeat(3, minmax(0, 1fr))',
            'repeat(6, minmax(0, 1fr))'
          ],
          gap: 2
        }}
      >
        {reactionOptions.map(option => {
          const active = selected === option.key
          return (
            <Button
              key={option.key}
              type='button'
              variant='mute'
              aria-pressed={active}
              aria-label={`${option.label[language]}: ${labels.count(counts[option.key] || 0)}`}
              disabled={!visitor || status === 'loading' || status === 'saving'}
              onClick={() => vote(option.key)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1,
                minWidth: 0,
                minHeight: 92,
                px: 1,
                py: 2,
                color: active ? 'alpha' : 'heading',
                bg: active ? 'alphaLighter' : 'background',
                border: '1px solid',
                borderColor: active ? 'alpha' : 'omegaLight',
                borderRadius: '14px',
                boxShadow: active
                  ? theme => `0 0 0 2px ${theme.colors.alphaLighter}`
                  : 'none',
                transition:
                  'transform 160ms ease, border-color 160ms ease, background-color 160ms ease',
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover:not(:disabled)': {
                    color: 'alpha',
                    bg: 'alphaLighter',
                    borderColor: 'alphaLight',
                    transform: 'translateY(-2px)'
                  }
                },
                '&:focus-visible': {
                  outline: '3px solid',
                  outlineColor: 'alphaLight',
                  outlineOffset: 2
                },
                '&:disabled': { opacity: status === 'saving' ? 0.65 : 1 }
              }}
            >
              <Box
                as='span'
                aria-hidden='true'
                sx={{ fontSize: 4, lineHeight: 1 }}
              >
                {option.emoji}
              </Box>
              <Text as='span' sx={{ fontSize: 0, fontWeight: 'bold' }}>
                {option.label[language]}
              </Text>
              <Text as='span' sx={{ color: 'omegaDark', fontSize: 0 }}>
                {counts[option.key] || 0}
              </Text>
            </Button>
          )
        })}
      </Box>

      {error && (
        <Message role='alert' sx={{ mt: 3, borderRadius: '8px' }}>
          {error}
        </Message>
      )}
    </Box>
  )
}

ArticleReactions.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string
}

export default ArticleReactions
