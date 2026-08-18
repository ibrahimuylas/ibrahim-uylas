import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { getImage } from 'gatsby-plugin-image'
import Logo from '@components/Logo'
import useSiteMetadata from '@helpers-blog/useSiteMetadata'

export const HeaderLogo = ({ ...props }) => {
  const { title } = useSiteMetadata()

  const { logo, logoDark } = useStaticQuery(logoQuery)

  const logoNormal = getImage(logo)
  const logoDarkImage = getImage(logoDark)

  if (!logoNormal) return null

  return (
    <Logo
      image={logoNormal}
      imageDark={logoDarkImage}
      title={title}
      alt={title}
      {...props}
    />
  )
}

const logoQuery = graphql`
  query LogoQuery {
    logo: file(
      absolutePath: { regex: "/logo.(jpeg|jpg|gif|png)/" }
      sourceInstanceName: { eq: "asset" }
    ) {
      childImageSharp {
        gatsbyImageData(
          width: 150
          layout: FIXED
          quality: 100
          placeholder: NONE
        )
      }
    }
    logoDark: file(
      absolutePath: { regex: "/logo-dark.(jpeg|jpg|gif|png)/" }
      sourceInstanceName: { eq: "asset" }
    ) {
      childImageSharp {
        gatsbyImageData(
          width: 150
          layout: FIXED
          quality: 100
          placeholder: NONE
        )
      }
    }
  }
`
