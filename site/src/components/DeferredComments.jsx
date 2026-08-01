import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Heading, Spinner, Text } from 'theme-ui'
import { PostComments } from '@widgets/Post'
import EmailCommentForm from './EmailCommentForm'

const DeferredComments = props => {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)

  useEffect(() => {
    if (
      active ||
      typeof window === 'undefined' ||
      typeof window.IntersectionObserver !== 'function'
    ) {
      return undefined
    }

    const observer = new window.IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return
        setActive(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [active])

  return (
    <Box
      ref={containerRef}
      as='section'
      data-deferred-comments
      aria-labelledby='comments-heading'
      sx={{
        minHeight: 160,
        mt: 4,
        p: [3, 4],
        bg: `omegaLighter`,
        border: `1px solid`,
        borderColor: `omegaLight`,
        borderRadius: `16px`,
        boxShadow: theme => `0 22px 55px -44px ${theme.colors.omegaDarker}`
      }}
    >
      <Flex
        sx={{
          alignItems: [`flex-start`, `center`],
          justifyContent: `space-between`,
          flexDirection: [`column`, `row`],
          gap: 3,
          mb: active ? 4 : 0
        }}
      >
        <Box>
          <Text
            as='p'
            sx={{
              color: `alpha`,
              fontSize: 0,
              fontWeight: `bold`,
              letterSpacing: `0.14em`,
              textTransform: `uppercase`,
              mb: 2
            }}
          >
            Sohbet
          </Text>
          <Heading
            id='comments-heading'
            as='h2'
            sx={{
              color: `heading`,
              fontFamily: `'DM Serif Display', Georgia, serif`,
              fontSize: [4, 5],
              fontWeight: 400,
              lineHeight: 1.1,
              m: 0
            }}
          >
            Yorumlar
          </Heading>
        </Box>
        {active && (
          <Text
            as='p'
            sx={{ color: `omegaDark`, fontSize: 0, m: 0, maxWidth: `18rem` }}
          >
            Deneyimini paylaş, başka okurlara yol göster.
          </Text>
        )}
      </Flex>
      {active ? (
        <>
          <PostComments
            {...props}
            fallback={
              <Flex
                role='status'
                aria-live='polite'
                sx={{ alignItems: `center`, justifyContent: `center`, gap: 2 }}
              >
                <Spinner size={20} />
                <Text>Yorumlar yükleniyor</Text>
              </Flex>
            }
          />
          <Box
            sx={{
              mt: 4,
              pt: 4,
              borderTop: `1px solid`,
              borderColor: `omegaLight`
            }}
          >
            <Flex
              sx={{
                alignItems: [`flex-start`, `center`],
                justifyContent: `space-between`,
                flexDirection: [`column`, `row`],
                gap: 3
              }}
            >
              <Box>
                <Heading
                  as='h3'
                  sx={{ color: `heading`, fontSize: 2, m: 0, mb: 1 }}
                >
                  GitHub hesabın yok mu?
                </Heading>
                <Text as='p' sx={{ color: `omegaDark`, fontSize: 0, m: 0 }}>
                  Yorumunu e-posta adresinle gönder; önce inceleyip
                  yayınlayayım.
                </Text>
              </Box>
              <Button
                type='button'
                variant='secondary'
                onClick={() => setEmailOpen(open => !open)}
                aria-expanded={emailOpen}
                sx={{ borderRadius: `999px`, whiteSpace: `nowrap` }}
              >
                {emailOpen ? `Formu kapat` : `E-posta ile yorum yap`}
              </Button>
            </Flex>
            {emailOpen && (
              <Box sx={{ mt: 3 }}>
                <EmailCommentForm title={props.title} slug={props.slug} />
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Text as='p' sx={{ color: `text`, lineHeight: 1.7, m: 0, mb: 3 }}>
            Bu yazı hakkında fikrini paylaş. Yorum alanı, sayfa açıldığında
            değil sen istediğinde yüklenir.
          </Text>
          <Flex
            sx={{
              alignItems: [`stretch`, `center`],
              flexDirection: [`column`, `row`],
              gap: 2
            }}
          >
            <Button
              type='button'
              onClick={() => setActive(true)}
              sx={{ borderRadius: `999px` }}
            >
              Yorumları aç
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setEmailOpen(true)}
              sx={{ borderRadius: `999px` }}
            >
              E-posta ile gönder
            </Button>
          </Flex>
          {emailOpen && (
            <Box sx={{ mt: 3 }}>
              <EmailCommentForm title={props.title} slug={props.slug} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

DeferredComments.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  siteUrl: PropTypes.string,
  giscus: PropTypes.shape({
    repo: PropTypes.string.isRequired,
    repoId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired
  })
}

export default DeferredComments
