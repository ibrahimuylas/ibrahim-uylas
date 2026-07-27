import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Spinner, Text } from 'theme-ui'
import { PostComments } from '@widgets/Post'

const DeferredComments = props => {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)

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
      data-deferred-comments
      sx={{ minHeight: 160, py: 4 }}
    >
      {active ? (
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
      ) : (
        <Flex
          sx={{
            alignItems: `center`,
            justifyContent: `center`,
            flexDirection: `column`,
            gap: 3,
            textAlign: `center`
          }}
        >
          <Text sx={{ color: `muted` }}>
            Yorumlar yalnızca görmek istediğinizde yüklenir.
          </Text>
          <Button type='button' onClick={() => setActive(true)}>
            Yorumları yükle
          </Button>
        </Flex>
      )}
    </Box>
  )
}

DeferredComments.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  siteUrl: PropTypes.string,
  shortname: PropTypes.string
}

export default DeferredComments
