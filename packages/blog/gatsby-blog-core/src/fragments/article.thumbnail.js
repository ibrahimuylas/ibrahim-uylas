import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleThumbnailCard on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        ImageSharp_vertical: gatsbyImageData(
          width: 380
          height: 290
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
          quality: $imageQuality
        )
      }
      ... on ContentfulAsset {
        ContentfulAsset_vertical: gatsbyImageData(
          width: 380
          height: 290
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: $imageQuality
          resizingBehavior: THUMB
        )
      }
      ... on SanityImageAsset {
        SanityImageAsset_vertical: gatsbyImageData(
          width: 380
          height: 290
          outputPixelDensities: [0.5, 1]
        )
      }
    }
  }
  fragment ArticleThumbnailHero on Article {
    thumbnail {
      __typename
      ... on ImageSharp {
        # Keep the source aspect ratio so tall 3:2 banners are not cropped to
        # the legacy 1600x650 hero shape.
        ImageSharp_hero: gatsbyImageData(
          width: 1600
          outputPixelDensities: [0.5, 1]
          quality: $imageQuality
        )
      }
      ... on ContentfulAsset {
        ContentfulAsset_hero: gatsbyImageData(
          width: 1600
          formats: [JPG, WEBP]
          quality: $imageQuality
          resizingBehavior: THUMB
        )
      }
      ... on SanityImageAsset {
        SanityImageAsset_hero: gatsbyImageData(
          width: 1600
          outputPixelDensities: [0.5, 1]
        )
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
          quality: $imageQuality
        )
        ImageSharp_horizontal: gatsbyImageData(
          width: 807
          height: 400
          transformOptions: { cropFocus: CENTER }
          outputPixelDensities: [0.5, 1]
          quality: $imageQuality
        )
      }
      ... on ContentfulAsset {
        ContentfulAsset_vertical: gatsbyImageData(
          width: 360
          height: 470
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: $imageQuality
          resizingBehavior: THUMB
        )
        ContentfulAsset_horizontal: gatsbyImageData(
          width: 807
          height: 400
          cropFocus: CENTER
          formats: [JPG, WEBP]
          quality: $imageQuality
          resizingBehavior: THUMB
        )
      }
      ... on SanityImageAsset {
        SanityImageAsset_vertical: gatsbyImageData(
          width: 360
          height: 470
          outputPixelDensities: [0.5, 1]
        )
        SanityImageAsset_horizontal: gatsbyImageData(
          width: 807
          height: 400
          outputPixelDensities: [0.5, 1]
        )
      }
    }
  }
`
