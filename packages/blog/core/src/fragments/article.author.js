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
        regular: fixed(width: 150, height: 150, cropFocus: NORTH) {
          width
          height
          src
          srcSet
        }
      }
      ... on ContentfulAsset {
        regular: fixed(width: 150, height: 150, cropFocus: TOP) {
          width
          height
          src
          srcSet
        }
      }
      ... on SanityImageAsset {
        regular: fixed(width: 150, height: 150) {
          width
          height
          src
          srcSet
        }
      }
    }
  }
`
