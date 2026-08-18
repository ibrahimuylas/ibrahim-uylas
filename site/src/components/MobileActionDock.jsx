import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { Box, Flex } from 'theme-ui'
import { FaHome } from 'react-icons/fa'
import BlogSearch from './BlogSearch'
import ScrollToTop from './ScrollToTop'

const styles = {
  dock: {
    position: `fixed`,
    left: `50%`,
    bottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))`,
    zIndex: 5,
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `center`,
    width: `max-content`,
    maxWidth: `calc(100vw - 2rem)`,
    minHeight: 64,
    p: 1,
    transform: `translateX(-50%)`,
    borderWidth: 1,
    borderStyle: `solid`,
    borderColor: `rgba(255, 255, 255, 0.18)`,
    borderRadius: `full`,
    bg: `rgba(29, 37, 51, 0.68)`,
    color: `white`,
    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.14)`,
    transition: `opacity 160ms ease, visibility 160ms ease`,
    '@media (min-width: 768px)': {
      display: `none`
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: `none`
    }
  },
  action: {
    flex: `0 0 48px`,
    width: 48,
    minWidth: 48,
    height: 48,
    minHeight: 48,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`
  },
  homeAction: {
    p: 0,
    borderRadius: `full`,
    color: `white`,
    textDecoration: `none`,
    transition: `background-color 140ms ease, transform 140ms ease`,
    '&:visited': {
      color: `white`
    },
    '&:hover': {
      bg: `rgba(255, 255, 255, 0.12)`,
      color: `white`
    },
    '&:active': {
      bg: `rgba(255, 255, 255, 0.2)`,
      transform: `scale(0.92)`
    },
    '&:focus-visible': {
      outline: `3px solid white`,
      outlineOffset: 2
    },
    svg: {
      width: 24,
      height: 24
    }
  },
  contentsSlot: {
    display: `flex`,
    alignItems: `center`
  }
}

const MobileActionDock = ({ location }) => {
  const [isVisible, setIsVisible] = useState(false)
  const visibleState = useRef(false)
  const animationFrame = useRef(null)
  const showHomeAction = Boolean(
    location?.pathname && location.pathname !== `/`
  )

  useEffect(() => {
    const updateVisibility = () => {
      animationFrame.current = null
      const nextVisibility = window.scrollY > 400

      if (visibleState.current !== nextVisibility) {
        visibleState.current = nextVisibility
        setIsVisible(nextVisibility)
      }
    }

    const requestVisibilityUpdate = () => {
      if (animationFrame.current === null) {
        animationFrame.current = window.requestAnimationFrame(updateVisibility)
      }
    }

    requestVisibilityUpdate()
    window.addEventListener(`scroll`, requestVisibilityUpdate, {
      passive: true
    })

    return () => {
      window.removeEventListener(`scroll`, requestVisibilityUpdate)

      if (animationFrame.current !== null) {
        window.cancelAnimationFrame(animationFrame.current)
        animationFrame.current = null
      }
    }
  }, [])

  return (
    <Flex
      aria-label='Mobil hızlı işlemler'
      sx={{
        ...styles.dock,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? `visible` : `hidden`,
        pointerEvents: isVisible ? `auto` : `none`
      }}
    >
      {showHomeAction && (
        <Box
          as={GatsbyLink}
          to='/'
          aria-label='Ana sayfaya dön'
          data-mobile-home-action
          sx={{ ...styles.action, ...styles.homeAction }}
        >
          <FaHome aria-hidden='true' focusable='false' />
        </Box>
      )}
      <Box sx={styles.contentsSlot} data-mobile-contents-dock-slot />
      <Box sx={styles.action}>
        <BlogSearch location={location} variant='mobileDock' />
      </Box>
      <Box sx={styles.action}>
        <ScrollToTop variant='mobileDock' />
      </Box>
    </Flex>
  )
}

MobileActionDock.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

MobileActionDock.defaultProps = {
  location: undefined
}

export default MobileActionDock
