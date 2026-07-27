import React from 'react'
import { graphql } from 'gatsby'
import { Layout, Main, Stack } from '@layout'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import CampingGuide, { allCuratedSlugs } from '../components/CampingGuide'
import campingGuidePolicy from '../components/campingGuidePolicy'
import campingGuide from '../content-guides/campingGuide'

const CampingCategoryPage = ({
  data: { hubArticles, latestArticles },
  pageContext,
  ...props
}) => {
  const siteUrl = (pageContext.siteUrl || '').replace(/\/$/, '')
  const guideArticles = campingGuidePolicy.selectGuideArticles({
    articles: hubArticles.nodes,
    curatedSlugs: allCuratedSlugs
  })
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: campingGuide.title,
    description: campingGuide.description,
    url: `${siteUrl}/category/kampcilik/`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guideArticles.length,
      itemListElement: guideArticles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: article.title,
        url: `${siteUrl}${article.slug}`
      }))
    }
  }

  return (
    <Layout pageContext={pageContext} {...props}>
      <Seo
        title={campingGuide.title}
        description={campingGuide.description}
        siteUrl={siteUrl}
      >
        <script type='application/ld+json'>
          {JSON.stringify(collectionPageSchema)}
        </script>
      </Seo>
      <Divider />
      <Stack effectProps={{ effect: false }}>
        <Main>
          <CampingGuide
            articles={hubArticles.nodes}
            latestArticles={latestArticles.nodes}
          />
        </Main>
      </Stack>
      <Divider />
    </Layout>
  )
}

export default CampingCategoryPage

export const pageQuery = graphql`
  query CampingCategoryGuideQuery(
    $slug: String!
    $includeExcerpt: Boolean!
    $includeTimeToRead: Boolean!
    $imageQuality: Int!
  ) {
    hubArticles: allArticle(
      filter: {
        private: { ne: true }
        draft: { ne: true }
        category: {
          name: {
            in: ["Kampçılık", "Ekipmanlar", "Rotalar", "Doğa Yürüyüşleri"]
          }
        }
      }
      sort: { date: DESC }
    ) {
      nodes {
        id
        title
        slug
        excerpt
        timeToRead
        date(formatString: "YYYY-MM-DD")
        category {
          name
          slug
        }
        tags {
          name
        }
        ...ArticleThumbnailCard
      }
    }
    latestArticles: allArticle(
      filter: {
        private: { ne: true }
        draft: { ne: true }
        category: { slug: { eq: $slug } }
      }
      sort: { date: DESC }
      limit: 4
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailCard
      }
    }
  }
`
