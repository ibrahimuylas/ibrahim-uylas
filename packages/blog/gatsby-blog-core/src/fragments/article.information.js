import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleInformation on Article {
    id
    title
    slug
    link
    timeToRead @include(if: $includeTimeToRead)
    featured
    thumbnailText
    date(formatString: "MMMM DD, YYYY")
    category {
      ...ArticleCategory
    }
    author {
      ...ArticleAuthor
    }
    body
    keywords
    tags {
      id
      name
      slug
    }
  }
`
