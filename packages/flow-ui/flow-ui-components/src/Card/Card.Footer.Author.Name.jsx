import React from 'react'
import { Link as GLink } from 'gatsby'
import { Text, Link } from 'theme-ui'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'

const styles = {
  author: {
    pr: 2
  }
}

const CardFooterAuthorName = ({ variant, omitAuthor, author }) =>
  !omitAuthor && author && author.slug ? (
    <Text sx={responsiveVariantStyles(rv(variant, 'author'), styles.author)}>
      <Link variant='mute' as={GLink} to={author.slug}>
        <strong>{author.name}</strong>
      </Link>
    </Text>
  ) : null

export default CardFooterAuthorName
