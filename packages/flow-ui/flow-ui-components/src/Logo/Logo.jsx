import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { GatsbyImage as Img } from 'gatsby-plugin-image'
import { Heading } from 'theme-ui'

const styles = {
  images: {
    position: `relative`,
    display: `inline-block`,
    verticalAlign: `middle`
  },
  image: {
    verticalAlign: `middle`
  },
  imageLight: {
    opacity: `var(--theme-ui-colors-logoLightOpacity)`
  },
  imageDark: {
    position: `absolute`,
    inset: 0,
    opacity: `var(--theme-ui-colors-logoDarkOpacity)`
  },
  grayscale: {
    WebkitFilter: `grayscale(1)`,
    filter: `grayscale(1)`,
    opacity: `0.7`
  },
  title: {
    m: 0
  }
}

const Logo = ({ title, grayscale, image, imageDark, to = '/', ...props }) => (
  <Heading
    as={Link}
    to={to}
    alt={title}
    aria-label={title}
    variant='h2'
    sx={styles.title}
    {...props}
  >
    {image ? (
      <span style={styles.images}>
        <Img
          image={image}
          loading='eager'
          {...props}
          style={
            grayscale
              ? {
                  ...styles.grayscale,
                  ...styles.image,
                  ...styles.imageLight
                }
              : { ...styles.image, ...styles.imageLight }
          }
        />
        {imageDark && (
          <Img
            image={imageDark}
            loading='eager'
            {...props}
            aria-hidden='true'
            alt=''
            style={
              grayscale
                ? {
                    ...styles.grayscale,
                    ...styles.image,
                    ...styles.imageDark
                  }
                : { ...styles.image, ...styles.imageDark }
            }
          />
        )}
      </span>
    ) : (
      title
    )}
  </Heading>
)

export default Logo

Logo.propTypes = {
  title: PropTypes.string,
  grayscale: PropTypes.bool,
  imageDark: PropTypes.object,
  fixed: PropTypes.object, //gatsby-transform-sharp
  to: PropTypes.string
}
