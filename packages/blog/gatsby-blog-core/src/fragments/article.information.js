import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleInformation on Article {
    id
    title
    slug
    link
    excerpt(pruneLength: 155)
    tableOfContents(maxDepth: 2) @include(if: $includeTableOfContents)
    timeToRead @include(if: $includeTimeToRead)
    featured
    protected
    thumbnailText
    date(formatString: "MMMM DD, YYYY")
    modified(formatString: "MMMM DD, YYYY")
    datePublished: date(formatString: "YYYY-MM-DD")
    dateModified: modified(formatString: "YYYY-MM-DD")
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
