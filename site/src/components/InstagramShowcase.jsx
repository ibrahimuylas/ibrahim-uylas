import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import localPortrait from '../../content/authors/ibrahim-profil.jpg'
import policy from './instagramShowcasePolicy'

const PROFILE_URL = 'https://www.instagram.com/uylasonwheels/'
const MESSAGE_URL = 'https://ig.me/m/uylasonwheels'

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

  return (
    <Box
      as='section'
      aria-labelledby='instagram-showcase-title'
      sx={{ width: `100%`, bg: `alphaLighter`, borderRadius: `default`, p: 4 }}
    >
      <Heading
        id='instagram-showcase-title'
        as='h2'
        sx={{ borderLeft: t => `4px solid ${t.colors.alpha}`, pl: 3, mb: 3 }}
      >
        Yolda beni takip et
      </Heading>
      <Flex sx={{ alignItems: `center`, gap: 3, flexWrap: `wrap` }}>
        <img
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
        <Box sx={{ flex: `1 1 12rem` }}>
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
        <Flex sx={{ gap: 2, flexWrap: `wrap` }}>
          <a
            href={PROFILE_URL}
            aria-label='Instagram’da @uylasonwheels profilini aç'
          >
            Takip et
          </a>
          <a
            href={MESSAGE_URL}
            aria-label='Instagram’da @uylasonwheels ile mesajlaşmayı aç'
          >
            Mesaj at
          </a>
        </Flex>
      </Flex>
      <Text as='p' sx={{ mt: 3, mb: 2, fontWeight: `bold` }}>
        Son 6 paylaşım
      </Text>
      {status === 'loading' && (
        <Box
          aria-label='Instagram paylaşımları yükleniyor'
          sx={{
            display: `grid`,
            gridTemplateColumns: `repeat(6, 1fr)`,
            gap: 2
          }}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <Box
              key={index}
              sx={{
                aspectRatio: `1`,
                bg: `omegaLight`,
                borderRadius: `default`
              }}
            />
          ))}
        </Box>
      )}
      {status === 'ready' && feed && (
        <Box
          sx={{
            display: `grid`,
            gridTemplateColumns: `repeat(6, 1fr)`,
            gap: 2
          }}
        >
          {feed.posts.map(post => (
            <a key={post.id} href={post.permalink} aria-label={post.alt}>
              <img
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
            </a>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default InstagramShowcase
