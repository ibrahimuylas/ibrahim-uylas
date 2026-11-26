import React, { useContext } from 'react'
import { Container, Box, Flex } from 'theme-ui'
import pageContextProvider from '@helpers/pageContextProvider'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'
import { HeaderLogo } from '@layout/Header/Header.Logo'
import { HeaderMenu } from '@layout/Header/Header.Menu'
import { HeaderColorMode } from '@layout/Header/Header.ColorMode'
import BlogSearch from '../../../components/BlogSearch'
import LanguageSelector from '../../../i18n/LanguageSelector'
import { copy, localizeMenu } from '../../../i18n/copy'
import { getLanguageLinks, getPageLanguage } from '../../../i18n/language'

const styles = {
  wrapper: {
    position: `relative`,
    bg: `headerBg`
  },
  container: {
    position: `relative`,
    zIndex: 10
  },
  compactContainer: {
    '@media (max-width: 399px)': { px: 2 }
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
  compactLogo: {
    '@media (max-width: 399px)': {
      flex: '0 1 120px',
      minWidth: 0,
      '& a > span': { width: '100%' },
      '& .gatsby-image-wrapper': {
        width: '100% !important',
        height: 'auto !important',
        aspectRatio: '2 / 1'
      }
    },
    '@media (max-width: 350px)': {
      '& .gatsby-image-wrapper': {
        maxWidth: 44,
        aspectRatio: '4 / 5',
        '& img': {
          objectFit: 'cover !important',
          objectPosition: 'left center !important'
        }
      }
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
  searchWithLanguage: {
    width: [`auto`, null, `min(18rem, calc(100vw - 560px))`]
  },
  menuContainer: {
    flexBasis: `auto`,
    minWidth: `auto`,
    order: [4, null, `unset`],
    ml: [0, null, `auto`],
    mr: [0, null, 2]
  },
  controls: {
    display: `flex`,
    alignItems: `center`,
    flexShrink: 0,
    minWidth: `auto`,
    gap: 1,
    order: [2, null, `unset`]
  }
}

export const Header = ({ children }) => {
  const context = useContext(pageContextProvider)
  const { mobileMenu, darkMode } = context.pageContext
  const { headerMenu } = useSiteMetadata()
  const pathname = context.location?.pathname || '/'
  const language = getPageLanguage(pathname)
  const labels = copy[language]
  const languageLinks = getLanguageLinks(pathname)
  const menuItems = localizeMenu(headerMenu, language)

  return (
    <Box sx={styles.wrapper}>
      <Container
        variant='compact'
        sx={
          languageLinks
            ? { ...styles.container, ...styles.compactContainer }
            : styles.container
        }
      >
        <Flex variant='layout.header'>
          <Box
            sx={
              languageLinks
                ? { ...styles.logoContainer, ...styles.compactLogo }
                : styles.logoContainer
            }
          >
            <HeaderLogo to={labels.homePath} />
          </Box>
          <Box
            sx={
              languageLinks
                ? { ...styles.searchContainer, ...styles.searchWithLanguage }
                : styles.searchContainer
            }
          >
            <BlogSearch location={context.location} />
          </Box>
          <Box sx={styles.menuContainer}>
            <HeaderMenu
              items={menuItems}
              desktopItems={menuItems.filter(
                item => item.slug !== labels.homePath
              )}
              mobileMenu={localizeMenu([mobileMenu || {}], language)[0]}
              menuTitle={labels.mainMenu}
              drawerLabel={labels.menu}
            />
          </Box>
          <Box sx={styles.controls}>
            {darkMode && (
              <HeaderColorMode
                lightLabel={labels.themeLight}
                darkLabel={labels.themeDark}
              />
            )}
            <LanguageSelector
              pathname={pathname}
              language={language}
              links={languageLinks}
            />
          </Box>
        </Flex>
      </Container>
      {children}
    </Box>
  )
}
