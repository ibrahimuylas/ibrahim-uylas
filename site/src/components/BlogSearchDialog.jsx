import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { Box, Flex, Heading, Input, Label, Link, Text } from 'theme-ui'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { trackEvent } from '../utils/analytics'
import policy from './blogSearchPolicy'

const {
  appendRankedResults,
  captureDocumentState,
  collapseSearchTerm,
  createGenerationGuard,
  createResultActivation,
  createSearchAnalyticsSession,
  getDialogFocusableElements,
  getRankedResultSlice,
  hasMinimumSearchLength,
  lockDocumentState,
  normalizeSearchTerm,
  validateSearchResult,
  restoreDocumentState
} = policy

const createInitialSearchState = () => ({
  status: `prompt`,
  total: 0,
  handles: [],
  results: [],
  normalizedTerm: ``,
  loadingMore: false
})

const statusMessage = searchState => {
  switch (searchState.status) {
    case `minimum`:
      return `Aramak için en az iki karakter yazın.`
    case `loading`:
      return `Sonuçlar aranıyor…`
    case `unavailable`:
      return `Arama şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.`
    case `complete`:
      return searchState.total === 0
        ? `Sonuç bulunamadı.`
        : `${searchState.total} sonuç bulundu.`
    default:
      return `Aramak istediğiniz kelimeyi yazın.`
  }
}

const loadResultDetails = async (rankedHandles, query) => {
  const results = await Promise.all(
    rankedHandles.map(async ({ handle, position }) => {
      if (!handle || typeof handle.data !== `function`) {
        throw new Error(`Invalid Pagefind result handle`)
      }

      const result = validateSearchResult(await handle.data(), position, query)
      if (!result) throw new Error(`Invalid Pagefind result data`)
      return result
    })
  )

  return results
}

