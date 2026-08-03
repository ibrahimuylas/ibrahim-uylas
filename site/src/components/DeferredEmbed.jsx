import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Flex, Spinner, Text } from 'theme-ui'
import { FaMapMarkedAlt, FaPlay } from 'react-icons/fa'

const labels = {
  youtube: {
    action: 'Videoyu yükle',
    pending: 'Video yükleniyor',
    title: 'YouTube videosu'
  },
  route: {
    action: 'Haritayı yükle',
    pending: 'Harita yükleniyor',
    title: 'Rota haritası'
  }
}

const DeferredEmbed = ({ src, provider = 'route', title, width, height }) => {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const copy = labels[provider] || labels.route
  const Icon = provider === 'youtube' ? FaPlay : FaMapMarkedAlt
  const numericHeight = Number.parseInt(height, 10)
  const reservedHeight = Number.isFinite(numericHeight)
    ? Math.min(Math.max(numericHeight, 240), 600)
    : provider === 'youtube'
      ? 450
      : 400

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
      { rootMargin: '300px 0px' }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [active, provider])

  const iframeProps = useMemo(
    () => ({
      src,
      title: title || copy.title,
      width: width || '100%',
      height: reservedHeight,
      loading: 'lazy',
      referrerPolicy: 'strict-origin-when-cross-origin',
      allowFullScreen: true
    }),
    [copy.title, reservedHeight, src, title, width]
  )

  return (
    <Box
      ref={containerRef}
      data-deferred-embed={provider}
      data-deferred-src={src}
      data-pagefind-ignore='all'
      sx={{
        position: `relative`,
        overflow: `hidden`,
        width: `100%`,
        minHeight: [Math.min(reservedHeight, 360), reservedHeight],
        my: 4,
        bg: `omegaLighter`,
        border: `1px solid`,
        borderColor: `omegaLight`,
        borderRadius: `default`,
        iframe: {
          position: `absolute`,
          inset: 0,
          display: `block`,
          width: `100%`,
          height: `100%`,
          border: 0
        }
      }}
    >
      {active && (
        <iframe
          {...iframeProps}
          onLoad={() => setLoaded(true)}
          style={{ visibility: loaded ? 'visible' : 'hidden' }}
        />
      )}
      {!loaded && (
        <Flex
          sx={{
            position: `absolute`,
            inset: 0,
            alignItems: `center`,
            justifyContent: `center`,
            flexDirection: `column`,
            gap: 3,
            p: 4,
            textAlign: `center`
          }}
        >
          <Box aria-hidden='true' sx={{ color: `primary`, fontSize: 5 }}>
            <Icon />
          </Box>
          <Text sx={{ color: `text`, fontWeight: `bold` }}>
            {title || copy.title}
          </Text>
          {active ? (
            <Flex
              role='status'
              aria-live='polite'
              sx={{ alignItems: `center`, gap: 2, color: `muted` }}
            >
              <Spinner size={20} />
              <Text>{copy.pending}</Text>
            </Flex>
          ) : (
            <Button type='button' onClick={() => setActive(true)}>
              {copy.action}
            </Button>
          )}
        </Flex>
      )}
    </Box>
  )
}

DeferredEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  provider: PropTypes.oneOf(['youtube', 'route']),
  title: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default DeferredEmbed
