import { graphql } from 'gatsby'
import Collection from '../containers/Collection'

export default Collection

export const pageQuery = graphql`
  query allArticleByTagQuery($skip: Int!, $limit: Int!, $slug: String!) {
    collectionInfo: articleTag(slug: { eq: $slug }) {
      id
      name
      slug
    }

    posts: allArticle(
      filter: {
        private: { ne: true }
        tags: { elemMatch: { slug: { eq: $slug } } }
      }
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
