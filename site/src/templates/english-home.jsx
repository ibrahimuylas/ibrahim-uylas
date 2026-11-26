import React from 'react'
import { graphql } from 'gatsby'
import { Box, Heading, Text } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import HomepageCategories from '../components/HomepageCategories'
import InstagramShowcase from '../components/InstagramShowcase'
import guideLinks from '../content-guides/categoryGuideLinks'
import { categoryName, copy, localizePreview } from '../i18n/copy'
import { getLocalizedLink } from '../i18n/language'
import { useBlogCategories } from '@helpers-blog'

export default function EnglishHome({ data, pageContext, ...props }) {
  const title = 'Camping, Hiking and Route Guides'
  const categories = useBlogCategories()
    .filter(category => guideLinks[category.name])
    .map(category => ({
      ...category,
      name: categoryName(category, 'en'),
      slug: getLocalizedLink(category.slug, 'en').href,
      description: guideLinks[category.name].en.description
    }))
  const posts = data.posts.nodes.map(post =>
    localizePreview(post, pageContext.previews)
  )

  return (
    <Layout pageContext={pageContext} {...props}>
      <Seo title={title} description={copy.en.description} />
      <Divider space={[3, 2]} />
      <Stack effectProps={{ effect: false }}>
        <Main>
          <Heading as='h1'>{title}</Heading>
          <Text as='p'>{copy.en.description}</Text>
          <Box sx={{ my: [4, 5] }}>
            <Heading as='h2'>Start here</Heading>
            <HomepageCategories
              categories={categories}
              variant='horizontal'
              omitTitle
            />
          </Box>
          <CardList
            title='Latest articles'
            nodes={posts}
            variant={['horizontal-md', 'vertical']}
            columns={[1, 2, 3, 3]}
          />
        </Main>
      </Stack>
      <Divider space={[4, 5]} />
      <Stack effectProps={{ effect: false }}>
        <InstagramShowcase
          language='en'
          showNewsletter={pageContext.services?.mailchimp}
        />
      </Stack>
    </Layout>
  )
}

export const pageQuery = graphql`
  query EnglishHomeQuery(
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
