import React from 'react'
import { Link as GLink } from 'gatsby'
import Img from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'
import { Box, Link } from 'theme-ui'
import Section from '@components/Section'

const styles = {
  imageWrapper: ({ width, height }) => ({
    width: `full`,
    maxWidth: width,
    maxHeight: height,
    borderRadius: `default`,
    overflow: `hidden`
  }),
  caption: {
    display: `block`,
    textAlign: `center`,
    fontSize: 0,
    mt: 1
  }
}

const Sponsor = props => {
  const data = useStaticQuery(sponsorQuery)
  const { banner } = data

  const { fluid } = (banner && banner.childImageSharp) || {}
  if (!fluid) return null

  const { width, height } = fluid

  return (
    <Section aside title='Our Sponsor' {...props}>
      <Box sx={styles.imageWrapper({ width, height })}>
        <Link href='/' target='_blank'>
          <Img fluid={fluid} />
        </Link>
      </Box>
      <Link variant='mute' as={GLink} to='/contact' sx={styles.caption}>
        ADVERTISE WITH US
      </Link>
    </Section>
  )
}

const sponsorQuery = graphql`
  query SponsorQuery {
    banner: file(absolutePath: { regex: "/sponsor.(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        fluid(maxWidth: 342, maxHeight: 260, cropFocus: CENTER) {
          ...GatsbyImageSharpFluid_noBase64
          width: presentationWidth
          height: presentationWidth
        }
      }
    }
  }
`
export default Sponsor
