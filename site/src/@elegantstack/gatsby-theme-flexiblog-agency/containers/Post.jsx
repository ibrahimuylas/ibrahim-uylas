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
import ArticleReactions from '../../../components/ArticleReactions'
import DeferredComments from '../../../components/DeferredComments'
import LikyaGuidePage from '../../../components/LikyaGuidePage'
import LikyaStagePage from '../../../components/LikyaStagePage'
import {
  isLikyaGuideShellEnabled,
  isLikyaStageGuideEnabled
} from '../../../components/likyaGuideShellPolicy'
import { trackEvent } from '../../../utils/analytics'
import categoryGuideLinks from '../../../content-guides/categoryGuideLinks'
import guideMeta from '../../../content-guides/likya/guide-meta'
import { stageGuideByArticleSlug } from '../../../content-guides/likya/stage-guides'
import { copy, localizeArticle, localizePreview } from '../../../i18n/copy'
import { fallbackLinkTitle, getLocalizedLink } from '../../../i18n/language'
import LocaleLink from '../../../i18n/LocaleLink'
// import AuthorExpanded from '@widgets/AuthorExpanded'
import { PostHead, PostImage, PostBody, PostTagsShare } from '@widgets/Post'

const EnglishArticleLink = ({ href, ...props }) =>
  href?.startsWith('/') && !href.startsWith('//') ? (
    <LocaleLink to={href} language='en' {...props} />
  ) : (
    <a href={href} {...props} />
  )

const englishMdx = { a: EnglishArticleLink }

const Post = ({
  data: {
    post: sourcePost,
    translation,
    tagCategoryPosts,
    tagPosts,
    categoryPosts
  },
  ...props
}) => {
  const relatedPosts = [
    ...(tagCategoryPosts ? tagCategoryPosts.nodes : []),
    ...(tagPosts ? tagPosts.nodes : []),
    ...(categoryPosts ? categoryPosts.nodes : [])
  ]
  const { pageContext: { services = {}, siteUrl, previews } = {} } = props
  const language = translation ? 'en' : 'tr'
  const labels = copy[language]
  const post = localizeArticle(sourcePost, translation)
  const categoryGuide = categoryGuideLinks[sourcePost.category?.name]
  const guideCopy = categoryGuide?.[language] || categoryGuide
  const guideLink = getLocalizedLink(categoryGuide?.path, language)
  const isLikyaPreview = process.env.GATSBY_LIKYA_GUIDE_PREVIEW === 'true'

  if (
    !translation &&
    isLikyaGuideShellEnabled({
      path: props.location?.pathname,
      slug: post.slug,
      guideMeta,
      preview: isLikyaPreview
    })
  ) {
    return (
      <LikyaGuidePage
        {...props}
        post={post}
        location={props.location}
        services={services}
        siteUrl={siteUrl}
        relatedPosts={relatedPosts}
      />
    )
  }

  if (
    !translation &&
    isLikyaStageGuideEnabled({
      slug: post.slug,
      stageGuideByArticleSlug,
      guideMeta,
      preview: isLikyaPreview
    })
  ) {
    return (
      <LikyaStagePage
        {...props}
        post={post}
        location={props.location}
        services={services}
        siteUrl={siteUrl}
        relatedPosts={relatedPosts}
      />
    )
  }

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
            <PostImage
              {...post}
              title={post.thumbnailText || post.title}
              inCardLarge
            />
            <div
              {...(post.private === true ? {} : { 'data-pagefind-body': '' })}
            >
              <PostHead {...post} language={language} />
              <Divider line />
              <div data-pagefind-ignore='all'>
                <ArticleContents items={post.tableOfContents?.items} />
              </div>
              <PostBody
                {...post}
                mdxComponents={translation ? englishMdx : undefined}
              />
            </div>
            <PostTagsShare
              {...post}
              location={props.location}
              language={language}
            />
            {services.reactions?.enabled && (
              <ArticleReactions {...post} language={language} />
            )}
            {services.comments?.enabled && (
              <DeferredComments
                {...post}
                siteUrl={siteUrl}
                comments={services.comments}
                language={language}
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
                  {guideCopy.title}
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
                  {guideCopy.description}
                </Text>
              </Box>
              <Button
                {...(guideLink.fallbackLanguage
                  ? {
                      as: 'a',
                      href: guideLink.href,
                      hrefLang: guideLink.fallbackLanguage,
                      title: fallbackLinkTitle[guideLink.fallbackLanguage]
                    }
                  : { as: Link, to: guideLink.href })}
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
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                      color: `white`,
                      bg: `alphaDark`,
                      transform: `translateY(-1px)`
                    }
                  },
                  '&:focus-visible': {
                    outline: `3px solid`,
                    outlineColor: `alphaLight`,
                    outlineOffset: 2
                  }
                }}
              >
                {labels.openGuide} <FaArrowRight size={13} aria-hidden='true' />
              </Button>
            </Box>
          )}
          <Divider />
          {/* <AuthorExpanded author={post.author} /> */}
          <Divider />
          {post.category && (
            <CardList
              title={labels.relatedPosts}
              nodes={relatedPosts.map(post => localizePreview(post, previews))}
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
              <NewsletterExpanded language={language} />
            </>
          )}
        </Main>
      </Stack>
    </Layout>
  )
}

export default Post
