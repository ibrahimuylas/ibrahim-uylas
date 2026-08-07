import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticlePreview on Article {
    id
    title
    slug
    link
    excerpt @include(if: $includeExcerpt)
    timeToRead @include(if: $includeTimeToRead)
    featured
    thumbnailText
    date(formatString: "DD MMMM YYYY", locale: "tr")
    category {
      ...ArticleCategory
    }
    author {
      ...ArticleAuthorPreview
    }
  }
`
