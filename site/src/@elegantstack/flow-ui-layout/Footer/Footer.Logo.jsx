import React from 'react'
import { Box } from 'theme-ui'
import { HeaderLogo } from '@layout/Header/Header.Logo'

const styles = {
  logo: {
    pb: 1,
    mb: 2,
    mt: [4, 0]
  },
  copyright: {
    pt: 2,
    mb: [2, 4]
  }
}

export const FooterLogo = () => (
  <>
    <Box sx={styles.logo}>
      <HeaderLogo grayscale />
    </Box>
    <Box sx={styles.copyright}>
      © {new Date().getFullYear()}, All Rights Reserved.
    </Box>
  </>
)
