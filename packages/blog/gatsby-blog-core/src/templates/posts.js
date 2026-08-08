import { graphql } from 'gatsby'
import PostsPage from '../containers/Posts'

export default PostsPage

export const pageQuery = graphql`
  query PostsPageQuery(
    $paginatePostsPage: Boolean!
    $skip: Int
    $limit: Int
    $includeExcerpt: Boolean!
    $includeTimeToRead: Boolean!
    $imageQuality: Int!
    $homeCategoryPostsPerGroup: Int!
  ) {
    homeOgImage: file(
      name: { eq: "diger-jeep-kamp-hero" }
      sourceInstanceName: { eq: "asset" }
    ) {
      childImageSharp {
        gatsbyImageData(width: 1600, quality: 80)
      }
    }
    featuredPosts: allArticle(
      filter: {
        private: { ne: true }
        draft: { ne: true }
        featured: { eq: true }
      }
      sort: { date: DESC }
      limit: 10
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailFeatured
      }
    }
    recentPosts: allArticle(
      filter: { private: { ne: true }, draft: { ne: true } }
      sort: { date: DESC }
      limit: 6
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailCard
      }
    }
    posts: allArticle(
      filter: { private: { ne: true }, draft: { ne: true } }
      sort: { date: DESC }
      limit: 1000
    ) @skip(if: $paginatePostsPage) {
      group(
        field: { category: { name: SELECT } }
        limit: $homeCategoryPostsPerGroup
      ) {
        categoryName: fieldValue
        nodes {
          ...ArticlePreview
          ...ArticleThumbnailCard
        }
      }
    }
    paginatedPosts: allArticle(
      filter: { private: { ne: true }, draft: { ne: true } }
      sort: { date: DESC }
      limit: $limit
      skip: $skip
    ) @include(if: $paginatePostsPage) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailCard
      }
      ...ArticlePagination
    }
  }
`
