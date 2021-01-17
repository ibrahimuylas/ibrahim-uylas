import { graphql } from 'gatsby'
import Collection from '../containers/Collection.Author'

export default Collection

export const pageQuery = graphql`
  query allArticleByAuthorQuery($skip: Int!, $limit: Int!, $slug: String!) {
    collectionInfo: articleAuthor(slug: { eq: $slug }) {
      ...ArticleAuthor
    }

    posts: allArticle(
      filter: { private: { ne: true }, author: { slug: { eq: $slug } } }
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
