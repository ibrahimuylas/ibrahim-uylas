import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from 'theme-ui'
import { FaArrowUp } from 'react-icons/fa'

const SCROLL_THRESHOLD = 400

const styles = {
  button: {
    position: `fixed`,
    right: `calc(1rem + env(safe-area-inset-right, 0px))`,
    bottom: `calc(1rem + env(safe-area-inset-bottom, 0px))`,
    zIndex: 5,
    boxSizing: `border-box`,
    width: 48,
    minWidth: 48,
    height: 48,
    minHeight: 48,
    p: 0,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `full`,
    bg: `contentBg`,
    color: `heading`,
    boxShadow: `0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)`,
    cursor: `pointer`,
    '&:hover': {
      bg: `omegaLighter`,
      color: `heading`
    },
    '&:focus': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    svg: {
      width: 20,
      height: 20
    },
    '@media (max-width: 767px)': {
      display: `none`
    }
  }
}

const ScrollToTop = ({ variant }) => {
  const [isVisible, setIsVisible] = useState(false)
  const visibleState = useRef(false)
  const animationFrame = useRef(null)

  useEffect(() => {
    const updateVisibility = () => {
      animationFrame.current = null
      const shouldBeVisible = window.scrollY > SCROLL_THRESHOLD

      if (visibleState.current !== shouldBeVisible) {
        visibleState.current = shouldBeVisible
        setIsVisible(shouldBeVisible)
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

  const handleClick = () => {
    const reduceMotion = window.matchMedia(
      `(prefers-reduced-motion: reduce)`
    ).matches

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? `instant` : `smooth`
    })
  }

  if (!isVisible) return null

  const isDockButton = variant === `mobileDock`

  return (
    <IconButton
      type='button'
      aria-label='Sayfanın başına dön'
      onClick={handleClick}
      sx={
        isDockButton
          ? {
              ...styles.button,
              position: `static`,
              width: 48,
              minWidth: 48,
              height: 48,
              minHeight: 48,
              border: 0,
              bg: `transparent`,
              boxShadow: `none`,
              '&:hover': {
                bg: `omegaLighter`
              },
              '@media (max-width: 767px)': {
                display: `flex`
              }
            }
          : styles.button
      }
    >
      <FaArrowUp aria-hidden='true' focusable='false' />
    </IconButton>
  )
}

ScrollToTop.propTypes = {
  variant: PropTypes.oneOf([`default`, `mobileDock`])
}

ScrollToTop.defaultProps = {
  variant: `default`
}

export default ScrollToTop
