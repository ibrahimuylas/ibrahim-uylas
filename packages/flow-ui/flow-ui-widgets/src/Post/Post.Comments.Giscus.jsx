import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider } from 'theme-ui'

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
      'data-mapping': 'pathname',
      'data-term': pathname,
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': 'preferred_color_scheme',
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
    <Box>
      <Divider />
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
    categoryId: PropTypes.string.isRequired
  }).isRequired
}

export default PostCommentsGiscus
