import React from 'react'
import { Global } from '@emotion/react'
import { ThemeUIProvider, Flex, Box, css } from 'theme-ui'
import theme from '@elegantstack/flow-ui-theme/src/theme'
import pageContextProvider from '@helpers/pageContextProvider'
import { Header } from '@layout/Header/Header'
import { Footer } from '@layout/Footer/Footer'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'
import MobileActionDock from '../../../components/MobileActionDock'
import ScrollToTop from '../../../components/ScrollToTop'
import { copy, localizeMenu } from '../../../i18n/copy'
import { getPageLanguage } from '../../../i18n/language'

export const Layout = ({ children, pageContext, location }) => {
  const { footerMenu } = useSiteMetadata()
  const language = getPageLanguage(location?.pathname)
  const labels = copy[language]

  return (
    <ThemeUIProvider theme={theme}>
      <pageContextProvider.Provider value={{ pageContext, location }}>
        <Flex variant='layout.layout'>
          <Global styles={css(theme => theme.global)} />
          <Header />
          <Box variant='layout.body'>{children}</Box>
          <ScrollToTop label={labels.scrollTop} />
          <MobileActionDock location={location} />
          <Footer
            items={localizeMenu(footerMenu, language)}
            homePath={labels.homePath}
            copyright={labels.copyright}
          />
        </Flex>
      </pageContextProvider.Provider>
    </ThemeUIProvider>
  )
}
