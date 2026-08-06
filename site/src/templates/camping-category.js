import React from 'react'
import { graphql } from 'gatsby'
import { Layout, Main, Stack } from '@layout'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import GuideCategory, { getAllCuratedSlugs } from '../components/CampingGuide'
import categoryGuidePolicy from '../components/categoryGuidePolicy'
import campingGuide from '../content-guides/campingGuide'
import equipmentGuide from '../content-guides/equipmentGuide'
import hikingGuide from '../content-guides/hikingGuide'
import otherGuide from '../content-guides/otherGuide'
import routeGuide from '../content-guides/routeGuide'

const guides = {
  kampcilik: campingGuide,
  'doga-yuruyusleri': hikingGuide,
  rotalar: routeGuide,
  ekipmanlar: equipmentGuide,
  diger: otherGuide
}

const CampingCategoryPage = ({
  data: { hubArticles, latestArticles },
  pageContext,
  ...props
}) => {
  const guide = guides[pageContext.guideId] || campingGuide
  const siteUrl = (pageContext.siteUrl || '').replace(/\/$/, '')
  const guideArticles = categoryGuidePolicy.selectGuideArticles({
    articles: hubArticles.nodes,
    curatedSlugs: getAllCuratedSlugs(guide),
    primaryCategory: guide.primaryCategory,
    categories: guide.hubCategories,
    tagNames: guide.tagNames
  })
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: guide.title,
    description: guide.description,
    url: `${siteUrl}${guide.path}`,
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
        title={guide.title}
        description={guide.description}
        siteUrl={siteUrl}
      >
        <script type='application/ld+json'>
          {JSON.stringify(collectionPageSchema)}
        </script>
      </Seo>
      <Divider />
      <Stack effectProps={{ effect: false }}>
        <Main>
          <GuideCategory
            articles={hubArticles.nodes}
            latestArticles={latestArticles.nodes}
            guide={guide}
            policy={categoryGuidePolicy}
          />
        </Main>
      </Stack>
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
            in: [
              "Kampçılık"
              "Ekipmanlar"
              "Rotalar"
              "Doğa Yürüyüşleri"
              "Diğer"
            ]
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
        ...ArticleThumbnailNatural
      }
    }
    latestArticles: allArticle(
      filter: {
        private: { ne: true }
        draft: { ne: true }
        category: { slug: { eq: $slug } }
      }
      sort: { date: DESC }
      limit: 3
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailCard
        ...ArticleThumbnailNatural
      }
    }
  }
`
