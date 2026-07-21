import React from 'react'
import { Flex, Box } from 'theme-ui'

const styles = {
  wrapper: src => ({
    alignItems: `center`,
    flexDirection: [`column`, `row`],
    bg: `omegaDarker`,
    borderRadius: `default`,
    backgroundColor: 'black',
    width: `100%`,
    p: 0,
    m: 0
  }),
  left: {
    flexBasis: `1/2`,
    width: `100%`
  },
  right: {
    flexBasis: `1/2`,
    textAlign: `right`,
    width: `100%`
  }
}

const BannerHorizontal = () => {
  return (
    <Flex sx={styles.wrapper()}>
      <Box sx={styles.left}>
        <iframe
          width='100%'
          height='315'
          src='https://www.youtube.com/embed/_3C3EcKKVSs'
          title='İbrahim Uylaş doğa videosu'
          frameBorder='0'
          loading='lazy'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
        ></iframe>
      </Box>
      <Box sx={styles.right}>
        <iframe
          width='100%'
          height='315'
          src='https://www.youtube.com/embed/CGOhJ-vo390'
          title='İbrahim Uylaş kamp videosu'
          frameBorder='0'
          loading='lazy'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
        ></iframe>
      </Box>
    </Flex>
  )
}

export default BannerHorizontal