const styles = {
  backdrop: {
    position: `fixed`,
    inset: 0,
    zIndex: 100000,
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `stretch`,
    justifyContent: [`center`, null, `flex-end`],
    p: 0,
    overflow: `hidden`,
    bg: `rgba(0, 0, 0, 0.42)`,
    backdropFilter: `blur(5px)`,
    WebkitBackdropFilter: `blur(5px)`,
    // Keep the backdrop from scrolling through the fixed document lock, but
    // leave touch handling available for controls inside the dialog on iOS.
    touchAction: `auto`,
    animation: `blogSearchBackdropIn 160ms ease-out both`,
    '@keyframes blogSearchBackdropIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: `none`
    }
  },
  dialog: {
    boxSizing: `border-box`,
    display: `flex`,
    flexDirection: `column`,
    width: [`100%`, null, `clamp(30rem, 42vw, 40rem)`],
    maxWidth: `100%`,
    height: `100dvh`,
    maxHeight: `100dvh`,
    m: 0,
    overflow: `hidden`,
    overscrollBehavior: `contain`,
    touchAction: `auto`,
    px: [`calc(1rem + env(safe-area-inset-left, 0px))`, 4, 5],
    pt: [`calc(1rem + env(safe-area-inset-top, 0px))`, 4, 5],
    pr: [`calc(1rem + env(safe-area-inset-right, 0px))`, 4, 5],
    pb: [`calc(1rem + env(safe-area-inset-bottom, 0px))`, 4, 5],
    borderLeftWidth: [0, null, 1],
    borderLeftStyle: `solid`,
    borderLeftColor: `omegaLight`,
    borderRadius: 0,
    bg: `contentBg`,
    color: `text`,
    boxShadow: `0 1rem 3rem rgba(0, 0, 0, 0.35)`,
    animation: [
      `blogSearchDialogIn 220ms cubic-bezier(0.22, 1, 0.36, 1) both`,
      null,
      `blogSearchDrawerIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both`
    ],
    '@keyframes blogSearchDialogIn': {
      from: {
        opacity: 0,
        transform: `translateY(1rem)`
      },
      to: {
        opacity: 1,
        transform: `translateY(0)`
      }
    },
    '@keyframes blogSearchDrawerIn': {
      from: {
        opacity: 0,
        transform: `translateX(2rem)`
      },
      to: {
        opacity: 1,
        transform: `translateX(0)`
      }
    },
    '@media (prefers-reduced-motion: reduce)': {
      animation: `none`
    }
  },
  headingRow: {
    alignItems: `center`,
    justifyContent: `space-between`,
    gap: 3,
    mb: 4
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
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    svg: {
      width: 20,
      height: 20
    }
  },
  label: {
    display: `block`,
    mb: 2,
    color: `heading`,
    fontWeight: `bold`
  },
  inputWrapper: {
    position: `relative`,
    svg: {
      position: `absolute`,
      top: `50%`,
      left: 3,
      width: 18,
      height: 18,
      color: `omegaDark`,
      pointerEvents: `none`,
      transform: `translateY(-50%)`
    }
  },
  input: {
    boxSizing: `border-box`,
    width: `100%`,
    minHeight: 52,
    pl: `3rem`,
    pr: 3,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `default`,
    bg: `background`,
    color: `text`,
    fontFamily: `body`,
    // Keep iOS Safari from zooming the page when the input receives focus.
    fontSize: `16px`,
    '&:focus': {
      borderColor: `alpha`,
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 2
    }
  },
  status: {
    mt: 3,
    mb: 0,
    color: `omegaDark`
  },
  resultsViewport: {
    flex: `1 1 auto`,
    minHeight: 0,
    mt: 3,
    pr: [0, null, 2],
    overflowX: `hidden`,
    overflowY: `auto`,
    overscrollBehavior: `contain`,
    touchAction: `pan-y`,
    WebkitOverflowScrolling: `touch`
  },
  results: {
    display: `grid`,
    gap: 3,
    p: 0,
    mt: 0,
    mb: 0,
    listStyle: `none`
  },
  result: {
    minWidth: 0
  },
  resultLink: {
    display: `block`,
    p: 3,
    borderWidth: 1,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `default`,
    bg: `background`,
    color: `text`,
    textDecoration: `none`,
    '&:visited': {
      color: `text`
    },
    '&:hover': {
      borderColor: `alpha`
    },
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    '&:hover [data-blog-search-result-title]': {
      color: `alpha`
    }
  },
  resultTitle: {
    display: `block`,
    color: `heading`,
    fontSize: 2,
    fontWeight: `bold`
  },
  category: {
    mt: 1,
    mb: 0,
    color: `alphaDark`,
    fontSize: 0,
    fontWeight: `bold`
  },
  excerpt: {
    mt: 2,
    mb: 0,
    color: `text`,
    lineHeight: 1.6,
    mark: {
      px: `0.1em`,
      bg: `beta`,
      color: `heading`
    }
  },
  more: {
    boxSizing: `border-box`,
    minHeight: 48,
    mt: 4,
    px: 4,
    py: 2,
    borderWidth: 2,
    borderStyle: `solid`,
    borderColor: `alpha`,
    borderRadius: `full`,
    bg: `transparent`,
    color: `alphaDark`,
    cursor: `pointer`,
    fontFamily: `body`,
    fontWeight: `bold`,
    '&:hover': {
      bg: `omegaLighter`
    },
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 3
    },
    '&:disabled': {
      cursor: `wait`,
      opacity: 0.65
    }
  }
}

