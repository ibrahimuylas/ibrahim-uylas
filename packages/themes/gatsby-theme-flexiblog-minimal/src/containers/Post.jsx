import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Card from '@components/Card'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import AuthorExpanded from '@widgets/AuthorExpanded'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import { PostBody, PostComments, PostTagsShare } from '@widgets/Post'

const Post = ({
  data: { post, tagCategoryPosts, tagPosts, categoryPosts },
  location,
  ...props
}) => {
  const relatedPosts = [
    ...(tagCategoryPosts ? tagCategoryPosts.nodes : []),
    ...(tagPosts ? tagPosts.nodes : []),
    ...(categoryPosts ? categoryPosts.nodes : []),
  ]
  const { pageContext: { services = {}, siteUrl } = {} } = props

  return (
    <>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider />
      <Stack effectProps={{ effect: 'fadeInDown' }}>
        <Main>
          <Card {...post} variant='horizontal-hero' omitExcerpt />
        </Main>
      </Stack>
      <Divider />
      <Stack effectProps={{ fraction: 0 }}>
        <Main>
          <CardComponent variant='paper-lg'>
            <PostBody {...post} />
            <PostTagsShare {...post} location={location} />
          </CardComponent>
          <Divider />
          <AuthorExpanded author={post.author} />
          {services.disqus && (
            <>
              <Divider />
              <PostComments {...post} />
            </>
          )}
          <Divider />
          {post.category && (
            <CardList
              nodes={relatedPosts}
              variant={['horizontal-md']}
              columns={[1, 2, 3, 3]}
              limit={6}
              title='Related Posts'
              distinct
            />
          )}
          {services.mailchimp && (
            <>
              <Divider />
              <NewsletterExpanded simple />
            </>
          )}
        </Main>
      </Stack>
    </>
  )
}

export default Post
