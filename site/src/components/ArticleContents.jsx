import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import { Box, Heading } from 'theme-ui'
import { FaListUl } from 'react-icons/fa'
import { useLocation } from '@reach/router'
import ArticleContentsList, { itemType } from './ArticleContentsList'
import ArticleContentsRail from './ArticleContentsRail'
import ArticleContentsSheet from './ArticleContentsSheet'

const DESKTOP_NAVIGATION_MEDIA_QUERY = `(min-width: 1200px)`

const styles = {
  trigger: {
    position: `fixed`,
    zIndex: 5,
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    gap: 2,
    width: `auto`,
    minWidth: 48,
    height: 48,
    minHeight: 48,
    px: 3,
    py: 0,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `full`,
    bg: `contentBg`,
    color: `heading`,
    boxShadow: `0 0.25rem 0.75rem rgba(0, 0, 0, 0.2)`,
    cursor: `pointer`,
    fontFamily: `body`,
    fontSize: 1,
    fontWeight: `bold`,
    lineHeight: `body`,
    '&:hover': {
      bg: `omegaLighter`,
      color: `heading`
    },
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    '&[data-suppress-focus-ring="true"]:focus': {
      outline: `none`
    },
    svg: {
      flex: `0 0 auto`,
      width: 18,
      height: 18
    }
  },
  pill: {
    left: `calc(1rem + env(safe-area-inset-left, 0px))`,
    bottom: `calc(1rem + env(safe-area-inset-bottom, 0px))`
  }
}

