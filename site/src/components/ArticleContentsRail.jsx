import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Heading, Text } from 'theme-ui'
import { itemType } from './ArticleContentsList'

const PREVIEW_GUTTER = 16
const PREVIEW_FALLBACK_HEIGHT = 96

const styles = {
  rail: {
    position: `fixed`,
    top: `50%`,
    left: `calc(1.5rem + env(safe-area-inset-left, 0px))`,
    zIndex: 5,
    width: 64,
    maxHeight: `calc(100vh - 2rem)`,
    overflowY: `auto`,
    transform: `translateY(-50%)`,
    scrollbarWidth: `none`,
    '&::-webkit-scrollbar': {
      display: `none`
    }
  },
  list: {
    display: `flex`,
    flexDirection: `column`,
    alignItems: `flex-start`,
    m: 0,
    p: 0,
    listStyle: `none`
  },
  item: {
    m: 0,
    p: 0
  },
  button: {
    boxSizing: `border-box`,
    display: `flex`,
    alignItems: `center`,
    width: 64,
    height: 24,
    m: 0,
    p: 0,
    border: 0,
    borderRadius: `sm`,
    bg: `transparent`,
    cursor: `pointer`,
    '&:focus': {
      outline: `2px solid`,
      outlineColor: `alpha`,
      outlineOffset: 2
    }
  },
  line: {
    display: `block`,
    height: 3,
    borderRadius: `full`,
    bg: `omegaDark`,
    opacity: 0.72,
    transition: `width 160ms ease, background-color 160ms ease, opacity 160ms ease`
  },
  preview: {
    position: `fixed`,
    left: `calc(6.75rem + env(safe-area-inset-left, 0px))`,
    zIndex: 6,
    boxSizing: `border-box`,
    width: `min(40rem, calc(100vw - 8rem))`,
    p: 3,
    borderWidth: 1,
    borderStyle: `solid`,
    borderColor: `omegaLight`,
    borderRadius: `lg`,
    bg: `contentBg`,
    boxShadow: `0 1rem 3rem rgba(0, 0, 0, 0.28)`,
    pointerEvents: `none`
  },
  previewTitle: {
    m: 0,
    overflow: `hidden`,
    color: `heading`,
    textOverflow: `ellipsis`,
    whiteSpace: `nowrap`
  },
  previewDetail: {
    display: `block`,
    mt: 2,
    overflow: `hidden`,
    color: `text`,
    fontSize: 2,
    lineHeight: `body`,
    textOverflow: `ellipsis`,
    whiteSpace: `nowrap`
  }
}

const getTargetId = url => {
  const fragmentStart = url.indexOf(`#`)
  if (fragmentStart === -1) return null

  const encodedTargetId = url.slice(fragmentStart + 1)

  try {
    return decodeURIComponent(encodedTargetId)
  } catch {
    return encodedTargetId
  }
}

const getLineWidth = title => {
  if (title.length <= 30) return 16
  if (title.length <= 55) return 28
  return 40
}

const normalizeText = value => value.replace(/\s+/g, ` `).trim()

const getSectionDetail = (item, sectionIds) => {
  const targetId = getTargetId(item.url)
  const target = targetId ? document.getElementById(targetId) : null
  if (!target) return ``

  let candidate = target.nextElementSibling

  while (candidate) {
    if (candidate.id && sectionIds.has(candidate.id)) break

    const tagName = candidate.tagName
    const containsMedia = candidate.querySelector(
      `figure, img, picture, video, iframe`
    )

    if (!containsMedia && [`P`, `BLOCKQUOTE`, `UL`, `OL`].includes(tagName)) {
      const textSource =
        tagName === `UL` || tagName === `OL`
          ? candidate.querySelector(`li`)
          : candidate
      const detail = normalizeText(textSource ? textSource.textContent : ``)

      if (detail) return detail
    }

    candidate = candidate.nextElementSibling
  }

  return ``
}

