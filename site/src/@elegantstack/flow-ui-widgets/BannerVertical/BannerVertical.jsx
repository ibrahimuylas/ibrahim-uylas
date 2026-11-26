import React from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { Flex, Box, Button, Text } from 'theme-ui'
import Divider from '@components/Divider'
import { copy } from '../../../i18n/copy'
import { getLocalizedLink } from '../../../i18n/language'

const styles = {
  wrapper: {
    alignItems: `stretch`,
    flexDirection: `column`,
    bg: `omegaLighter`,
    borderRadius: `lg`,
    width: `full`,
    overflow: `hidden`,
    '@media screen and (min-width: 768px) and (max-width: 1199px)': {
      flexDirection: `row`
    }
  },
  image: {
    flex: `0 0 auto`,
    width: `full`,
    height: [`250px`, `320px`, null, `260px`],
    lineHeight: 0,
    overflow: `hidden`,
    '@media screen and (min-width: 768px) and (max-width: 1199px)': {
      flex: `0 0 42%`,
      width: `42%`,
      height: `360px`
    }
  },
  content: {
    alignItems: `stretch`,
    flex: `1 1 auto`,
    flexDirection: `column`,
    p: 4,
    '@media screen and (min-width: 768px) and (max-width: 1199px)': {
      p: 3
    }
  },
  list: {
    color: `omegaDark`,
    listStyle: `none`,
    m: 0,
    p: 0,
    li: {
      p: 0,
      my: 2
    },
    'li:before': {
      content: `""`,
      display: `inline-block`,
      width: `icon.xs`,
      bg: `success`,
      borderRadius: `full`,
      size: `7px`,
      mr: `7px`
    }
  },
  button: {
    display: `block`,
    alignSelf: `center`,
    mt: `auto`
  }
}

const BannerVertical = ({ language = 'tr' }) => {
  const labels = copy[language].homepage
  return (
    <Flex sx={styles.wrapper}>
      <Box sx={styles.image}>
        <StaticImage
          src='../../../../content/assets/bu-adam-kim.jpeg'
          alt={labels.authorImage}
          layout='fullWidth'
          placeholder='blurred'
          quality={92}
          style={{ width: `100%`, height: `100%` }}
          imgStyle={{ objectFit: `cover`, objectPosition: `50% 38%` }}
        />
      </Box>
      <Flex sx={styles.content}>
        <Text variant='small'>{labels.authorIntro}</Text>
        <Divider space={3} />

        <Text variant='small' sx={styles.list}>
          {labels.authorAbout}
        </Text>
        <Button
          variant='primary'
          as={Link}
          to={getLocalizedLink('/ibrahim-uylas-kimdir/', language).href}
          sx={styles.button}
          aria-label={labels.authorLinkLabel}
        >
          {labels.authorLink}
        </Button>
      </Flex>
    </Flex>
  )
}

export default BannerVertical
