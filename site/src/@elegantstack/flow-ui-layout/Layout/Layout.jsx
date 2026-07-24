import React from 'react'
import { Global } from '@emotion/react'
import { ThemeUIProvider, Flex, Box, css } from 'theme-ui'
import theme from '@elegantstack/flow-ui-theme/src/theme'
import pageContextProvider from '@helpers/pageContextProvider'
import { Header } from '@layout/Header/Header'
import { Footer } from '@layout/Footer/Footer'
import ScrollToTop from '../../../components/ScrollToTop'

export const Layout = ({ children, pageContext, location }) => (
  <ThemeUIProvider theme={theme}>
    <pageContextProvider.Provider value={{ pageContext, location }}>
      <Flex variant='layout.layout'>
        <Global styles={css(theme => theme.global)} />
        <Header />
        <Box variant='layout.body'>{children}</Box>
        <ScrollToTop />
        <Footer />
      </Flex>
    </pageContextProvider.Provider>
  </ThemeUIProvider>
)
