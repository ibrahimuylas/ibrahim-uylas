import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Box } from 'theme-ui'
import Avatar from '@components/Avatar'

const styles = {
  wrapper: {
    display: [`none`, `none`, `block`],
    position: `relative`,
    textAlign: `center`
  },
  pattern: {
    height: `1/2`,
    transform: `translate(0, 50%)`
  }
}

export default () => {
  const data = useStaticQuery(heroQuery)
  const { file } = data

  return (
    <Box sx={styles.wrapper}>
      <Avatar avatar={file.avatar} withPattern patternStyles={styles.pattern} />
    </Box>
  )
}

const heroQuery = graphql`
  query HeroQuery {
    file(absolutePath: { regex: "/hero.(jpeg|jpg|gif|png)/" }) {
      avatar: childImageSharp {
        regular: fluid(maxWidth: 320, maxHeight: 320, cropFocus: NORTH) {
          ...GatsbyImageSharpFluid_noBase64
          width: presentationWidth
          height: presentationWidth
        }
      }
    }
  }
`
