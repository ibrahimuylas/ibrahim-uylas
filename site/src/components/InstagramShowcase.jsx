import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Heading, Image as ThemeImage, Link, Text } from 'theme-ui'
import { FaClone, FaPlay } from 'react-icons/fa'
import { currentPagePath, trackEvent } from '../utils/analytics'
import policy from './instagramShowcasePolicy'
import InstagramNewsletter from './InstagramNewsletter'

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
  gridAutoFlow: `column`,
  gridAutoColumns: [
    `calc((100% - 16px) / 2.45)`,
    `calc((100% - 32px) / 3.2)`,
    `calc((100% - 48px) / 4.2)`,
    `calc((100% - 64px) / 4.45)`
  ],
  gap: [2, 3],
  px: [3, 4, 5],
  pb: 1,
  minWidth: 0,
  maxWidth: `100%`,
  overflowX: `auto`,
  overflowY: `hidden`,
  overscrollBehaviorInline: `contain`,
  scrollPaddingInline: [3, 4, 5],
  scrollSnapType: `x proximity`,
  scrollbarWidth: `none`,
  WebkitOverflowScrolling: `touch`,
  '&::-webkit-scrollbar': {
    display: `none`
  }
}
const sectionStyle = {
  width: `100%`,
  minWidth: 0,
  maxWidth: `100%`,
  overflow: `hidden`,
  bg: `contentBg`,
  borderRadius: 0,
  pt: 3,
  pb: 0
}
const skeletonStyle = {
  bg: `omegaLight`,
  borderRadius: [`12px`, `16px`]
}

const InstagramSkeleton = () => (
  <Box
    as='section'
    role='status'
    aria-live='polite'
    aria-busy='true'
    aria-label='Instagram bölümü yükleniyor'
    data-instagram-state='loading'
    sx={sectionStyle}
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
          `"portrait title title"
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
      <Box
        aria-hidden='true'
        sx={{
          ...skeletonStyle,
          gridArea: `title`,
          width: [`88%`, `72%`, `46%`],
          height: [28, 36, 44]
        }}
      />
      <Box
        aria-hidden='true'
        sx={{
          ...skeletonStyle,
          gridArea: `portrait`,
          width: [72, 88, 96],
          height: [72, 88, 96],
          borderRadius: `14px`
        }}
      />
      <Box sx={{ gridArea: `identity`, minWidth: 0 }}>
        <Box
          aria-hidden='true'
          sx={{ ...skeletonStyle, width: [`74%`, `56%`], height: 20 }}
        />
        <Box
          aria-hidden='true'
          sx={{
            ...skeletonStyle,
            width: [`92%`, `76%`],
            height: 16,
            mt: 2
          }}
        />
      </Box>
      <Flex
        aria-hidden='true'
        sx={{
          gridArea: `actions`,
          justifyContent: `flex-end`,
          gap: 2,
          mt: [1, 2, 0]
        }}
      >
        <Box sx={{ ...skeletonStyle, width: [`50%`, 144], height: 48 }} />
        <Box sx={{ ...skeletonStyle, width: [`50%`, 144], height: 48 }} />
      </Flex>
    </Box>
    <Box aria-hidden='true' sx={{ ...railStyle, mt: [3, 4] }}>
      {Array.from({ length: 6 }, (_, index) => (
        <Box
          key={index}
          sx={{
            ...skeletonStyle,
            aspectRatio: `1 / 1`,
            scrollSnapAlign: `start`
          }}
        />
      ))}
    </Box>
  </Box>
)

const InstagramShowcase = ({ showNewsletter = true }) => {
  const [status, setStatus] = useState('loading')
  const [feed, setFeed] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const guard = policy.createRequestGuard()

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
      })
      .catch(() => guard.commit(() => setStatus('failed')))

    return () => {
      guard.cancel()
      controller.abort()
    }
  }, [])

  if (status === 'loading') {
    return (
      <Box sx={{ width: `100%`, minWidth: 0 }}>
        <InstagramSkeleton />
        {showNewsletter && <InstagramNewsletter />}
      </Box>
    )
  }

  if (status !== 'ready' || !feed) {
    return showNewsletter ? (
      <Box sx={{ width: `100%`, minWidth: 0 }}>
        <InstagramNewsletter />
      </Box>
    ) : null
  }

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
  const profile = feed.profile

  return (
    <Box sx={{ width: `100%`, minWidth: 0 }}>
      <Box
        as='section'
        aria-labelledby='instagram-showcase-title'
        data-instagram-state='ready'
        sx={sectionStyle}
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
              `"portrait title title"
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
              fontSize: [4, 6, 7],
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: `-0.02em`,
              whiteSpace: `nowrap`,
              m: 0
            }}
          >
            Yoldaki hikâyeleri kaçırma
          </Heading>
          <ThemeImage
            src={feed.profileImageUrl}
            width='96'
            height='96'
            alt={profile.name}
            onError={discardGallery}
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
        <Box sx={{ ...railStyle, mt: [3, 4] }}>
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
                p: `3px`,
                bg: `contentBg`,
                borderWidth: 1,
                borderStyle: `solid`,
                borderColor: `omegaLight`,
                borderRadius: [`12px`, `16px`],
                boxShadow: `0 8px 24px rgba(31, 42, 68, 0.08)`,
                overflow: `hidden`,
                scrollSnapAlign: `start`,
                transition: `transform 250ms ease, box-shadow 250ms ease`,
                '&:hover': {
                  transform: `translateY(-3px)`,
                  boxShadow: `0 14px 32px rgba(31, 42, 68, 0.14)`
                },
                '&:hover img': {
                  transform: `scale(1.035)`
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
                    width: 30,
                    height: 30,
                    color: `white`,
                    bg: `rgba(31, 42, 68, 0.76)`,
                    borderRadius: `full`,
                    boxShadow: `0 3px 10px rgba(0, 0, 0, 0.22)`,
                    backdropFilter: `blur(6px)`,
                    svg: { width: 12, height: 12 }
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
                  aspectRatio: `1 / 1`,
                  objectFit: `cover`,
                  borderRadius: [`9px`, `13px`],
                  transition: `transform 250ms ease`
                }}
              />
            </Link>
          ))}
        </Box>
      </Box>
      {showNewsletter && <InstagramNewsletter />}
    </Box>
  )
}

export default InstagramShowcase

InstagramShowcase.propTypes = {
  showNewsletter: PropTypes.bool
}
