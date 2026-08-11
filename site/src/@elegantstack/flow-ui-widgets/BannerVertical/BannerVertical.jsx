import React from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { Flex, Box, Button, Text } from 'theme-ui'
import Divider from '@components/Divider'

const styles = {
  wrapper: {
    alignItems: `stretch`,
    flexDirection: `column`,
    bg: `omegaLighter`,
    borderRadius: `lg`,
    size: `full`,
    overflow: `hidden`
  },
  image: {
    flex: `0 0 auto`,
    width: `full`,
    height: [`250px`, `320px`, null, `260px`],
    lineHeight: 0,
    overflow: `hidden`
  },
  content: {
    alignItems: `stretch`,
    flex: `1 1 auto`,
    flexDirection: `column`,
    p: 4
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

const BannerVertical = () => (
  <Flex sx={styles.wrapper}>
    <Box sx={styles.image}>
      <StaticImage
        src='../../../../content/assets/bu-adam-kim.jpeg'
        alt='İbrahim Uylaş doğa yürüyüşünde'
        layout='fullWidth'
        placeholder='blurred'
        quality={92}
        style={{ width: `100%`, height: `100%` }}
        imgStyle={{ objectFit: `cover`, objectPosition: `50% 38%` }}
      />
    </Box>
    <Flex sx={styles.content}>
      <Text variant='small'>
        Ben İbrahim Uylaş. Kampçı, doğa yürüyüşçüsü, maceracı, motosiklet
        tutkunu, yol yapmayı seven, yolda olan ve yolda yaşayan bir bilgisayar
        mühendisiyim.
      </Text>
      <Divider space={3} />

      <Text variant='small' sx={styles.list}>
        Şu aralar Londra'da yaşamaktayım ve kampçılık, doğa yürüyüşleri,
        ekipmanlar, rotalar ve yol anılarımı sizinle paylaşıyorum. Sende
        tecrübelerini yorum olarak ekleyip katkıda bulunabilirsin.
      </Text>
      <Button
        variant='primary'
        as={Link}
        to='/ibrahim-uylas-kimdir/'
        sx={styles.button}
        aria-label='ibrahim uylaş kimdir'
      >
        Bu adam kim?
      </Button>
    </Flex>
  </Flex>
)

export default BannerVertical