const BlogSearchDialog = ({
  loadPagefind,
  onAfterUnlock,
  onDismiss,
  onNavigate,
  sessionGeneration,
  sourcePath
}) => {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const pagefindPromiseRef = useRef(null)
  const loadingMoreRef = useRef(false)
  const requestGuardRef = useRef(
    createGenerationGuard(sessionGeneration * 1000000)
  )
  const activeQueryGenerationRef = useRef(null)
  const analyticsSessionRef = useRef(
    createSearchAnalyticsSession({
      sourcePath,
      track: trackEvent
    })
  )
  const [query, setQuery] = useState(``)
  const [searchState, setSearchState] = useState(createInitialSearchState)

  const getPagefindForSession = useCallback(() => {
    if (!pagefindPromiseRef.current) {
      pagefindPromiseRef.current = loadPagefind()
    }

    return pagefindPromiseRef.current
  }, [loadPagefind])

  useEffect(() => {
    let active = true

    getPagefindForSession().catch(() => {
      if (!active) return
      requestGuardRef.current.invalidate()
      setSearchState(current => ({
        ...current,
        status: `unavailable`,
        loadingMore: false
      }))
    })

    return () => {
      active = false
    }
  }, [getPagefindForSession])

  useEffect(() => {
    const collapsedTerm = collapseSearchTerm(query)
    const normalizedTerm = normalizeSearchTerm(query)
    const generation = requestGuardRef.current.issue()

    activeQueryGenerationRef.current = generation
    loadingMoreRef.current = false

    if (!collapsedTerm) {
      setSearchState(createInitialSearchState())
      return undefined
    }

    if (!hasMinimumSearchLength(collapsedTerm)) {
      setSearchState({
        ...createInitialSearchState(),
        status: `minimum`,
        normalizedTerm
      })
      return undefined
    }

    setSearchState({
      ...createInitialSearchState(),
      status: `loading`,
      normalizedTerm
    })

    const runSearch = async () => {
      try {
        const pagefind = await getPagefindForSession()
        const response = await pagefind.debouncedSearch(normalizedTerm, {}, 300)

        if (
          response === null ||
          !requestGuardRef.current.isCurrent(generation)
        ) {
          return
        }

        if (
          !response ||
          !Array.isArray(response.results) ||
          response.results.some(
            handle => !handle || typeof handle.data !== `function`
          )
        ) {
          throw new Error(`Invalid Pagefind search response`)
        }

        const rankedHandles = getRankedResultSlice(response.results, 0)
        const results = await loadResultDetails(rankedHandles, normalizedTerm)
        const committed = requestGuardRef.current.commit(generation, () => {
          setSearchState({
            status: `complete`,
            total: response.results.length,
            handles: response.results,
            results,
            normalizedTerm,
            loadingMore: false
          })
        })

        if (committed) {
          analyticsSessionRef.current.trackSearch({
            normalizedTerm,
            resultCount: response.results.length
          })
        }
      } catch {
        requestGuardRef.current.commit(generation, () => {
          setSearchState({
            ...createInitialSearchState(),
            status: `unavailable`,
            normalizedTerm
          })
        })
      }
    }

    runSearch()

    return () => {
      requestGuardRef.current.invalidate()
    }
  }, [getPagefindForSession, query])

  useEffect(
    () => () => {
      requestGuardRef.current.invalidate()
      activeQueryGenerationRef.current = null
      loadingMoreRef.current = false
    },
    []
  )

  useEffect(() => {
    const dialog = dialogRef.current
    const input = inputRef.current
    const documentState = captureDocumentState(document, window)

    lockDocumentState(documentState)

    const maintainPagePosition = () => {
      if (
        window.scrollX === documentState.scrollX &&
        window.scrollY === documentState.scrollY
      ) {
        return
      }

      window.scrollTo({
        left: documentState.scrollX,
        top: documentState.scrollY,
        behavior: `instant`
      })
    }

    const handleKeyDown = event => {
      if (event.key === `Escape`) {
        event.preventDefault()
        onDismiss()
        return
      }

      if (event.key !== `Tab`) return

      const focusableElements = getDialogFocusableElements(dialog)
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
        input.focus({ preventScroll: true })
      }
    }

    document.addEventListener(`keydown`, handleKeyDown)
    document.addEventListener(`focusin`, handleFocusIn)
    window.addEventListener(`scroll`, maintainPagePosition, { passive: true })

    return () => {
      document.removeEventListener(`keydown`, handleKeyDown)
      document.removeEventListener(`focusin`, handleFocusIn)
      window.removeEventListener(`scroll`, maintainPagePosition)
      restoreDocumentState(documentState, window)
      onAfterUnlock()
    }
  }, [onAfterUnlock, onDismiss])

  const handleBackdropPointerDown = event => {
    if (event.target === event.currentTarget) onDismiss()
  }

  const handleBackdropWheel = event => {
    if (!dialogRef.current?.contains(event.target)) event.preventDefault()
  }

  const handleLoadMore = async () => {
    const generation = activeQueryGenerationRef.current

    if (
      loadingMoreRef.current ||
      searchState.status !== `complete` ||
      searchState.results.length >= searchState.handles.length ||
      !requestGuardRef.current.isCurrent(generation)
    ) {
      return
    }

    loadingMoreRef.current = true
    setSearchState(current => ({ ...current, loadingMore: true }))

    try {
      const rankedHandles = getRankedResultSlice(
        searchState.handles,
        searchState.results.length
      )
      const nextResults = await loadResultDetails(
        rankedHandles,
        searchState.normalizedTerm
      )

      requestGuardRef.current.commit(generation, () => {
        setSearchState(current => ({
          ...current,
          results: appendRankedResults(current.results, nextResults),
          loadingMore: false
        }))
      })
    } catch {
      requestGuardRef.current.commit(generation, () => {
        setSearchState(current => ({
          ...current,
          status: `unavailable`,
          loadingMore: false
        }))
      })
    } finally {
      if (requestGuardRef.current.isCurrent(generation)) {
        loadingMoreRef.current = false
      }
    }
  }

  const handleResultActivation = result => () => {
    createResultActivation({
      normalizedTerm: searchState.normalizedTerm,
      result,
      sourcePath,
      track: trackEvent
    })()
    onNavigate()
  }

  const showResults = searchState.results.length > 0
  const showMore =
    searchState.status === `complete` &&
    searchState.results.length < searchState.handles.length

  return (
    <Box
      sx={styles.backdrop}
      onPointerDown={handleBackdropPointerDown}
      onWheel={handleBackdropWheel}
    >
      <Box
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby='blog-search-dialog-heading'
        tabIndex='-1'
        sx={styles.dialog}
      >
        <Flex sx={styles.headingRow}>
          <Heading
            id='blog-search-dialog-heading'
            as='h2'
            variant='h3'
            sx={styles.heading}
          >
            Yazılarda ara
          </Heading>
          <Box
            as='button'
            type='button'
            aria-label='Aramayı kapat'
            onClick={onDismiss}
            sx={styles.close}
          >
            <FaTimes aria-hidden='true' focusable='false' />
          </Box>
        </Flex>
        <Label htmlFor='blog-search-query' sx={styles.label}>
          Arama
        </Label>
        <Box sx={styles.inputWrapper}>
          <FaSearch aria-hidden='true' focusable='false' />
          <Input
            ref={inputRef}
            id='blog-search-query'
            name='blog-search-query'
            type='search'
            autoFocus
            autoComplete='off'
            spellCheck='false'
            value={query}
            onChange={event => setQuery(event.target.value)}
            sx={styles.input}
          />
        </Box>
        <Text as='p' role='status' aria-live='polite' sx={styles.status}>
          {statusMessage(searchState)}
        </Text>
        <Box data-blog-search-results sx={styles.resultsViewport}>
          {showResults && (
            <Box as='ol' sx={styles.results}>
              {searchState.results.map(result => {
                const titleId = `blog-search-result-${result.position}`

                return (
                  <Box as='li' key={result.position} sx={styles.result}>
                    <Link
                      as={GatsbyLink}
                      to={result.url}
                      aria-labelledby={titleId}
                      onClick={handleResultActivation(result)}
                      sx={styles.resultLink}
                    >
                      <Box
                        as='span'
                        id={titleId}
                        data-blog-search-result-title
                        sx={styles.resultTitle}
                      >
                        {result.title}
                      </Box>
                      <Text as='p' sx={styles.category}>
                        {result.category}
                      </Text>
                      {result.excerptSegments ? (
                        <Text as='p' sx={styles.excerpt}>
                          {result.excerptSegments.map((segment, index) =>
                            segment.highlighted ? (
                              <Box
                                as='mark'
                                key={`${result.position}-${index}`}
                              >
                                {segment.text}
                              </Box>
                            ) : (
                              <React.Fragment
                                key={`${result.position}-${index}`}
                              >
                                {segment.text}
                              </React.Fragment>
                            )
                          )}
                        </Text>
                      ) : result.excerptHtml ? (
                        <Text
                          as='p'
                          sx={styles.excerpt}
                          dangerouslySetInnerHTML={{
                            __html: result.excerptHtml
                          }}
                        />
                      ) : (
                        <Text as='p' sx={styles.excerpt}>
                          {result.excerptText}
                        </Text>
                      )}
                    </Link>
                  </Box>
                )
              })}
            </Box>
          )}
          {showMore && (
            <Box
              as='button'
              type='button'
              disabled={searchState.loadingMore}
              onClick={handleLoadMore}
              sx={styles.more}
            >
              {searchState.loadingMore ? `Yükleniyor…` : `Daha fazla göster`}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

BlogSearchDialog.propTypes = {
  loadPagefind: PropTypes.func.isRequired,
  onAfterUnlock: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  sessionGeneration: PropTypes.number.isRequired,
  sourcePath: PropTypes.string.isRequired
}

export default BlogSearchDialog
