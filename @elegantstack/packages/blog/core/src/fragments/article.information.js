import { graphql } from 'gatsby'

export const query = graphql`
  fragment ArticleInformation on Article {
    ...ArticlePreview
    body
    keywords
    tags {
      id
      name
      slug
    }
  }
`
