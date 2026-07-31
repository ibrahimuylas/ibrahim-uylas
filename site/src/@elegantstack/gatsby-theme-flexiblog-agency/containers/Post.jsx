import React from 'react'
import { Card as CardComponent } from 'theme-ui'
import { Layout, Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import ArticleContents from '../../../components/ArticleContents'
import DeferredComments from '../../../components/DeferredComments'
import { trackEvent } from '../../../utils/analytics'
// import AuthorExpanded from '@widgets/AuthorExpanded'
import { PostHead, PostImage, PostBody, PostTagsShare } from '@widgets/Post'

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
            <div
              {...(post.private === true ? {} : { 'data-pagefind-body': '' })}
            >
              <PostHead {...post} />
              <Divider line />
              <div data-pagefind-ignore='all'>
                <ArticleContents items={post.tableOfContents?.items} />
              </div>
              <PostBody {...post} />
            </div>
            <PostTagsShare {...post} location={props.location} />
            {services.giscus?.repoId && services.giscus?.categoryId && (
              <DeferredComments
                {...post}
                siteUrl={siteUrl}
                giscus={services.giscus}
              />
            )}
          </CardComponent>
          <Divider />
          {/* <AuthorExpanded author={post.author} /> */}
          <Divider />
          {post.category && (
            <CardList
              title='İlgili Yazılar'
              nodes={relatedPosts}
              variant={['horizontal-md']}
              columns={[1, 2, 2, 2]}
              limit={6}
              distinct
              onTitleClick={handleRelatedPostClick}
            />
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
