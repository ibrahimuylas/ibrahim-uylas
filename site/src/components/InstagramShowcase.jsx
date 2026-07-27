import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Image as ThemeImage, Link, Text } from 'theme-ui'
import localPortrait from '../../content/authors/ibrahim-profil.jpg'
import { currentPagePath, trackEvent } from '../utils/analytics'
import policy from './instagramShowcasePolicy'

const PROFILE_URL = 'https://www.instagram.com/uylasonwheels/'
const MESSAGE_URL = 'https://ig.me/m/uylasonwheels'
const focusStyle = {
  '&:focus-visible': {
    outline: `3px solid`,
    outlineColor: `alpha`,
    outlineOffset: 2
  }
}
const railStyle = {
  display: `grid`,
  gridAutoFlow: [`column`, `column`, `column`, `row`],
  gridAutoColumns: [
    `calc((100% - 16px) / 2.4)`,
    `calc((100% - 16px) / 2.4)`,
    `calc((100% - 16px) / 2.4)`,
    `auto`
  ],
  gridTemplateColumns: [null, null, null, `repeat(6, minmax(0, 1fr))`],
  gap: 2,
  minWidth: 0,
  maxWidth: `100%`,
  overflowX: [`auto`, `auto`, `auto`, `visible`],
  overscrollBehaviorInline: `contain`,
  scrollSnapType: [`x proximity`, `x proximity`, `x proximity`, `none`],
  WebkitOverflowScrolling: `touch`,
  pb: [2, 2, 2, 0]
}

const InstagramShowcase = () => {
  const [status, setStatus] = useState('idle')
  const [feed, setFeed] = useState(null)
  const [portrait, setPortrait] = useState(localPortrait)

  useEffect(() => {
    const controller = new AbortController()
    const guard = policy.createRequestGuard()

    guard.commit(() => setStatus('loading'))

    fetch('/.netlify/functions/instagram-feed', {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    })
      .then(response => (response.ok ? response.json() : null))
      .then(value => {
        const validated = policy.validateFeed(value)
        guard.commit(() => {
          setFeed(validated)
          setStatus(validated ? 'ready' : 'failed')
        })

        if (validated) {
          const remotePortrait = new Image()
          remotePortrait.onload = () =>
            guard.commit(() => setPortrait(validated.profileImageUrl))
          remotePortrait.src = validated.profileImageUrl
        }
      })
      .catch(() => guard.commit(() => setStatus('failed')))

    return () => {
      guard.cancel()
      controller.abort()
    }
  }, [])

  const discardGallery = () => {
    setFeed(null)
    setStatus('failed')
  }
  const activation = (action, postPosition, mediaType) =>
    policy.createInstagramActivation({
      action,
      sourcePath: currentPagePath(),
      postPosition,
      mediaType,
      track: trackEvent
    })

  return (
    <Box
      as='section'
      aria-labelledby='instagram-showcase-title'
      sx={{
        width: `100%`,
        minWidth: 0,
        maxWidth: `100%`,
        overflow: `hidden`,
        bg: `alphaLighter`,
        borderRadius: `default`,
        px: [3, 4],
        py: [3, 4]
      }}
    >
      <Heading
        id='instagram-showcase-title'
        as='h2'
        sx={{
          borderLeft: t => `4px solid ${t.colors.alpha}`,
          pl: 3,
          mb: 3,
          fontSize: [3, 4]
        }}
      >
        Yolda beni takip et
      </Heading>
      <Flex
        sx={{
          alignItems: `center`,
          gap: 3,
          flexWrap: `wrap`,
          minWidth: 0
        }}
      >
        <ThemeImage
          src={portrait}
          width='72'
          height='72'
          alt='İbrahim Uylaş'
          onError={() => setPortrait(localPortrait)}
          sx={{
            width: 72,
            height: 72,
            objectFit: `cover`,
            borderRadius: `full`
          }}
        />
        <Box sx={{ flex: `1 1 12rem`, minWidth: 0 }}>
          <Text as='p' sx={{ fontWeight: `bold`, m: 0 }}>
            İbrahim Uylaş
          </Text>
          <Text as='p' sx={{ m: 0 }}>
            @uylasonwheels
          </Text>
          <Text as='p' sx={{ m: 0 }}>
            Londra’dan vahşi doğaya
          </Text>
        </Box>
        <Flex sx={{ gap: 2, flexWrap: `wrap`, minWidth: 0 }}>
          <Link
            href={PROFILE_URL}
            aria-label='Instagram’da @uylasonwheels profilini aç'
            onClick={activation('profile')}
            sx={{
              variant: `buttons.primary`,
              color: `contentBg`,
              bg: `heading`,
              borderColor: `heading`,
              display: `inline-flex`,
              alignItems: `center`,
              justifyContent: `center`,
              minHeight: 44,
              textDecoration: `none`,
              '&:hover': {
                color: `heading`,
                bg: `contentBg`,
                borderColor: `heading`
              },
              ...focusStyle
            }}
          >
            Takip et
          </Link>
          <Link
            href={MESSAGE_URL}
            aria-label='Instagram’da @uylasonwheels ile mesajlaşmayı aç'
            onClick={activation('message')}
            sx={{
              variant: `buttons.mute`,
              color: `heading`,
              bg: `transparent`,
              borderColor: `heading`,
              display: `inline-flex`,
              alignItems: `center`,
              justifyContent: `center`,
              minHeight: 44,
              textDecoration: `none`,
              '&:hover': {
                color: `contentBg`,
                bg: `heading`,
                borderColor: `heading`
              },
              ...focusStyle
            }}
          >
            Mesaj at
          </Link>
        </Flex>
      </Flex>
      <Text
        as='p'
        sx={{
          mt: 3,
          mb: 2,
          fontSize: 1,
          fontWeight: `bold`,
          color: `omegaDark`
        }}
      >
        Son 6 paylaşım
      </Text>
      {status === 'loading' && (
        <Box aria-label='Instagram paylaşımları yükleniyor' sx={railStyle}>
          {Array.from({ length: 6 }, (_, index) => (
            <Box
              key={index}
              sx={{
                aspectRatio: `1`,
                bg: `omegaLight`,
                borderRadius: `default`,
                scrollSnapAlign: `start`
              }}
            />
          ))}
        </Box>
      )}
      {status === 'ready' && feed && (
        <Box sx={railStyle}>
          {feed.posts.map((post, index) => (
            <Link
              key={post.id}
              href={post.permalink}
              aria-label={post.alt}
              onClick={activation('post', index + 1, post.type)}
              sx={{
                display: `block`,
                minWidth: 0,
                borderRadius: `default`,
                scrollSnapAlign: `start`,
                ...focusStyle
              }}
            >
              <ThemeImage
                src={post.imageUrl}
                alt={post.alt}
                width='320'
                height='320'
                loading='lazy'
                onError={discardGallery}
                sx={{
                  display: `block`,
                  width: `100%`,
                  aspectRatio: `1`,
                  objectFit: `cover`,
                  borderRadius: `default`
                }}
              />
            </Link>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default InstagramShowcase
