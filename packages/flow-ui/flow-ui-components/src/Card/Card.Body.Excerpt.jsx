import React from 'react'
import { Text, useThemeUI, get } from 'theme-ui'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'

const styles = {
  excerpt: {
    flex: `auto`,
    mb: 3
  }
}

const CardBodyExcerpt = ({ variant, excerpt, omitExcerpt }) => {
  const context = useThemeUI()

  const responsiveVariant = rv(variant, 'excerpt')

  const visibility = responsiveVariant.reduce(
    (mobileVisibility, variant) =>
      mobileVisibility === false &&
      get(context.theme, variant, {}).display === 'none'
        ? false
        : true,
    false
  )

  return !omitExcerpt && visibility ? (
    <Text
      variant='small'
      sx={responsiveVariantStyles(responsiveVariant, styles.excerpt)}
    >
      {excerpt}
    </Text>
  ) : null
}

export default CardBodyExcerpt
