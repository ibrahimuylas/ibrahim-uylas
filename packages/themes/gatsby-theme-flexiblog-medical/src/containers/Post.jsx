import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import AuthorExpanded from '@widgets/AuthorExpanded'
import {
  PostHead,
  PostImage,
  PostBody,
  PostComments,
  PostTagsShare
} from '@widgets/Post'

const Post = ({
  data: { post, tagCategoryPosts, tagPosts, categoryPosts, previous, next },
  location,
  ...props
}) => {
  const relatedPosts = [
    ...(tagCategoryPosts ? tagCategoryPosts.nodes : []),
    ...(tagPosts ? tagPosts.nodes : []),
    ...(categoryPosts ? categoryPosts.nodes : [])
  ]
  const { pageContext: { services = {}, siteUrl } = {} } = props

  return (
    <>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider space={3} />
      <Stack>
        <Main>
          <CardComponent variant='paper-lg'>
            <PostImage {...post} inCard />
            <PostHead {...post} />
            <Divider line />
            <PostBody {...post} />
            <PostTagsShare {...post} location={location} />
            {services.disqus && <PostComments {...post} />}
          </CardComponent>
          <Divider />
          <AuthorExpanded author={post.author} />
          <Divider />
          {post.category && (
            <CardList
              title='Related Posts'
              nodes={relatedPosts}
              variant={['horizontal-md']}
              columns={[1, 2, 2, 2]}
              limit={6}
              distinct
            />
          )}
        </Main>
      </Stack>
    </>
  )
}

export default Post
