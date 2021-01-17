import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Card from '@components/Card'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import { PostImage, PostBody, PostComments, PostTagsShare } from '@widgets/Post'

const Post = ({
  data: { post, tagCategoryPosts, tagPosts, categoryPosts, previous, next },
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
          <Card {...post} variant='horizontal-hero' omitExcerpt omitMedia />
        </Main>
      </Stack>
      <Divider space={3} />
      <Stack effectProps={{ fraction: 0 }}>
        <Main>
          <CardComponent variant='paper-lg'>
            <PostImage {...post} inCard />
            <PostBody {...post} />
            <PostTagsShare {...post} location={location} />
            {services.disqus && <PostComments {...post} />}
          </CardComponent>
          <Divider />
          {post.category && (
            <CardList
              title='Related Posts'
              nodes={relatedPosts}
              variant={['horizontal-aside']}
              columns={[1, 2, 2, 2]}
              limit={6}
              distinct
              omitMedia
              omitCategory
            />
          )}
        </Main>
      </Stack>
    </>
  )
}

export default Post
