import React from 'react'
import { Box } from 'theme-ui'
import { HeaderLogo } from '../Header/Header.Logo'

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

export const FooterLogo = ({ homePath = '/', copyright = 'All Rights Reserved.' }) => (
  <>
    <Box sx={styles.logo}>
      <HeaderLogo grayscale to={homePath} />
    </Box>
    <Box sx={styles.copyright}>
      © {new Date().getFullYear()}, {copyright}
    </Box>
  </>
)
