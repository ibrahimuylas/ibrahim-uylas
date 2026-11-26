import React from 'react'
import { graphql } from 'gatsby'
import { Layout, Main, PreFooter, Stack } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import PageTitle from '@components/PageTitle'
import Pagination from '@components/Pagination'
import Seo from '@widgets/Seo'
import { localizePreview } from '../i18n/copy'

export default function EnglishCollection({ data, pageContext, ...props }) {
  const { title, description, previews, pagination, totalCount, kind } =
    pageContext

  return (
    <Layout pageContext={pageContext} {...props}>
      <Seo title={title} description={description} />
      <Divider />
      <Stack>
        <PageTitle
          header={title}
          running={description}
          totalCount={totalCount}
        />
      </Stack>
      <Stack>
        <Main>
          <CardList
            nodes={data.posts.nodes.map(post =>
              localizePreview(post, previews)
            )}
            variant={['horizontal-md', 'vertical']}
            columns={[1, 2, 3, 3]}
            omitCategory={kind === 'category'}
          />
        </Main>
      </Stack>
      <PreFooter>
        <Pagination {...pagination} />
      </PreFooter>
    </Layout>
  )
}

export const pageQuery = graphql`
  query EnglishCollectionQuery(
    $articleIds: [String!]!
    $includeExcerpt: Boolean!
    $includeTimeToRead: Boolean!
    $imageQuality: Int!
  ) {
    posts: allArticle(
      filter: { id: { in: $articleIds } }
      sort: { date: DESC }
    ) {
      nodes {
        ...ArticlePreview
        ...ArticleThumbnailCard
      }
    }
  }
`
