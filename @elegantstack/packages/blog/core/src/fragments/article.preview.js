import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticlePreview on Article {
    id
    title
    slug
    link
    excerpt
    timeToRead
    featured
    thumbnailText
    date(formatString: "MMMM DD, YYYY")
    category {
      ...ArticleCategory
    }
    author {
      ...ArticleAuthor
    }
  }
`
