import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'
import { css } from 'theme-ui'
import Divider from '@components/Divider'

const styles = {
  regular: {
    minHeight: `23rem`,
    bg: `omegaLighter`,
    borderRadius: `lg`,
  },
  wide: {
    borderRadius: `lg`,
  },
  full: {
    bg: `omegaLighter`,
  },
  inCard: {
    bg: `omegaLighter`,
    borderRadius: (t) => `${t.radii.lg} ${t.radii.lg} 0 0`,
    mt: -4,
    mx: -4,
  },
  fullImg: {
    position: `static`,
    display: `block`,
  },
}

export const PostImage = ({ thumbnail, wide, full, inCard }) => {
  if (!thumbnail || !thumbnail.hero) return null

  const variant = (wide && 'wide') || (full && 'full') || 'regular'

  return (
    <>
      <Img
        fluid={thumbnail.hero}
        css={css({ ...styles[variant], ...(inCard && styles.inCard) })}
        imgStyle={(variant === 'wide' || variant === 'full') && styles.fullImg}
      />
      <Divider space={3} />
    </>
  )
}

PostImage.propTypes = {
  wide: PropTypes.bool,
  full: PropTypes.bool,
  inCard: PropTypes.bool,
}
