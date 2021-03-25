import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleThumbnailRegular on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        ImageSharp_vertical: gatsbyImageData(
          width: 380
          height: 290
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
        )
        ImageSharp_hero: gatsbyImageData(
          width: 1600
          height: 650
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
        )
      }
      ... on ContentfulAsset {
        ContentfulAsset_vertical: gatsbyImageData(
          width: 380
          height: 290
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: 75
          resizingBehavior: THUMB
        )
        ContentfulAsset_hero: gatsbyImageData(
          width: 1600
          height: 650
          formats: [JPG, WEBP]
          quality: 75
          resizingBehavior: THUMB
        )
      }
      ... on SanityImageAsset {
        SanityImageAsset_vertical: fixed(width: 380, height: 290) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        SanityImageAsset_hero: fixed(width: 1600, height: 650) {
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
  fragment ArticleThumbnailFeatured on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        ImageSharp_vertical: gatsbyImageData(
          width: 360
          height: 470
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
        )
        ImageSharp_horizontal: gatsbyImageData(
          width: 807
          height: 400
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
        )
        ImageSharp_hero: gatsbyImageData(
          width: 1600
          height: 650
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
        )
      }
      ... on ContentfulAsset {
        ContentfulAsset_vertical: gatsbyImageData(
          width: 360
          height: 470
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: 75
          resizingBehavior: THUMB
        )
        ContentfulAsset_horizontal: gatsbyImageData(
          width: 807
          height: 400
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: 75
          resizingBehavior: THUMB
        )
        ContentfulAsset_hero: gatsbyImageData(
          width: 1600
          height: 650
          formats: [JPG, WEBP]
          quality: 75
          resizingBehavior: THUMB
        )
      }
      ... on SanityImageAsset {
        SanityImageAsset_vertical: fixed(width: 360, height: 470) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        SanityImageAsset_horizontal: fixed(width: 750, height: 400) {
          src
          srcSet
          srcWebp
          srcSetWebp
          width
          height
        }
        SanityImageAsset_hero: fixed(width: 1600, height: 650) {
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
