import React from 'react'
import { GatsbyImage as Img } from 'gatsby-plugin-image'
import { css } from 'theme-ui'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'

const CardMediaImage = ({ variant, loading = 'lazy', image, title }) => (
  <Img
    image={image}
    loading={loading}
    alt={title}
    css={css(
      responsiveVariantStyles(rv(variant, 'image'), {
        height: `full`,
        verticalAlign: `middle`, //avoid baseline gap
        img: {
          bg: `omegaLighter`
        }
      })
    )}
  />
)
export default CardMediaImage
