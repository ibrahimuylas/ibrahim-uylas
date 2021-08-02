import React from 'react'
import { Link } from 'gatsby'
import { Flex, Button, Heading, Text } from 'theme-ui'
import { FaMountain } from 'react-icons/fa'
import Divider from '@components/Divider'

const styles = {
  wrapper: {
    alignItems: `center`,
    flexDirection: `column`,
    bg: `omegaLighter`,
    borderRadius: `lg`,
    size: `full`,
    p: 4,
  },
  heading: {
    color: `omegaDark`,
    svg: {
      color: `beta`,
      size: `icon.lg`,
      display: `block`,
      mb: 3,
    },
  },
  subheading: {
    color: `omegaDark`,
    fontWeight: `normal`,
  },
  list: {
    color: `omegaDark`,
    listStyle: `none`,
    m: 0,
    p: 0,
    li: {
      p: 0,
      my: 2,
    },
    'li:before': {
      content: `""`,
      display: `inline-block`,
      width: `icon.xs`,
      bg: `success`,
      borderRadius: `full`,
      size: `7px`,
      mr: `7px`,
    },
  },
  button: {
    display: `block`,
    mt: `auto`,
  },
}

const BannerVertical = () => (
  <Flex sx={styles.wrapper}>
    <Heading variant='h5' sx={styles.heading}>
      <FaMountain />
      Merhaba,
    </Heading>
    <Text variant='small'>
      Ben İbrahim Uylaş. Kampçı, doğa yürüyüşçüsü, maceracı, motosiklet tutkunu, yol yapmayı seven, yolda olan ve yolda yaşayan bir bilgisayar mühendisiyim.
    </Text>
    <Divider space={3} />

    <Text variant='small' sx={styles.list}>
      Şu aralar Londra'da yaşamaktayım ve  kampçılık, doğa yürüyüşleri, ekipmanlar, rotalar ve yol anılarımı sizinle paylaşıyorum. Sende tecrübelerini yorum olarak ekleyip katkıda bulunabilirsin.
    </Text>
    <Button
      variant='primary'
      as={Link}
      to='/ibrahim-uylas-kimdir'
      sx={styles.button}
      aria-label='ibrahim uylaş kimdir'
    >
      Bu adam kim?
    </Button>
  </Flex>
)

export default BannerVertical
