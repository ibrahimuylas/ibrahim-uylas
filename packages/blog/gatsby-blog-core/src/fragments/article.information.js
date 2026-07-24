import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleInformation on Article {
    id
    title
    slug
    link
    description
    excerpt(pruneLength: 155)
    tableOfContents(maxDepth: 2) @include(if: $includeTableOfContents)
    timeToRead @include(if: $includeTimeToRead)
    featured
    private
    protected
    thumbnailText
    date(formatString: "DD MMMM YYYY", locale: "tr")
    modified(formatString: "DD MMMM YYYY", locale: "tr")
    datePublished: date(formatString: "YYYY-MM-DD")
    dateModified: modified(formatString: "YYYY-MM-DD")
    category {
      ...ArticleCategory
    }
    author {
      ...ArticleAuthor
    }
    keywords
    tags {
      id
      name
      slug
    }
  }
`
