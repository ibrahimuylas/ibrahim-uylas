import React from 'react'
import { useColorMode } from 'theme-ui'
import { useStaticQuery, graphql } from 'gatsby'
import Logo from '@components/Logo'
import useSiteMetadata from '@helpers/useSiteMetadata'

export const HeaderLogo = ({ ...props }) => {
  const { title } = useSiteMetadata()

  const [colorMode] = useColorMode()
  const isDark = colorMode === `dark`

  const { logo, logoDark } = useStaticQuery(logoQuery)

  const logoNormal = logo && logo.childImageSharp && logo.childImageSharp.fixed
  const LogoDark =
    logoDark && logoDark.childImageSharp && logoDark.childImageSharp.fixed

  if (!logoNormal) return null

  return isDark && LogoDark ? (
    <Logo fixed={LogoDark} title={title} {...props} />
  ) : (
    <Logo fixed={logoNormal} title={title} {...props} />
  )
}

const logoQuery = graphql`
  query LogoQuery {
    logo: file(absolutePath: { regex: "/logo.(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        fixed(width: 150, quality: 100) {
          ...GatsbyImageSharpFixed_noBase64
        }
      }
    }
    logoDark: file(absolutePath: { regex: "/logo-dark.(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        fixed(width: 150, quality: 100) {
          ...GatsbyImageSharpFixed_noBase64
        }
      }
    }
  }
`