const ArticleContentsRail = ({ items, onItemSelect }) => {
  const railRef = useRef(null)
  const previewRef = useRef(null)
  const blurFrameRef = useRef(null)
  const previewFrameRef = useRef(null)
  const [details, setDetails] = useState({})
  const [preview, setPreview] = useState(null)
  const [previewTop, setPreviewTop] = useState(PREVIEW_GUTTER)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const sectionIds = new Set(items.map(item => getTargetId(item.url)))
      const nextDetails = {}

      items.forEach(item => {
        nextDetails[item.url] = getSectionDetail(item, sectionIds)
      })

      setDetails(nextDetails)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [items])

  useEffect(() => {
    if (!preview) return undefined

    previewFrameRef.current = window.requestAnimationFrame(() => {
      previewFrameRef.current = null

      const previewHeight =
        previewRef.current?.getBoundingClientRect().height ||
        PREVIEW_FALLBACK_HEIGHT
      const maximumTop = Math.max(
        PREVIEW_GUTTER,
        window.innerHeight - previewHeight - PREVIEW_GUTTER
      )

      setPreviewTop(
        Math.min(
          Math.max(PREVIEW_GUTTER, preview.anchorY - previewHeight / 2),
          maximumTop
        )
      )
    })

    return () => {
      if (previewFrameRef.current !== null) {
        window.cancelAnimationFrame(previewFrameRef.current)
        previewFrameRef.current = null
      }
    }
  }, [preview])

  useEffect(() => {
    const handleResize = () => setPreview(null)

    window.addEventListener(`resize`, handleResize)
    return () => window.removeEventListener(`resize`, handleResize)
  }, [])

  useEffect(
    () => () => {
      if (blurFrameRef.current !== null) {
        window.cancelAnimationFrame(blurFrameRef.current)
      }
    },
    []
  )

  const showPreview = (event, index) => {
    if (blurFrameRef.current !== null) {
      window.cancelAnimationFrame(blurFrameRef.current)
      blurFrameRef.current = null
    }

    const rect = event.currentTarget.getBoundingClientRect()
    setPreview({
      anchorY: rect.top + rect.height / 2,
      index
    })
  }

  const hidePreviewAfterBlur = () => {
    blurFrameRef.current = window.requestAnimationFrame(() => {
      blurFrameRef.current = null

      if (!railRef.current?.contains(document.activeElement)) {
        setPreview(null)
      }
    })
  }

  const handleKeyDown = (event, item) => {
    if (event.key === `Escape`) {
      event.preventDefault()
      setPreview(null)
      return
    }

    if (event.key === ` ` || event.key === `Enter`) {
      event.preventDefault()
      setPreview(null)
      onItemSelect(item)
    }
  }

  const activeItem = preview ? items[preview.index] : null
  const activeDetail = activeItem ? details[activeItem.url] : ``

  return (
    <>
      <Box
        as='nav'
        ref={railRef}
        aria-label='Yazı bölümleri'
        onMouseLeave={() => setPreview(null)}
        sx={styles.rail}
      >
        <Box as='ol' sx={styles.list}>
          {items.map((item, index) => {
            const isActive = preview?.index === index

            return (
              <Box as='li' key={item.url} sx={styles.item}>
                <Box
                  as='button'
                  type='button'
                  aria-label={`Bölüme git: ${item.title}`}
                  aria-describedby={
                    isActive ? `article-contents-preview` : undefined
                  }
                  onClick={() => {
                    setPreview(null)
                    onItemSelect(item)
                  }}
                  onFocus={event => showPreview(event, index)}
                  onBlur={hidePreviewAfterBlur}
                  onKeyDown={event => handleKeyDown(event, item)}
                  onMouseEnter={event => showPreview(event, index)}
                  onMouseLeave={() => setPreview(null)}
                  sx={styles.button}
                >
                  <Box
                    as='span'
                    aria-hidden='true'
                    sx={{
                      ...styles.line,
                      width: isActive ? 52 : getLineWidth(item.title),
                      bg: isActive ? `heading` : `omegaDark`,
                      opacity: isActive ? 1 : styles.line.opacity
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
      {activeItem && (
        <Box
          ref={previewRef}
          id='article-contents-preview'
          role='tooltip'
          sx={{
            ...styles.preview,
            top: previewTop
          }}
        >
          <Heading as='div' variant='h4' sx={styles.previewTitle}>
            {activeItem.title}
          </Heading>
          {activeDetail && (
            <Text as='span' sx={styles.previewDetail}>
              {activeDetail}
            </Text>
          )}
        </Box>
      )}
    </>
  )
}

ArticleContentsRail.propTypes = {
  items: PropTypes.arrayOf(itemType).isRequired,
  onItemSelect: PropTypes.func.isRequired
}

export default ArticleContentsRail
