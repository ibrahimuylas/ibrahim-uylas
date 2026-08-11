import React from 'react'
import { Link } from 'gatsby'
import { Box, Button, Card as CardComponent, Heading, Text } from 'theme-ui'
import { FaArrowRight } from 'react-icons/fa'
import { Layout, Stack, Main } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import ArticleContents from '../../../components/ArticleContents'
import DeferredComments from '../../../components/DeferredComments'
import { trackEvent } from '../../../utils/analytics'
import categoryGuideLinks from '../../../content-guides/categoryGuideLinks'
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
  const categoryGuide = post.category
    ? categoryGuideLinks[post.category.name]
    : null

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
            {(services.comments?.enabled ||
              (services.giscus?.repoId && services.giscus?.categoryId)) && (
              <DeferredComments
                {...post}
                siteUrl={siteUrl}
                giscus={services.giscus}
                comments={services.comments}
              />
            )}
          </CardComponent>
          {categoryGuide && (
            <Box
              as='aside'
              aria-labelledby='category-guide-title'
              sx={{
                mt: 4,
                display: `grid`,
                gridTemplateColumns: [`1fr`, `minmax(0, 1fr) auto`],
                alignItems: `center`,
                gap: [3, 4],
                p: [3, 4],
                bg: `contentBg`,
                border: `1px solid`,
                borderLeft: `4px solid`,
                borderColor: `omegaLight`,
                borderLeftColor: `alpha`,
                borderRadius: `lg`,
                boxShadow: theme =>
                  `0 18px 50px -42px ${theme.colors.omegaDarker}`
              }}
            >
              <Box>
                <Heading
                  id='category-guide-title'
                  as='h2'
                  sx={{
                    color: `heading`,
                    fontFamily: `'DM Serif Display', Georgia, serif`,
                    fontSize: [3, 4],
                    fontWeight: 400,
                    lineHeight: 1.15,
                    m: 0
                  }}
                >
                  {categoryGuide.title}
                </Heading>
                <Text
                  as='p'
                  sx={{
                    color: `article`,
                    fontSize: [1, 2],
                    lineHeight: 1.65,
                    mt: 2,
                    mb: 0,
                    maxWidth: `38rem`
                  }}
                >
                  {categoryGuide.description}
                </Text>
              </Box>
              <Button
                as={Link}
                to={categoryGuide.path}
                sx={{
                  display: `inline-flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  justifySelf: [`start`, `end`],
                  gap: 2,
                  minHeight: 44,
                  px: 3,
                  py: 2,
                  color: `white`,
                  bg: `alpha`,
                  borderRadius: `full`,
                  fontSize: 1,
                  fontWeight: `bold`,
                  lineHeight: 1.2,
                  textDecoration: `none`,
                  whiteSpace: `nowrap`,
                  transition: `background-color 160ms ease, transform 160ms ease`,
                  '&:hover': {
                    color: `white`,
                    bg: `alphaDark`,
                    transform: `translateY(-1px)`
                  },
                  '&:focus-visible': {
                    outline: `3px solid`,
                    outlineColor: `alphaLight`,
                    outlineOffset: 2
                  }
                }}
              >
                Ana rehbere git <FaArrowRight size={13} aria-hidden='true' />
              </Button>
            </Box>
          )}
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
