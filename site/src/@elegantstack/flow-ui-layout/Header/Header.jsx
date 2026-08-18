import React, { useContext } from 'react'
import { Container, Box, Flex } from 'theme-ui'
import pageContextProvider from '@helpers/pageContextProvider'
import { HeaderLogo } from '@layout/Header/Header.Logo'
import { HeaderMenu } from '@layout/Header/Header.Menu'
import { HeaderColorMode } from '@layout/Header/Header.ColorMode'
import BlogSearch from '../../../components/BlogSearch'

const styles = {
  wrapper: {
    position: `relative`,
    bg: `headerBg`
  },
  container: {
    position: `relative`,
    zIndex: 10
  },
  logoContainer: {
    flexBasis: `auto`,
    flexShrink: 0,
    mr: [`auto`, null, 0],
    '& .gatsby-image-wrapper': {
      width: [`120px !important`, `150px !important`],
      height: [`60px !important`, `75px !important`]
    }
  },
  searchContainer: {
    position: [`static`, null, `absolute`],
    top: [`auto`, null, `50%`],
    left: [`auto`, null, `50%`],
    flexBasis: `auto`,
    width: [`auto`, null, `18rem`],
    minWidth: `auto`,
    order: [3, null, `unset`],
    mx: [1, null, 0],
    transform: [`none`, null, `translate(-50%, -50%)`]
  },
  menuContainer: {
    flexBasis: `auto`,
    minWidth: `auto`,
    order: [4, null, `unset`],
    ml: [0, null, `auto`],
    mr: [0, null, 2]
  },
  colorModeContainer: {
    display: `flex`,
    alignItems: `center`,
    flexShrink: 0,
    minWidth: `auto`,
    order: [2, null, `unset`]
  }
}

export const Header = ({ children }) => {
  const context = useContext(pageContextProvider)
  const { mobileMenu, darkMode } = context.pageContext

  return (
    <Box sx={styles.wrapper}>
      <Container variant='compact' sx={styles.container}>
        <Flex variant='layout.header'>
          <Box sx={styles.logoContainer}>
            <HeaderLogo />
          </Box>
          <Box sx={styles.searchContainer}>
            <BlogSearch location={context.location} />
          </Box>
          <Box sx={styles.menuContainer}>
            <HeaderMenu mobileMenu={mobileMenu} />
          </Box>
          <Box sx={styles.colorModeContainer}>
            {darkMode && <HeaderColorMode />}
          </Box>
        </Flex>
      </Container>
      {children}
    </Box>
  )
}
