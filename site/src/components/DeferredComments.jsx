import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Heading, Spinner, Text } from 'theme-ui'
import { PostComments } from '@widgets/Post'
import Comments from './Comments'

const DeferredComments = props => {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)
  const nativeEnabled = props.comments?.enabled === true

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
        p: [0, 4, 5],
        bg: [`transparent`, `contentBg`],
        borderStyle: `solid`,
        borderWidth: [0, `1px`],
        borderColor: `omegaLight`,
        borderRadius: [0, `18px`]
      }}
    >
      <Flex
        sx={{
          alignItems: [`flex-start`, `center`],
          justifyContent: `space-between`,
          flexDirection: [`column`, `row`],
          gap: 3,
          mb: active ? [4, 5] : 0
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
            sx={{
              color: `omegaDark`,
              fontSize: 1,
              lineHeight: 1.6,
              m: 0,
              maxWidth: `21rem`
            }}
          >
            Deneyimini paylaş, başka okurlara yol göster.
          </Text>
        )}
      </Flex>
      {active ? (
        nativeEnabled ? (
          <Comments {...props} comments={props.comments} />
        ) : (
          <>
            <PostComments
              {...props}
              fallback={
                <Flex
                  role='status'
                  aria-live='polite'
                  sx={{
                    alignItems: `center`,
                    justifyContent: `center`,
                    gap: 2
                  }}
                >
                  <Spinner size={20} />
                  <Text>Yorumlar yükleniyor</Text>
                </Flex>
              }
            />
          </>
        )
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
          </Flex>
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
  }),
  comments: PropTypes.shape({
    enabled: PropTypes.bool,
    turnstileSiteKey: PropTypes.string
  })
}

export default DeferredComments
