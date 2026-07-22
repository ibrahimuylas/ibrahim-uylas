import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Layout, Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import ArticleContents from '../../../components/ArticleContents'
import { trackEvent } from '../../../utils/analytics'
// import AuthorExpanded from '@widgets/AuthorExpanded'
import {
  PostHead,
  PostImage,
  PostBody,
  PostComments,
  PostTagsShare
} from '@widgets/Post'

const Post = ({
  data: { post, tagCategoryPosts, tagPosts, categoryPosts, previous, next },
  ...props
}) => {
  const relatedPosts = [
    ...(tagCategoryPosts ? tagCategoryPosts.nodes : []),
    ...(tagPosts ? tagPosts.nodes : []),
    ...(categoryPosts ? categoryPosts.nodes : [])
  ]
  const { pageContext: { services = {}, siteUrl } = {} } = props

  const handleRelatedPostClick = event => {
    const link = event.target.closest && event.target.closest('a')

    if (!link) return

    trackEvent('related_article_click', {
      link_url: link.pathname,
      source_path: props.location.pathname
    })
  }

  return (
    <Layout {...props}>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider space={3} />
      <Stack>
        <Main>
          <CardComponent variant='paper-lg'>
            <PostImage {...post} inCardLarge />
            <PostHead {...post} />
            <Divider line />
            <ArticleContents items={post.tableOfContents?.items} />
            <PostBody {...post} />
            <PostTagsShare {...post} location={props.location} />
            {services.disqus && <PostComments {...post} siteUrl={siteUrl} />}
          </CardComponent>
          <Divider />
          {/* <AuthorExpanded author={post.author} /> */}
          <Divider />
          {post.category && (
            <div onClick={handleRelatedPostClick}>
              <CardList
                title='İlgili Yazılar'
                nodes={relatedPosts}
                variant={['horizontal-md']}
                columns={[1, 2, 2, 2]}
                limit={6}
                distinct
              />
            </div>
          )}
        </Main>
      </Stack>
      <Stack>
        <Main>
          {services.mailchimp && (
            <>
              <Divider space={5} />
              <NewsletterExpanded />
            </>
          )}
        </Main>
      </Stack>
    </Layout>
  )
}

export default Post
