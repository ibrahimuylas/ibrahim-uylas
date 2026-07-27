import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Image as ThemeImage, Link, Text } from 'theme-ui'
import { FaClone, FaPlay } from 'react-icons/fa'
import localPortrait from '../../content/authors/ibrahim-profil.jpg'
import { currentPagePath, trackEvent } from '../utils/analytics'
import policy from './instagramShowcasePolicy'

const PROFILE_URL = 'https://www.instagram.com/uylasonwheels/'
const MESSAGE_URL = 'https://ig.me/m/uylasonwheels'
const FALLBACK_PROFILE = {
  name: 'İbrahim Uylaş',
  username: 'uylasonwheels',
  biography: 'Londra’dan vahşi doğaya'
}
const focusStyle = {
  '&:focus-visible': {
    outline: `3px solid`,
    outlineColor: `alpha`,
    outlineOffset: 2
  }
}
const railStyle = {
  display: `grid`,
  gridAutoFlow: `column`,
  gridAutoColumns: [
    `calc((100% - 16px) / 2.45)`,
    `calc((100% - 32px) / 3.2)`,
    `calc((100% - 48px) / 4.2)`,
    `calc((100% - 64px) / 4.45)`
  ],
  gap: [2, 3],
  minWidth: 0,
  maxWidth: `100%`,
  overflowX: `auto`,
  overflowY: `hidden`,
  overscrollBehaviorInline: `contain`,
  scrollSnapType: `x proximity`,
  scrollbarWidth: `none`,
  WebkitOverflowScrolling: `touch`,
  '&::-webkit-scrollbar': {
    display: `none`
  }
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
  const profile = feed?.profile || FALLBACK_PROFILE

  return (
    <Box
      as='section'
      aria-labelledby='instagram-showcase-title'
      sx={{
        width: `100%`,
        minWidth: 0,
        maxWidth: `100%`,
        overflow: `hidden`,
        bg: `contentBg`,
        borderRadius: 0,
        pt: [4, 5],
        pb: [4, 6]
      }}
    >
      <Box
        sx={{
          display: `grid`,
          gridTemplateAreas: [
            `"title title"
             "portrait identity"
             "actions actions"`,
            `"title title"
             "portrait identity"
             "actions actions"`,
            `"portrait title actions"
             "portrait identity actions"`
          ],
          gridTemplateColumns: [
            `72px minmax(0, 1fr)`,
            `88px minmax(0, 1fr)`,
            `96px minmax(0, 1fr) auto`
          ],
          alignItems: `center`,
          columnGap: [3, 4],
          rowGap: [3, 2],
          px: [3, 4, 5],
          minWidth: 0
        }}
      >
        <Heading
          id='instagram-showcase-title'
          as='h2'
          sx={{
            gridArea: `title`,
            color: `heading`,
            fontFamily: `'DM Serif Display', Georgia, serif`,
            fontSize: [6, 6, 7],
            fontWeight: 400,
            lineHeight: 1.08,
            letterSpacing: `-0.02em`,
            m: 0
          }}
        >
          Yolda beni takip et
        </Heading>
        <ThemeImage
          src={portrait}
          width='96'
          height='96'
          alt={profile.name}
          onError={() => setPortrait(localPortrait)}
          sx={{
            gridArea: `portrait`,
            alignSelf: `end`,
            width: [72, 88, 96],
            height: [72, 88, 96],
            p: `3px`,
            objectFit: `cover`,
            bg: `contentBg`,
            borderRadius: `14px`,
            boxShadow: `0 0 0 2px #9333ea`
          }}
        />
        <Box sx={{ gridArea: `identity`, alignSelf: `start`, minWidth: 0 }}>
          <Flex
            sx={{
              alignItems: [`flex-start`, `center`],
              flexDirection: [`column`, `row`],
              columnGap: 2,
              rowGap: 0,
              minWidth: 0
            }}
          >
            <Text
              as='p'
              sx={{
                color: `heading`,
                fontSize: [2, 3],
                fontWeight: `bold`,
                lineHeight: `heading`,
                whiteSpace: `nowrap`,
                m: 0
              }}
            >
              {profile.name}
            </Text>
            <Text
              as='p'
              sx={{
                color: `omegaDark`,
                fontSize: [1, 2],
                lineHeight: `body`,
                whiteSpace: `nowrap`,
                m: 0
              }}
            >
              @{profile.username}
            </Text>
          </Flex>
          {profile.biography && (
            <Text
              as='p'
              sx={{
                color: `text`,
                fontSize: [1, 2],
                lineHeight: `body`,
                mt: [0, 1],
                mb: 0
              }}
            >
              {profile.biography}
            </Text>
          )}
        </Box>
        <Flex
          sx={{
            gridArea: `actions`,
            alignSelf: `end`,
            justifyContent: `flex-end`,
            gap: 2,
            mt: [1, 2, 0],
            minWidth: 0
          }}
        >
          <Link
            href={PROFILE_URL}
            aria-label='Instagram’da @uylasonwheels profilini aç'
            onClick={activation('profile')}
            sx={{
              variant: `buttons.primary`,
              color: `contentBg`,
              bg: `heading`,
              borderColor: `heading`,
              borderRadius: 0,
              display: `inline-flex`,
              flex: [`1 1 0`, `0 0 auto`],
              minWidth: [0, `9rem`],
              minHeight: [44, 48],
              px: [3, 4],
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.08em`,
              textDecoration: `none`,
              '&:hover': {
                color: `contentBg`,
                bg: `alpha`,
                borderColor: `alpha`
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
              borderColor: `omegaDark`,
              borderRadius: 0,
              display: `inline-flex`,
              flex: [`1 1 0`, `0 0 auto`],
              minWidth: [0, `9rem`],
              minHeight: [44, 48],
              px: [3, 4],
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.08em`,
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
      </Box>
      <Text
        sx={{
          position: `absolute`,
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: `hidden`,
          clip: `rect(0, 0, 0, 0)`,
          whiteSpace: `nowrap`,
          border: 0
        }}
      >
        Son 6 paylaşım
      </Text>
      {status === 'loading' && (
        <Box
          aria-label='Instagram paylaşımları yükleniyor'
          sx={{ ...railStyle, mx: 0, mt: [4, 5] }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Box
              key={index}
              sx={{
                aspectRatio: `5 / 6`,
                bg: `omegaLight`,
                borderRadius: 0,
                scrollSnapAlign: `start`
              }}
            />
          ))}
        </Box>
      )}
      {status === 'ready' && feed && (
        <Box sx={{ ...railStyle, mx: 0, mt: [4, 5] }}>
          {feed.posts.map((post, index) => (
            <Link
              key={post.id}
              href={post.permalink}
              aria-label={post.alt}
              onClick={activation('post', index + 1, post.type)}
              sx={{
                position: `relative`,
                display: `block`,
                minWidth: 0,
                borderRadius: 0,
                overflow: `hidden`,
                scrollSnapAlign: `start`,
                '&:hover img': {
                  transform: `scale(1.015)`
                },
                ...focusStyle
              }}
            >
              {post.type !== 'IMAGE' && (
                <Box
                  aria-hidden='true'
                  sx={{
                    position: `absolute`,
                    zIndex: 1,
                    top: 2,
                    right: 2,
                    display: `grid`,
                    placeItems: `center`,
                    width: 28,
                    height: 28,
                    color: `white`,
                    filter: `drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6))`
                  }}
                >
                  {post.type === 'VIDEO' ? <FaPlay /> : <FaClone />}
                </Box>
              )}
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
                  aspectRatio: `5 / 6`,
                  objectFit: `cover`,
                  borderRadius: 0,
                  transition: `transform 250ms ease`
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
