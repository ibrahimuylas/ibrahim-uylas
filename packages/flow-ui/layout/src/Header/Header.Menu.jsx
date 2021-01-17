import React from 'react'
import { Box } from 'theme-ui'
import Navigation from '@components/Navigation'
import Drawer from '@components/Drawer'
import useSiteMetadata from '@helpers/useSiteMetadata'

const styles = {
  desktopMenu: {
    display: [`none`, `none`, `block`]
  },
  mobileMenu: {
    display: [`block`, `block`, `none`]
  },
  desktopMenuWrapper: {
    justifyContent: 'flex-end'
  }
}

export const HeaderMenu = ({ locationState, mobileMenu = {} }) => {
  const { headerMenu } = useSiteMetadata()

  const desktopMenuNav = (
    <Navigation
      variant='horizontal'
      items={headerMenu}
      wrapperStyle={styles.desktopMenuWrapper}
    />
  )

  const mobileMenuNav = (
    <Drawer width='70%' locationState={locationState}>
      <Navigation
        variant='vertical'
        headingProps={{ variant: 'h3' }}
        items={[
          {
            title: 'Main Menu',
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
