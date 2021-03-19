import { graphql } from 'gatsby'

export const regular = graphql`
  fragment ArticleThumbnailRegular on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        vertical: fixed(width: 380, height: 290, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
      ... on ContentfulAsset {
        vertical: fixed(
          width: 380
          height: 290
          cropFocus: CENTER
          quality: 85
        ) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650, cropFocus: CENTER, quality: 85) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
      ... on SanityImageAsset {
        vertical: fixed(width: 380, height: 290) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
    }
  }
`
export const large = graphql`
  fragment ArticleThumbnailFeatured on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        vertical: fixed(width: 360, height: 470, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        horizontal: fixed(width: 750, height: 400, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
      ... on ContentfulAsset {
        vertical: fixed(
          width: 360
          height: 470
          cropFocus: CENTER
          quality: 85
        ) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        horizontal: fixed(
          width: 750
          height: 400
          cropFocus: CENTER
          quality: 85
        ) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650, cropFocus: CENTER) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
      ... on SanityImageAsset {
        vertical: fixed(width: 360, height: 470) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        horizontal: fixed(width: 750, height: 400) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        hero: fixed(width: 1600, height: 650) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
      }
    }
  }
`
