import React from 'react'
import { Box, Card, Flex } from 'theme-ui'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'
import columnSizeMatcher from '@components/utils/columnSizeMatcher'
import Body from './Card.Body'
import Footer from './Card.Footer'
import Media from './Card.Media'

const styles = {
  card: {
    overflow: `hidden`,
    height: `full`
  },
  content: {
    alignItems: `stretch`,
    height: `full`
  }
}

const CardBase = ({ columns, onMouseOver, ...props }) => (
  <Box
    className='blog_card'
    sx={columnSizeMatcher(columns)}
    onMouseOver={onMouseOver}
    onFocus={onMouseOver}
  >
    <Card
      variant='interactive'
      sx={responsiveVariantStyles(rv(props.variant, 'card'), styles.card)}
    >
      <Flex
        as='article'
        sx={responsiveVariantStyles(
          rv(props.variant, 'content'),
          styles.content
        )}
      >
        <Media {...props} />
        <Body {...props}>
          <Footer {...props} />
        </Body>
      </Flex>
    </Card>
  </Box>
)

export default CardBase
