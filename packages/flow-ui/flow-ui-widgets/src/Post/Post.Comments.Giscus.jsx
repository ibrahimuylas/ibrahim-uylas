import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'theme-ui'

const GISCUS_CLIENT_URL = 'https://giscus.app/client.js'

const normalizePathname = slug => {
  if (!slug) return undefined

  const pathname = slug.startsWith('/') ? slug : `/${slug}`
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

const PostCommentsGiscus = ({ slug, giscus }) => {
  const containerRef = useRef(null)
  const pathname = normalizePathname(slug)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !containerRef.current ||
      !pathname ||
      !giscus?.repoId ||
      !giscus?.categoryId
    ) {
      return undefined
    }

    const script = document.createElement('script')
    script.src = GISCUS_CLIENT_URL
    script.async = true
    script.crossOrigin = 'anonymous'

    const attributes = {
      'data-repo': giscus.repo,
      'data-repo-id': giscus.repoId,
      'data-category': giscus.category,
      'data-category-id': giscus.categoryId,
      'data-mapping': 'specific',
      'data-term': `/${pathname.replace(/^\/+/, ``)}`,
      'data-strict': '1',
      'data-reactions-enabled': '0',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': giscus.theme || 'light',
      'data-lang': 'tr',
      'data-loading': 'lazy'
    }

    Object.entries(attributes).forEach(([name, value]) => {
      script.setAttribute(name, value)
    })

    containerRef.current.replaceChildren(script)

    return () => {
      containerRef.current?.replaceChildren()
    }
  }, [giscus, pathname])

  return (
    <Box
      sx={{
        width: `100%`,
        '.giscus': { width: `100%` },
        '.giscus-frame': {
          width: `100%`,
          maxWidth: `100%`,
          border: 0
        }
      }}
    >
      <div ref={containerRef} className='giscus' data-giscus-embed />
    </Box>
  )
}

PostCommentsGiscus.propTypes = {
  slug: PropTypes.string,
  giscus: PropTypes.shape({
    repo: PropTypes.string.isRequired,
    repoId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
    theme: PropTypes.string
  }).isRequired
}

export default PostCommentsGiscus
