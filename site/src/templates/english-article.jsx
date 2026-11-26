import React from 'react'
import { graphql } from 'gatsby'
import { Card } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import {
  MdxContentProvider,
  PostBody,
  PostHead,
  PostImage
} from '@widgets/Post'
import { categoryName } from '../i18n/copy'

export default function EnglishArticle({
  data: { source, translation },
  children,
  ...props
}) {
  const { frontmatter, timeToRead } = translation
  const category = source.category && {
    ...source.category,
    name: categoryName(source.category, 'en')
  }
  const post = { ...source, ...frontmatter, category, timeToRead }

  return (
    <Layout {...props}>
      <Seo {...post} />
      <Divider space={3} />
      <Stack>
        <Main>
          <Card variant='paper-lg'>
            <PostImage {...post} inCardLarge />
            <div data-pagefind-body=''>
              <PostHead {...post} language='en' />
              <Divider line />
              <MdxContentProvider value={children}>
                <PostBody />
              </MdxContentProvider>
            </div>
          </Card>
        </Main>
      </Stack>
    </Layout>
  )
}

export const query = graphql`
  query EnglishArticle($articleId: String!, $translationId: String!) {
    source: article(id: { eq: $articleId }) {
      date(formatString: "D MMMM YYYY", locale: "en")
      modified(formatString: "D MMMM YYYY", locale: "en")
      datePublished: date(formatString: "YYYY-MM-DD")
      dateModified: modified(formatString: "YYYY-MM-DD")
      category {
        name
        slug
      }
      author {
        name
        slug
      }
      thumbnail {
        __typename
        ... on ImageSharp {
          ImageSharp_hero: gatsbyImageData(
            width: 1600
            outputPixelDensities: [0.5, 1]
            quality: 75
          )
        }
      }
    }
    translation: mdx(id: { eq: $translationId }) {
      frontmatter {
        title
        description
      }
      timeToRead
    }
  }
`
