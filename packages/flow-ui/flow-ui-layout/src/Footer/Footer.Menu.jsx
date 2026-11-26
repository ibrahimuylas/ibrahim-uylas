import React from 'react'
import { Box } from 'theme-ui'
import Navigation from '@components/Navigation'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'

const styles = {
  navHeader: {
    display: [`none`, `block`]
  }
}

export const FooterMenu = ({ items }) => {
  const { footerMenu } = useSiteMetadata()

  return (
    <>
      {(items || footerMenu).map(menu => (
        <Box key={`footer-menu-${menu.title}`}>
          <Navigation
            variant={[`horizontal`, `vertical`]}
            headingProps={{ variant: 'h4', as: 'p', sx: styles.navHeader }}
            items={[menu]}
          />
        </Box>
      ))}
    </>
  )
}
