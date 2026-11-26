import React from 'react'
import { Box } from 'theme-ui'
import Navigation from '@components/Navigation'
import Drawer from '@components/Drawer'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'

const styles = {
  desktopMenu: {
    display: [`none`, null, `block`]
  },
  mobileMenu: {
    display: [`block`, null, `none`]
  },
  desktopMenuWrapper: {
    justifyContent: 'flex-end'
  }
}

export const HeaderMenu = ({ mobileMenu = {}, items, menuTitle = 'Main Menu', drawerLabel = 'Menu' }) => {
  const metadata = useSiteMetadata()
  const headerMenu = items || metadata.headerMenu

  const desktopMenuNav = (
    <Navigation
      variant='horizontal'
      items={headerMenu}
      wrapperStyle={styles.desktopMenuWrapper}
    />
  )

  const mobileMenuNav = (
    <Drawer aria-label={drawerLabel}>
      <Navigation
        variant='vertical'
        headingProps={{ variant: 'h3' }}
        items={[
          {
            title: menuTitle,
            items: headerMenu
          },
          mobileMenu
        ]}
      />
    </Drawer>
  )

  return (
    <>
      <Box sx={styles.desktopMenu}>{desktopMenuNav}</Box>
      <Box sx={styles.mobileMenu}>{mobileMenuNav}</Box>
    </>
  )
}
