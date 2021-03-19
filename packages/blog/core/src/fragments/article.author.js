import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleAuthor on ArticleAuthor {
    id
    name
    slug
    title
    description
    skills
    social {
      name
      url
    }
    thumbnail {
      __typename
      ... on ImageSharp {
        regular: fixed(width: 150, height: 150, cropFocus: NORTH, quality: 85) {
          width
          height
          src
          srcSet
          srcWebp
          srcSetWebp
        }
      }
      ... on ContentfulAsset {
        regular: fixed(width: 150, height: 150, cropFocus: TOP, quality: 85) {
          width
          height
          src
          srcSet
          srcWebp
          srcSetWebp
        }
      }
      ... on SanityImageAsset {
        regular: fixed(width: 150, height: 150) {
          width
          height
          src
          srcSet
          srcWebp
          srcSetWebp
        }
      }
    }
  }
`
