import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { Box } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import BlogSearchDialog from './BlogSearchDialog'
import policy from './blogSearchPolicy'

const HEADER_MEDIA_QUERY = `(min-width: 768px)`
const loadPagefindBrowser = policy.createPagefindLoader(attempt => {
  const pagefindUrl =
    attempt === 1
      ? `/pagefind/pagefind.js`
      : `/pagefind/pagefind.js?retry=${attempt - 1}`

  return import(/* webpackIgnore: true */ pagefindUrl)
})

const styles = {
  trigger: {
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: [`center`, null, `flex-start`],
    gap: 2,
    width: [48, null, `100%`],
    maxWidth: [48, null, `18rem`],
    minWidth: 48,
    height: 48,
    minHeight: 48,
    ml: [`auto`, null, 0],
    px: [0, null, 3],
    py: 0,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `full`,
    bg: `contentBg`,
    color: `omegaDark`,
    cursor: `pointer`,
    fontFamily: `body`,
    fontSize: 1,
    textAlign: `left`,
    '&:hover': {
      borderColor: `alpha`,
      color: `heading`
    },
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    svg: {
      flex: `0 0 auto`,
      width: 18,
      height: 18
    }
  },
  prompt: {
    display: [`none`, null, `inline`],
    overflow: `hidden`,
    textOverflow: `ellipsis`,
    whiteSpace: `nowrap`
  }
}

const BlogSearch = ({ loadPagefind, location, variant }) => {
  const invokingElementRef = useRef(null)
  const portalHostRef = useRef(null)
  const focusFrameRef = useRef(null)
  const restoreFocusRef = useRef(false)
  const sourcePathRef = useRef(`/`)
  const sessionGenerationRef = useRef(0)
  const isOpenRef = useRef(false)
  const mountedRef = useRef(false)
  const previousPathnameRef = useRef(location?.pathname)
  const [portalHost, setPortalHost] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const cancelPendingFocus = useCallback(() => {
    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current)
      focusFrameRef.current = null
    }
  }, [])

  const removePortalHost = useCallback(() => {
    const host = portalHostRef.current

    if (host) host.remove()
    portalHostRef.current = null
    if (mountedRef.current) setPortalHost(null)
  }, [])

  const forceDismiss = useCallback(() => {
    const wasOpen = isOpenRef.current

    cancelPendingFocus()
    isOpenRef.current = false
    restoreFocusRef.current = false
    invokingElementRef.current = null
    setIsOpen(false)

    if (!wasOpen) removePortalHost()
  }, [cancelPendingFocus, removePortalHost])

  const handleOpen = event => {
    if (portalHostRef.current) return

    const host = document.createElement(`div`)
    host.setAttribute(`data-blog-search-portal`, ``)
    // Keep the modal outside the fixed body used to preserve scroll position
    // while it is open. iOS Safari can offset fixed descendants of that body
    // when the search is launched after scrolling.
    document.documentElement.appendChild(host)

    invokingElementRef.current = event.currentTarget
    portalHostRef.current = host
    restoreFocusRef.current = true
    isOpenRef.current = true
    sourcePathRef.current = location?.pathname || `/`
    sessionGenerationRef.current += 1
    setPortalHost(host)
    setIsOpen(true)
  }

  const handleDismiss = useCallback(() => {
    isOpenRef.current = false
    restoreFocusRef.current = true
    setIsOpen(false)
  }, [])

  const handleAfterUnlock = useCallback(() => {
    const invokingElement = invokingElementRef.current
    const shouldRestoreFocus = restoreFocusRef.current

    isOpenRef.current = false
    restoreFocusRef.current = false
    invokingElementRef.current = null
    removePortalHost()
    cancelPendingFocus()

    if (!mountedRef.current || !shouldRestoreFocus) return

    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = null

      if (invokingElement && invokingElement.isConnected) {
        invokingElement.focus({ preventScroll: true })
      }
    })
  }, [cancelPendingFocus, removePortalHost])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
      cancelPendingFocus()
      isOpenRef.current = false
      restoreFocusRef.current = false
      invokingElementRef.current = null
      removePortalHost()
    }
  }, [cancelPendingFocus, removePortalHost])

  useEffect(() => {
    const pathname = location?.pathname

    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname
      forceDismiss()
    }
  }, [forceDismiss, location?.pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia(HEADER_MEDIA_QUERY)
    const handleModeChange = () => forceDismiss()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(`change`, handleModeChange)
    } else {
      mediaQuery.addListener(handleModeChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(`change`, handleModeChange)
      } else {
        mediaQuery.removeListener(handleModeChange)
      }
    }
  }, [forceDismiss])

  return (
    <>
      <Box
        as='button'
        type='button'
        aria-label='Arama'
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        onClick={handleOpen}
        sx={
          variant === `mobileDock`
            ? {
                ...styles.trigger,
                width: 48,
                minWidth: 48,
                height: 48,
                minHeight: 48,
                p: 0,
                border: 0,
                borderRadius: `full`,
                bg: `transparent`,
                color: `white`,
                transition: `background-color 140ms ease, transform 140ms ease`,
                '&:hover': {
                  bg: `rgba(255, 255, 255, 0.12)`,
                  color: `white`
                },
                '&:active': {
                  bg: `rgba(255, 255, 255, 0.2)`,
                  transform: `scale(0.92)`
                },
                '&:focus-visible': {
                  outlineColor: `white`,
                  outlineOffset: 2
                },
                svg: {
                  width: 24,
                  height: 24
                },
                prompt: {
                  display: `none`
                }
              }
            : styles.trigger
        }
      >
        <FaSearch aria-hidden='true' focusable='false' />
        <Box as='span' sx={styles.prompt}>
          Yazılarda ara
        </Box>
      </Box>
      {portalHost &&
        isOpen &&
        createPortal(
          <BlogSearchDialog
            loadPagefind={loadPagefind}
            onAfterUnlock={handleAfterUnlock}
            onDismiss={handleDismiss}
            onNavigate={forceDismiss}
            sessionGeneration={sessionGenerationRef.current}
            sourcePath={sourcePathRef.current}
          />,
          portalHost
        )}
    </>
  )
}

BlogSearch.propTypes = {
  loadPagefind: PropTypes.func,
  variant: PropTypes.oneOf([`header`, `mobileDock`]),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

BlogSearch.defaultProps = {
  loadPagefind: loadPagefindBrowser,
  variant: `header`
}

export default BlogSearch
