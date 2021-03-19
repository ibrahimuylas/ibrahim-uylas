import React, { useContext } from 'react'
import { Container, Box, Flex } from 'theme-ui'
import pageContextProvider from '@helpers/pageContextProvider'
import Search from '@widgets/Search'
import { HeaderLogo } from './Header.Logo'
import { HeaderMenu } from './Header.Menu'
import { HeaderColorMode } from './Header.ColorMode'

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
    flexBasis: [`full`, `full`, `1/3`]
  },
  searchContainer: {
    flexBasis: [`auto`, `auto`, `1/3`],
    minWidth: `auto`,
    order: [3, 3, `unset`],
    mx: 3
  },
  menuContainer: {
    flexBasis: [`auto`, `auto`, `1/3`],
    minWidth: `auto`,
    order: [4, 4, `unset`]
  },
  colorModeContainer: {
    minWidth: `auto`,
    order: [2, 2, `unset`]
  }
}

export const Header = ({ children }) => {
  const context = useContext(pageContextProvider)

  const locationState =
    context.location && context.location.state && context.location.state.key

  const { services, mobileMenu, darkMode } = context.pageContext

  const algolia = services && services.algolia

  return (
    <Box sx={styles.wrapper}>
      <Container variant='compact' sx={styles.container}>
        <Flex variant='layout.header'>
          <Box sx={styles.logoContainer}>
            <HeaderLogo />
          </Box>
          <Box sx={styles.searchContainer}>
            {algolia && <Search locationState={locationState} />}
          </Box>
          <Box sx={styles.menuContainer}>
            <HeaderMenu locationState={locationState} mobileMenu={mobileMenu} />
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
