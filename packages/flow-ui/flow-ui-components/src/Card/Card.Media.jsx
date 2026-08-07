import React from 'react'
import { Link as GLink } from 'gatsby'
import { Link, Box, useThemeUI, get } from 'theme-ui'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'
import getImageVariant from '@components/utils/getImageVariant'
import CardMediaIcon from './Card.Media.Icon'
import CardMediaImage from './Card.Media.Image'

const DEFAULT_IMAGE_VARIANT = 'vertical'

const styles = {
  link: {
    userSelect: `none`,
    textAlign: `center`,
    position: `relative`,
    display: `block`
  }
}

const CardMedia = ({
  imageVariant,
  omitMedia,
  mediaType = 'image',
  mobileMediaType,
  showMediaOnMobile,
  title,
  slug,
  link,
  ...props
}) => {
  const context = useThemeUI()

  if (omitMedia && !showMediaOnMobile) return null

  const { variant, thumbnail, thumbnailText } = props
  const mediaOnlyOnMobile = omitMedia && showMediaOnMobile
  const imageOnlyOnMobile = mobileMediaType === 'image'
  const iconOnlyOnDesktop = mobileMediaType === 'image'

  const imageVar =
    imageVariant ||
    get(context.theme, rv(variant, 'imageVariant')[0]) ||
    DEFAULT_IMAGE_VARIANT

  const image = getImageVariant(thumbnail, imageVar)

  const linkProps = link
    ? {
        as: 'a',
        href: link,
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    : {
        as: GLink,
        to: slug
      }

  return (
    <Link
      {...linkProps}
      css={styles.link}
      sx={theme => ({
        ...responsiveVariantStyles(rv(variant, 'media'))(theme),
        ...(mediaOnlyOnMobile && { display: [`block`, `none`, `none`] })
      })}
      aria-label={title}
    >
      {mediaType === 'image' &&
        image &&
        !imageOnlyOnMobile &&
        (mediaOnlyOnMobile ? (
          <Box sx={{ display: [`block`, `none`, `none`] }}>
            <CardMediaImage image={image} title={title} {...props} />
          </Box>
        ) : (
          <CardMediaImage image={image} title={title} {...props} />
        ))}
      {(mediaType === 'icon' || (!image && thumbnailText)) &&
        (iconOnlyOnDesktop ? (
          <CardMediaIcon hideOnMobile {...props} />
        ) : (
          <CardMediaIcon {...props} />
        ))}
      {imageOnlyOnMobile && image && (
        <Box sx={{ display: [`block`, `none`, `none`] }}>
          <CardMediaImage image={image} title={title} {...props} />
        </Box>
      )}
    </Link>
  )
}

export default CardMedia
