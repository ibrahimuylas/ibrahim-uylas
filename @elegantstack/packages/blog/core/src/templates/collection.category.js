import { graphql } from 'gatsby'
import Collection from '../containers/Collection'

export default Collection

export const pageQuery = graphql`
  query allArticleByCategoryQuery($skip: Int!, $limit: Int!, $slug: String!) {
    collectionInfo: articleCategory(slug: { eq: $slug }) {
      id
      name
      slug
      description
    }

    posts: allArticle(
      filter: { private: { ne: true }, category: { slug: { eq: $slug } } }
      sort: { fields: [date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailRegular
      }
      ...ArticlePagination
    }
  }
`