const EligibleArticleContents = ({ items }) => {
  const { pathname } = useLocation()
  const navigationRef = useRef(null)
  const invokingElementRef = useRef(null)
  const focusFrameRef = useRef(null)
  const navigationFrameRef = useRef(null)
  const pendingNavigationRef = useRef(null)
  const suppressSheetFocusRingRef = useRef(true)
  const temporaryFocusTargetRef = useRef(null)
  const isMountedRef = useRef(false)
  const previousPathnameRef = useRef(pathname)
  const [portalHost, setPortalHost] = useState(null)
  const [hasPassedViewport, setHasPassedViewport] = useState(false)
  const [isDesktopNavigation, setIsDesktopNavigation] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const cancelPendingFocus = useCallback(() => {
    if (focusFrameRef.current !== null) {
      window.cancelAnimationFrame(focusFrameRef.current)
      focusFrameRef.current = null
    }
  }, [])

  const clearTemporaryFocusTarget = useCallback(() => {
    const temporaryFocusTarget = temporaryFocusTargetRef.current

    if (!temporaryFocusTarget) return

    temporaryFocusTarget.target.removeEventListener(
      `blur`,
      temporaryFocusTarget.removeTabIndex
    )
    temporaryFocusTarget.removeTabIndex()
  }, [])

  const cancelPendingNavigation = useCallback(() => {
    if (navigationFrameRef.current !== null) {
      window.cancelAnimationFrame(navigationFrameRef.current)
      navigationFrameRef.current = null
    }

    pendingNavigationRef.current = null
    clearTemporaryFocusTarget()
  }, [clearTemporaryFocusTarget])

  const forceCloseSheet = useCallback(() => {
    cancelPendingFocus()
    cancelPendingNavigation()
    invokingElementRef.current = null
    setIsSheetOpen(false)
  }, [cancelPendingFocus, cancelPendingNavigation])

  const handleOpenSheet = event => {
    cancelPendingFocus()
    cancelPendingNavigation()
    invokingElementRef.current = event.currentTarget
    suppressSheetFocusRingRef.current = event.detail !== 0
    setIsSheetOpen(true)
  }

  const handleDismissSheet = useCallback(({ restoreFocusRing = false } = {}) => {
    const invokingElement = invokingElementRef.current

    setIsSheetOpen(false)
    cancelPendingFocus()
    cancelPendingNavigation()
    focusFrameRef.current = window.requestAnimationFrame(() => {
      focusFrameRef.current = window.requestAnimationFrame(() => {
        focusFrameRef.current = null

        if (invokingElement && invokingElement.isConnected) {
          if (restoreFocusRing) {
            invokingElement.removeAttribute(`data-suppress-focus-ring`)
          } else {
            const clearFocusRingSuppression = () => {
              invokingElement.removeAttribute(`data-suppress-focus-ring`)
            }

            invokingElement.setAttribute(`data-suppress-focus-ring`, `true`)
            invokingElement.addEventListener(`blur`, clearFocusRingSuppression, {
              once: true
            })
          }

          invokingElement.focus({ preventScroll: true })
        }
      })
    })
  }, [cancelPendingFocus, cancelPendingNavigation])

  const handleItemSelect = useCallback(
    item => {
      cancelPendingFocus()
      cancelPendingNavigation()
      invokingElementRef.current = null
      pendingNavigationRef.current = item
      setIsSheetOpen(false)
    },
    [cancelPendingFocus, cancelPendingNavigation]
  )

  const navigateToItem = useCallback(
    item => {
      const fragmentStart = item.url.indexOf(`#`)
      if (fragmentStart === -1) return

      const fragment = item.url.slice(fragmentStart)
      const encodedTargetId = fragment.slice(1)
      let targetId = encodedTargetId

      try {
        targetId = decodeURIComponent(encodedTargetId)
      } catch {
        // Gatsby fragments can already contain literal Unicode characters.
      }

      window.history.replaceState(window.history.state, ``, fragment)

      const target = document.getElementById(targetId)
      if (!target) return

      const needsTemporaryTabIndex = !target.hasAttribute(`tabindex`)

      clearTemporaryFocusTarget()

      if (needsTemporaryTabIndex) {
        const removeTabIndex = () => {
          if (
            temporaryFocusTargetRef.current &&
            temporaryFocusTargetRef.current.target === target
          ) {
            temporaryFocusTargetRef.current = null
          }

          target.removeAttribute(`tabindex`)
        }

        target.setAttribute(`tabindex`, `-1`)
        target.addEventListener(`blur`, removeTabIndex, { once: true })
        temporaryFocusTargetRef.current = { target, removeTabIndex }
      }

      target.scrollIntoView({ block: `start`, behavior: `instant` })
      target.focus({ preventScroll: true })

      if (document.activeElement !== target && needsTemporaryTabIndex) {
        clearTemporaryFocusTarget()
      }
    },
    [clearTemporaryFocusTarget]
  )

  const handleInlineItemClick = useCallback(
    (event, item) => {
      event.preventDefault()
      cancelPendingFocus()
      cancelPendingNavigation()
      navigateToItem(item)
    },
    [cancelPendingFocus, cancelPendingNavigation, navigateToItem]
  )

  const handleRailItemSelect = useCallback(
    item => {
      cancelPendingFocus()
      cancelPendingNavigation()
      invokingElementRef.current = null
      navigationFrameRef.current = window.requestAnimationFrame(() => {
        navigationFrameRef.current = null
        navigateToItem(item)
      })
    },
    [cancelPendingFocus, cancelPendingNavigation, navigateToItem]
  )

  const handleAfterSheetUnlock = useCallback(() => {
    const pendingNavigation = pendingNavigationRef.current

    if (!isMountedRef.current || !pendingNavigation) return

    navigationFrameRef.current = window.requestAnimationFrame(() => {
      navigationFrameRef.current = window.requestAnimationFrame(() => {
        navigationFrameRef.current = null

        if (
          !isMountedRef.current ||
          pendingNavigationRef.current !== pendingNavigation
        ) {
          return
        }

        pendingNavigationRef.current = null
        navigateToItem(pendingNavigation)
      })
    })
  }, [navigateToItem])

  useEffect(() => {
    const host = document.createElement(`div`)
    host.setAttribute(`data-article-contents-portal`, ``)
    document.body.appendChild(host)
    isMountedRef.current = true
    setPortalHost(host)

    return () => {
      isMountedRef.current = false
      cancelPendingFocus()
      cancelPendingNavigation()
      host.remove()
    }
  }, [cancelPendingFocus, cancelPendingNavigation])

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname
      forceCloseSheet()
    }
  }, [forceCloseSheet, pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_NAVIGATION_MEDIA_QUERY)

    const updateNavigationMode = () => {
      setIsDesktopNavigation(mediaQuery.matches)
    }

    updateNavigationMode()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(`change`, updateNavigationMode)
    } else {
      mediaQuery.addListener(updateNavigationMode)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener(`change`, updateNavigationMode)
      } else {
        mediaQuery.removeListener(updateNavigationMode)
      }
    }
  }, [])

  useEffect(() => {
    if (isDesktopNavigation && isSheetOpen) forceCloseSheet()
  }, [forceCloseSheet, isDesktopNavigation, isSheetOpen])

  useEffect(() => {
    if (
      !navigationRef.current ||
      typeof window.IntersectionObserver !== `function`
    ) {
      return undefined
    }

    const observer = new window.IntersectionObserver(entries => {
      const entry = entries[entries.length - 1]
      const rootTop = entry.rootBounds ? entry.rootBounds.top : 0

      setHasPassedViewport(entry.boundingClientRect.bottom <= rootTop)
    })

    observer.observe(navigationRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Box
        as='nav'
        ref={navigationRef}
        aria-label='İçindekiler'
        sx={{
          bg: 'omegaLighter',
          borderRadius: 'default',
          mb: 4,
          px: [3, 4],
          py: 3
        }}
      >
        <Heading as='h2' variant='h4' sx={{ mb: 3 }}>
          Bu yazıda
        </Heading>
        <ArticleContentsList
          items={items}
          onItemClick={handleInlineItemClick}
        />
      </Box>
      {portalHost &&
        (hasPassedViewport || isSheetOpen) &&
        createPortal(
          isDesktopNavigation ? (
            <ArticleContentsRail
              items={items}
              onItemSelect={handleRailItemSelect}
            />
          ) : (
            <>
              <Box
                as='button'
                type='button'
                aria-hidden={isSheetOpen ? `true` : undefined}
                tabIndex={isSheetOpen ? -1 : undefined}
                onClick={handleOpenSheet}
                sx={{
                  ...styles.trigger,
                  ...styles.pill,
                  visibility: isSheetOpen ? `hidden` : `visible`
                }}
              >
                <FaListUl aria-hidden='true' focusable='false' />
                Bu yazıda
              </Box>
              {isSheetOpen && (
                <ArticleContentsSheet
                  items={items}
                  onAfterUnlock={handleAfterSheetUnlock}
                  onDismiss={handleDismissSheet}
                  onItemSelect={handleItemSelect}
                  suppressInitialFocusRing={suppressSheetFocusRingRef.current}
                />
              )}
            </>
          ),
          portalHost
        )}
    </>
  )
}

EligibleArticleContents.propTypes = {
  items: PropTypes.arrayOf(itemType).isRequired
}

const ArticleContents = ({ items }) =>
  items && items.length >= 2 ? <EligibleArticleContents items={items} /> : null

ArticleContents.propTypes = {
  items: PropTypes.arrayOf(itemType)
}

export default ArticleContents
