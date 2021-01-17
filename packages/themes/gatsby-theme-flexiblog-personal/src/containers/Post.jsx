import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Stack, Main, Sidebar } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Sticky from '@components/Sticky'
import Seo from '@widgets/Seo'
import AuthorCompact from '@widgets/AuthorCompact'
import Categories from '@widgets/Categories'
import {
  PostHead,
  PostImage,
  PostBody,
  PostComments,
  PostTagsShare,
  PostFooter,
} from '@widgets/Post'
import { useBlogCategories } from '@helpers-blog'

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
  const categories = useBlogCategories()

  return (
    <>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider />
      <Stack effectProps={{ effect: 'fadeInDown' }}>
        <PostHead {...post} />
      </Stack>
      <Divider />
      <Stack effectProps={{ fraction: 0 }}>
        <Main>
          <CardComponent variant='paper'>
            <PostImage {...post} inCard />
            <PostBody {...post} />
            <PostTagsShare {...post} location={location} />
            {services.disqus && <PostComments {...post} />}
            <PostFooter {...{ previous, next }} />
          </CardComponent>
        </Main>
        <Sidebar>
          <AuthorCompact author={post.author} omitTitle />
          <Divider />
          <Categories categories={categories} />
          <Divider />
          {post.category && (
            <Sticky>
              <CardList
                title='Related Posts'
                nodes={relatedPosts}
                variant='horizontal-aside'
                omitMedia
                omitCategory
                limit={6}
                distinct
                aside
              />
            </Sticky>
          )}
        </Sidebar>
      </Stack>
    </>
  )
}

export default Post
