import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Heading } from 'theme-ui'
import { FaTimes } from 'react-icons/fa'
import ArticleContentsList, { itemType } from './ArticleContentsList'

const FOCUSABLE_SELECTOR = [
  `a[href]`,
  `button:not([disabled])`,
  `input:not([disabled])`,
  `select:not([disabled])`,
  `textarea:not([disabled])`,
  `[tabindex]:not([tabindex="-1"])`
].join(`,`)

const styles = {
  backdrop: {
    position: `fixed`,
    inset: 0,
    zIndex: 100,
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: [`flex-end`, `center`],
    justifyContent: `center`,
    p: [0, 4],
    bg: `rgba(0, 0, 0, 0.08)`,
    backdropFilter: `blur(10px)`,
    WebkitBackdropFilter: `blur(10px)`,
    touchAction: `none`
  },
  sheet: {
    boxSizing: `border-box`,
    width: [`100%`, `min(42rem, 100%)`],
    maxHeight: [`calc(100vh - 1rem)`, `min(80vh, 42rem)`],
    overflowY: `auto`,
    overscrollBehavior: `contain`,
    touchAction: `pan-y`,
    pt: 3,
    pr: `calc(1rem + env(safe-area-inset-right, 0px))`,
    pb: `calc(1rem + env(safe-area-inset-bottom, 0px))`,
    pl: `calc(1rem + env(safe-area-inset-left, 0px))`,
    borderTopLeftRadius: `default`,
    borderTopRightRadius: `default`,
    borderBottomLeftRadius: [0, `default`],
    borderBottomRightRadius: [0, `default`],
    bg: `contentBg`,
    color: `text`,
    boxShadow: `0 0 2rem rgba(0, 0, 0, 0.35)`,
    a: {
      color: `alphaDarker`,
      '&:visited': {
        color: `alphaDarker`
      },
      '&:hover': {
        color: `alphaDark`
      }
    }
  },
  headingRow: {
    alignItems: `center`,
    justifyContent: `space-between`,
    gap: 3,
    mb: 3
  },
  heading: {
    m: 0,
    color: `heading`
  },
  close: {
    flex: `0 0 auto`,
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: 48,
    minWidth: 48,
    height: 48,
    minHeight: 48,
    p: 0,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `full`,
    bg: `omegaLighter`,
    color: `heading`,
    cursor: `pointer`,
    '&:hover': {
      bg: `omegaLight`,
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
    }
  }
}

const restoreAttribute = (element, attribute, value) => {
  if (value === null) {
    element.removeAttribute(attribute)
  } else {
    element.setAttribute(attribute, value)
  }
}

const ArticleContentsSheet = ({
  items,
  onAfterUnlock,
  onDismiss,
  onItemSelect
}) => {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const closeButton = closeButtonRef.current
    const appRoot = document.getElementById(`___gatsby`)
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const htmlStyleAttribute = document.documentElement.getAttribute(`style`)
    const bodyStyleAttribute = document.body.getAttribute(`style`)
    const appRootStyleAttribute = appRoot ? appRoot.getAttribute(`style`) : null
    const hadInertAttribute = appRoot && appRoot.hasAttribute(`inert`)
    const inertAttributeValue = hadInertAttribute
      ? appRoot.getAttribute(`inert`)
      : null

    document.documentElement.style.setProperty(`overflow`, `hidden`)
    document.documentElement.style.setProperty(`overscroll-behavior`, `none`)
    document.body.style.setProperty(`overflow`, `hidden`)
    document.body.style.setProperty(`overscroll-behavior`, `none`)

    if (appRoot) {
      appRoot.style.setProperty(
        `transform`,
        `translate3d(${-scrollX}px, ${-scrollY}px, 0)`
      )
      appRoot.style.setProperty(`transform-origin`, `top left`)
      appRoot.setAttribute(`inert`, ``)
    }

    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        element => element.getAttribute(`aria-hidden`) !== `true`
      )

    const handleKeyDown = event => {
      if (event.key === `Escape`) {
        event.preventDefault()
        onDismiss()
        return
      }

      if (event.key !== `Tab`) return

      const focusableElements = getFocusableElements()
      const firstElement = focusableElements[0] || dialog
      const lastElement =
        focusableElements[focusableElements.length - 1] || dialog
      const focusIsOutside = !dialog.contains(document.activeElement)

      if (
        focusableElements.length <= 1 ||
        (event.shiftKey &&
          (document.activeElement === firstElement || focusIsOutside)) ||
        (!event.shiftKey &&
          (document.activeElement === lastElement || focusIsOutside))
      ) {
        event.preventDefault()
        ;(event.shiftKey ? lastElement : firstElement).focus({
          preventScroll: true
        })
      }
    }

    const handleFocusIn = event => {
      if (!dialog.contains(event.target)) {
        closeButton.focus({ preventScroll: true })
      }
    }

    document.addEventListener(`keydown`, handleKeyDown)
    document.addEventListener(`focusin`, handleFocusIn)

    const focusFrame = window.requestAnimationFrame(() => {
      closeButton.focus({ preventScroll: true })
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener(`keydown`, handleKeyDown)
      document.removeEventListener(`focusin`, handleFocusIn)

      if (appRoot) {
        restoreAttribute(appRoot, `style`, appRootStyleAttribute)

        if (hadInertAttribute) {
          appRoot.setAttribute(`inert`, inertAttributeValue)
        } else {
          appRoot.removeAttribute(`inert`)
        }
      }

      restoreAttribute(document.documentElement, `style`, htmlStyleAttribute)
      restoreAttribute(document.body, `style`, bodyStyleAttribute)
      window.scrollTo({
        left: scrollX,
        top: scrollY,
        behavior: `instant`
      })

      window.queueMicrotask(() => {
        if (
          htmlStyleAttribute === null &&
          document.documentElement.getAttribute(`style`) === ``
        ) {
          document.documentElement.removeAttribute(`style`)
        }

        if (
          bodyStyleAttribute === null &&
          document.body.getAttribute(`style`) === ``
        ) {
          document.body.removeAttribute(`style`)
        }
      })

      onAfterUnlock()
    }
  }, [onAfterUnlock, onDismiss])

  const handleBackdropPointerDown = event => {
    if (event.target === event.currentTarget) onDismiss()
  }

  const handleItemClick = (event, item) => {
    event.preventDefault()
    onItemSelect(item)
  }

  return (
    <Box sx={styles.backdrop} onPointerDown={handleBackdropPointerDown}>
      <Box
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='article-contents-dialog-heading'
        tabIndex='-1'
        sx={styles.sheet}
      >
        <Flex sx={styles.headingRow}>
          <Heading
            id='article-contents-dialog-heading'
            as='h2'
            variant='h4'
            sx={styles.heading}
          >
            Bu yazıda
          </Heading>
          <Box
            ref={closeButtonRef}
            as='button'
            type='button'
            aria-label='İçindekileri kapat'
            onClick={onDismiss}
            sx={styles.close}
          >
            <FaTimes aria-hidden='true' focusable='false' />
          </Box>
        </Flex>
        <ArticleContentsList items={items} onItemClick={handleItemClick} />
      </Box>
    </Box>
  )
}

ArticleContentsSheet.propTypes = {
  items: PropTypes.arrayOf(itemType).isRequired,
  onAfterUnlock: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onItemSelect: PropTypes.func.isRequired
}

export default ArticleContentsSheet
