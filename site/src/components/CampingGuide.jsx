import React, { useEffect, useMemo, useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { GatsbyImage as Img, StaticImage } from 'gatsby-plugin-image'
import { FaChevronDown, FaRegClock, FaSearch } from 'react-icons/fa'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Label,
  Link,
  Text
} from 'theme-ui'
import CardList from '@components/CardList'
import getImageVariant from '@components/utils/getImageVariant'
import defaultGuide from '../content-guides/campingGuide'
import { currentPagePath, trackEvent } from '../utils/analytics'
import ArticleContents from './ArticleContents'
import defaultPolicy from './categoryGuidePolicy'

const focusStyle = {
  '&:focus-visible': {
    outline: `3px solid`,
    outlineColor: `alpha`,
    outlineOffset: 3
  }
}

const surfaceStyle = {
  bg: `contentBg`,
  border: `1px solid`,
  borderColor: `omegaLight`,
  borderRadius: `16px`,
  boxShadow: `0 14px 40px rgba(31, 41, 55, 0.06)`
}

const headingStyle = {
  color: `heading`,
  fontFamily: `'DM Serif Display', Georgia, serif`,
  fontWeight: 400,
  letterSpacing: `-0.02em`
}

const heroAccent = `#1552d6`

const getAllCuratedSlugs = guide => [
  ...guide.readingPath.map(item => item.slug).filter(Boolean),
  ...guide.sections.flatMap(section =>
    section.items ? section.items.map(item => item.slug) : section.slugs
  )
]

const getGuideTopicLinks = guide => [
  { id: 'baslangic', label: guide.beginner.navLabel },
  ...(guide.research
    ? [{ id: guide.research.id, label: guide.research.navLabel }]
    : []),
  ...guide.sections.map(section => ({
    id: section.id,
    label: section.title
  }))
]

const getGuideContentsItems = guide => [
  ...getGuideTopicLinks(guide).map(item => ({
    title: item.label,
    url: `#${item.id}`
  })),
  { title: 'Yeni eklenenler', url: '#yeni-eklenenler' },
  { title: 'Tüm içerikler', url: '#tum-icerikler' }
]

const displayDate = value => {
  if (!value) return ''

  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`))
}

const ArticleMeta = ({ article }) => (
  <Flex
    sx={{
      alignItems: `center`,
      flexWrap: `wrap`,
      gap: 2,
      color: `omegaDark`,
      fontSize: 1,
      mt: 2
    }}
  >
    {article.category?.name && <Text as='span'>{article.category.name}</Text>}
    {article.timeToRead && (
      <>
        <Text as='span' aria-hidden='true'>
          •
        </Text>
        <Text as='span'>{article.timeToRead} dk</Text>
      </>
    )}
    {article.date && (
      <>
        <Text as='span' aria-hidden='true'>
          •
        </Text>
        <Text as='span'>{displayDate(article.date)}</Text>
      </>
    )}
  </Flex>
)

const ArticleLinkCard = ({
  article,
  context,
  desktopImageOnly = false,
  editorial = false,
  featured,
  onActivate,
  summary,
  step,
  withImage
}) => {
  const image = withImage ? getImageVariant(article.thumbnail, 'natural') : null
  const imageAspectRatio =
    image && image.width && image.height
      ? `${image.width} / ${image.height}`
      : null

  return (
    <Box
      as='li'
      sx={{
        ...surfaceStyle,
        position: `relative`,
        minWidth: 0,
        height: `100%`,
        display: editorial ? `flex` : `block`,
        flexDirection: editorial ? `column` : `initial`,
        overflow: `hidden`,
        borderRadius: editorial ? `12px` : surfaceStyle.borderRadius,
        transition: `transform 180ms ease, border-color 180ms ease`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: `alpha`,
            transform: `translateY(-2px)`
          }
        }
      }}
    >
      {(image || editorial) && (
        <Box
          data-guide-thumbnail
          aria-hidden='true'
          sx={{
            display: desktopImageOnly
              ? [`none`, `none`, `none`, `block`]
              : `block`,
            width: `100%`,
            ...(imageAspectRatio
              ? { aspectRatio: imageAspectRatio }
              : { height: editorial ? [190, 200, 210] : [160, 180] }),
            overflow: `hidden`,
            bg: `omegaLighter`,
            pointerEvents: `none`,
            '& .gatsby-image-wrapper': {
              width: `100%`,
              height: `100%`
            }
          }}
        >
          {image && (
            <Img
              image={image}
              alt=''
              loading='lazy'
              style={{ width: `100%`, height: `100%` }}
              imgStyle={{ objectFit: `cover` }}
            />
          )}
        </Box>
      )}
      <Flex
        sx={{
          alignItems: `flex-start`,
          gap: 3,
          flex: editorial ? 1 : `initial`,
          minHeight: editorial ? [0, 230] : 0,
          p: editorial ? [3, 4] : [3, 4]
        }}
      >
        {step && (
          <Flex
            aria-hidden='true'
            sx={{
              alignItems: `center`,
              justifyContent: `center`,
              flex: `0 0 auto`,
              width: 40,
              height: 40,
              bg: `alpha`,
              color: `white`,
              borderRadius: `50%`,
              fontWeight: `bold`
            }}
          >
            {step}
          </Flex>
        )}
        <Grid
          sx={{
            flex: 1,
            minWidth: 0,
            height: editorial ? [`auto`, `100%`] : `auto`,
            gridTemplateColumns: `minmax(0, 1fr)`,
            gridTemplateRows: editorial
              ? [`auto auto`, `auto 1fr auto`]
              : `auto auto`,
            alignItems: `start`
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {editorial && (
              <Flex
                sx={{
                  display: [`none`, `flex`],
                  alignItems: `center`,
                  flexWrap: `wrap`,
                  gap: 2,
                  color: `omegaDark`,
                  fontSize: 0,
                  mb: 2
                }}
              >
                {article.category?.name && (
                  <Text
                    as='span'
                    sx={{
                      color: `alphaDark`,
                      fontWeight: `bold`,
                      letterSpacing: `0.04em`,
                      textTransform: `uppercase`
                    }}
                  >
                    {article.category.name}
                  </Text>
                )}
                {article.timeToRead && (
                  <>
                    <Text as='span' aria-hidden='true'>
                      •
                    </Text>
                    <Text as='span'>{article.timeToRead} dk</Text>
                  </>
                )}
              </Flex>
            )}
            {featured && (
              <Text
                as='span'
                sx={{
                  display: `inline-block`,
                  bg: `alphaLighter`,
                  color: `alphaDarker`,
                  borderRadius: `999px`,
                  fontSize: 0,
                  fontWeight: `bold`,
                  px: 2,
                  py: 1,
                  mb: 2
                }}
              >
                Öne çıkan
              </Text>
            )}
            <Heading
              as='h3'
              sx={{
                color: editorial ? [`alphaDark`, `heading`] : `heading`,
                fontFamily: editorial
                  ? `'DM Serif Display', Georgia, serif`
                  : `inherit`,
                fontWeight: editorial ? 400 : `bold`,
                fontSize: [3, 4],
                lineHeight: 1.25,
                m: 0
              }}
            >
              <Link
                as={GatsbyLink}
                to={article.slug}
                onClick={onActivate}
                sx={{
                  color: `inherit`,
                  textDecoration: `none`,
                  '&:visited': {
                    color: `inherit`
                  },
                  '&::after': {
                    content: `""`,
                    position: `absolute`,
                    inset: 0
                  },
                  ...focusStyle
                }}
              >
                {article.title}
              </Link>
            </Heading>
            {context && (
              <Text
                as='p'
                sx={{
                  color: `alphaDark`,
                  fontSize: 1,
                  fontWeight: `bold`,
                  mt: 2,
                  mb: 0
                }}
              >
                {context}
              </Text>
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Text
              as='p'
              sx={{
                color: `text`,
                fontSize: [1, 2],
                lineHeight: editorial ? 1.5 : 1.6,
                display: editorial ? `-webkit-box` : `block`,
                WebkitBoxOrient: editorial ? `vertical` : `initial`,
                WebkitLineClamp: editorial ? 2 : `initial`,
                overflow: editorial ? `hidden` : `visible`,
                mt: 2,
                mb: 0
              }}
            >
              {summary || article.excerpt}
            </Text>
            {!editorial && <ArticleMeta article={article} />}
          </Box>
          {editorial && (
            <>
              <Text
                as='span'
                sx={{
                  display: [`none`, `block`],
                  alignSelf: `end`,
                  color: `omegaDark`,
                  borderTop: `1px solid`,
                  borderColor: `omegaLight`,
                  fontSize: 0,
                  mt: 3,
                  pt: 3
                }}
              >
                {displayDate(article.date)}
              </Text>
              <Box sx={{ display: [`block`, `none`] }}>
                <ArticleMeta article={article} />
              </Box>
            </>
          )}
        </Grid>
      </Flex>
    </Box>
  )
}

const RouteArticleCard = ({ item, policy, trackLink }) => {
  const { article } = item
  const image = getImageVariant(article.thumbnail, 'natural')

  return (
    <Box
      as='li'
      sx={{
        ...surfaceStyle,
        minWidth: 0,
        overflow: `hidden`,
        transition: `transform 180ms ease, border-color 180ms ease`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: `alpha`,
            transform: `translateY(-2px)`
          }
        }
      }}
    >
      {image && (
        <Box
          aria-hidden='true'
          sx={{
            aspectRatio:
              image.width && image.height
                ? `${image.width} / ${image.height}`
                : `16 / 9`,
            overflow: `hidden`,
            bg: `omegaLighter`,
            '& .gatsby-image-wrapper': {
              width: `100%`,
              height: `100%`
            }
          }}
        >
          <Img
            image={image}
            alt=''
            loading='lazy'
            style={{ width: `100%`, height: `100%` }}
            imgStyle={{ objectFit: `cover` }}
          />
        </Box>
      )}
      <Box sx={{ p: [3, 4] }}>
        {item.context && (
          <Text
            as='p'
            sx={{
              color: `alphaDark`,
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.04em`,
              m: 0,
              textTransform: `uppercase`
            }}
          >
            {item.context}
          </Text>
        )}
        <Heading
          as='h3'
          sx={{
            color: `heading`,
            fontSize: [3, 4],
            lineHeight: 1.25,
            mt: 2,
            mb: 0
          }}
        >
          <Link
            as={GatsbyLink}
            to={article.slug}
            onClick={trackLink(item.sectionId, article.slug)}
            sx={{ color: `inherit`, ...focusStyle }}
          >
            {article.title}
          </Link>
        </Heading>
        <Text
          as='p'
          sx={{ color: `text`, fontSize: [1, 2], lineHeight: 1.6, mb: 0 }}
        >
          {article.excerpt}
        </Text>
        <ArticleMeta article={article} />
        {item.journalSlug && (
          <Link
            as={GatsbyLink}
            to={policy.articlePath(item.journalSlug)}
            onClick={trackLink(item.sectionId, item.journalSlug)}
            sx={{
              display: `inline-flex`,
              minHeight: 44,
              alignItems: `center`,
              color: `alphaDark`,
              fontWeight: `bold`,
              mt: 2,
              ...focusStyle
            }}
          >
            {item.journalLabel || 'Yürüyüş günlüğünü oku'} →
          </Link>
        )}
      </Box>
    </Box>
  )
}

const RouteResearchSection = ({ guide, research }) => (
  <Box
    as='section'
    id={research.id}
    aria-labelledby={`${research.id}-title`}
    sx={{
      scrollMarginTop: `96px`,
      mt: guide.compactSpacing ? [3, 4] : [4, 5],
      px: [3, 4],
      py: [3, 4],
      bg: `alphaLighter`,
      border: `1px solid`,
      borderColor: `alphaLight`,
      borderRadius: `16px`
    }}
  >
    <Grid
      sx={{
        gridTemplateColumns: [
          `1fr`,
          null,
          null,
          `minmax(220px, 0.75fr) minmax(0, 1.5fr)`
        ],
        gap: [3, 4],
        alignItems: `start`
      }}
    >
      <Box>
        <Text
          as='p'
          sx={{
            color: `alpha`,
            fontSize: 1,
            fontWeight: `bold`,
            letterSpacing: `0.08em`,
            textTransform: `uppercase`,
            mb: 2
          }}
        >
          {research.eyebrow}
        </Text>
        <Heading
          id={`${research.id}-title`}
          as='h2'
          sx={{ ...headingStyle, fontSize: [5, 6], lineHeight: 1.08, m: 0 }}
        >
          {research.title}
        </Heading>
        <Text
          as='p'
          sx={{
            color: `text`,
            fontSize: [1, 2],
            lineHeight: 1.6,
            mt: 2,
            mb: 0
          }}
        >
          {research.description}
        </Text>
      </Box>
      <Grid
        as='ol'
        sx={{
          gridTemplateColumns: [`1fr`, null, `repeat(2, minmax(0, 1fr))`],
          gap: 2,
          listStyle: `none`,
          p: 0,
          m: 0
        }}
      >
        {research.steps.map((step, index) => (
          <Box
            as='li'
            key={step.title}
            sx={{
              ...surfaceStyle,
              height: `100%`,
              bg: `contentBg`,
              p: [3, 4]
            }}
          >
            <Flex
              aria-hidden='true'
              sx={{
                alignItems: `center`,
                justifyContent: `center`,
                width: 36,
                height: 36,
                bg: `alphaLighter`,
                color: `alphaDark`,
                borderRadius: `50%`,
                fontWeight: `bold`,
                mb: 3
              }}
            >
              {index + 1}
            </Flex>
            <Heading
              as='h3'
              sx={{
                color: `heading`,
                fontSize: [3, 4],
                lineHeight: 1.25,
                m: 0
              }}
            >
              {step.title}
            </Heading>
            <Text
              as='p'
              sx={{ color: `text`, fontSize: [1, 2], lineHeight: 1.6, mb: 0 }}
            >
              {step.description}
            </Text>
          </Box>
        ))}
      </Grid>
    </Grid>
  </Box>
)

const RouteSection = ({ guide, section, policy, featuredSlugs, trackLink }) => {
  const featuredArticle = section.featuredArticle
  const compactSpacing = guide.compactSpacing

  return (
    <Box
      as='section'
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      sx={{
        scrollMarginTop: `96px`,
        py: compactSpacing ? [3, 4] : [4, 5],
        borderTop: `1px solid`,
        borderColor: `omegaLight`
      }}
    >
      <Flex
        sx={{
          alignItems: [`flex-start`, `flex-end`],
          flexDirection: [`column`, `row`],
          justifyContent: `space-between`,
          gap: 3,
          mb: compactSpacing ? [3, 4] : [4, 5]
        }}
      >
        <Box sx={{ maxWidth: 760 }}>
          <Heading
            id={`${section.id}-title`}
            as='h2'
            sx={{ ...headingStyle, fontSize: [5, 7], lineHeight: 1.08, m: 0 }}
          >
            {section.title}
          </Heading>
          <Text
            as='p'
            sx={{
              color: `text`,
              fontSize: [2, 3],
              lineHeight: 1.55,
              mt: 2,
              mb: 0
            }}
          >
            {section.description}
          </Text>
        </Box>
      </Flex>

      {featuredArticle && (
        <Box sx={{ mb: compactSpacing ? 3 : 4 }}>
          <ArticleLinkCard
            article={featuredArticle}
            editorial
            featured={featuredSlugs.has(
              policy.articleKey(featuredArticle.slug)
            )}
            withImage
            onActivate={trackLink(section.id, featuredArticle.slug)}
          />
        </Box>
      )}

      {section.links && (
        <Flex
          sx={{
            flexWrap: `wrap`,
            gap: 2,
            mb: compactSpacing ? 3 : 4
          }}
        >
          {section.links.map(link => (
            <Link
              key={link.path}
              as={link.path.startsWith('/') ? GatsbyLink : undefined}
              to={link.path.startsWith('/') ? link.path : undefined}
              href={link.path.startsWith('/') ? undefined : link.path}
              onClick={
                link.path.startsWith('/')
                  ? trackLink(section.id, link.path)
                  : undefined
              }
              sx={{
                display: `inline-flex`,
                alignItems: `center`,
                minHeight: 44,
                color: `alphaDark`,
                fontWeight: `bold`,
                ...focusStyle
              }}
            >
              {link.label} →
            </Link>
          ))}
        </Flex>
      )}

      <Grid
        as='ol'
        sx={{
          gridTemplateColumns: [
            `1fr`,
            null,
            `repeat(2, minmax(0, 1fr))`,
            `repeat(3, minmax(0, 1fr))`
          ],
          gap: compactSpacing ? [2, 3] : [3, 4],
          listStyle: `none`,
          p: 0,
          m: 0
        }}
      >
        {section.items.map(item => (
          <RouteArticleCard
            key={item.article.id}
            item={{ ...item, sectionId: section.id }}
            policy={policy}
            trackLink={trackLink}
          />
        ))}
      </Grid>
    </Box>
  )
}

const EquipmentSection = ({
  guide,
  policy,
  section,
  articles,
  featuredSlugs,
  trackLink
}) => {
  const splitFirstRow =
    guide.editorialLayout === 'split-first-row' && articles.length > 4

  const renderArticleCard = article => (
    <ArticleLinkCard
      key={article.id}
      article={article}
      editorial
      featured={featuredSlugs.has(policy.articleKey(article.slug))}
      withImage={
        !guide.imageExcludedSlugs.includes(policy.articleKey(article.slug))
      }
      onActivate={trackLink(section.id, article.slug)}
    />
  )

  const intro = (
    <Box sx={{ maxWidth: 680 }}>
      <Heading
        id={`${section.id}-title`}
        as='h2'
        sx={{
          ...headingStyle,
          fontSize: [5, 7],
          lineHeight: 1.08,
          m: 0
        }}
      >
        {section.title}
      </Heading>
      <Text
        as='p'
        sx={{
          color: `text`,
          fontSize: [2, 3],
          lineHeight: 1.55,
          mt: 2,
          mb: 0
        }}
      >
        {section.description}
      </Text>
    </Box>
  )

  const moreLink = section.moreLink && (
    <Link
      as={GatsbyLink}
      to={section.moreLink.path}
      onClick={trackLink(section.id, section.moreLink.path)}
      sx={{
        display: `inline-flex`,
        alignItems: `center`,
        minHeight: 44,
        color: `alphaDark`,
        fontWeight: `bold`,
        flexShrink: 0,
        ...(splitFirstRow ? { mt: 3 } : {}),
        '&:visited': {
          color: `alphaDark`
        },
        ...focusStyle
      }}
    >
      {section.moreLink.label} →
    </Link>
  )

  const renderGrid = (items, sx = {}) => (
    <Grid
      as='ul'
      data-equipment-grid
      sx={{
        gridTemplateColumns: [
          `minmax(0, 1fr)`,
          `repeat(2, minmax(0, 1fr))`,
          `repeat(3, minmax(0, 1fr))`
        ],
        gap: [3, 4],
        listStyle: `none`,
        p: 0,
        m: 0,
        ...sx
      }}
    >
      {items.map(renderArticleCard)}
    </Grid>
  )

  return (
    <Box
      as='section'
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      sx={{
        scrollMarginTop: `96px`,
        py: [4, 5],
        ...(guide.compactSpacing ? { py: [3, 4] } : {}),
        borderTop: `1px solid`,
        borderColor: `omegaLight`
      }}
    >
      {splitFirstRow ? (
        <>
          <Grid
            sx={{
              gridTemplateColumns: [
                `1fr`,
                null,
                null,
                `repeat(3, minmax(0, 1fr))`
              ],
              gap: [3, 4],
              alignItems: `start`
            }}
          >
            <Box>
              {intro}
              {moreLink}
            </Box>
            {renderGrid(articles.slice(0, 2), {
              gridColumn: [1, 1, 1, `2 / -1`],
              gridTemplateColumns: [`1fr`, `repeat(2, minmax(0, 1fr))`]
            })}
          </Grid>
          {renderGrid(articles.slice(2), { mt: [3, 4] })}
        </>
      ) : (
        <>
          <Flex
            sx={{
              alignItems: [`flex-start`, `flex-end`],
              flexDirection: [`column`, `row`],
              justifyContent: `space-between`,
              gap: 3,
              mb: [4, 5],
              ...(guide.compactSpacing ? { mb: [3, 4] } : {})
            }}
          >
            {intro}
            {moreLink}
          </Flex>
          {renderGrid(articles)}
        </>
      )}
    </Box>
  )
}

const TopicSection = ({
  guide,
  policy,
  section,
  articles,
  featuredSlugs,
  trackLink
}) =>
  section.layout === 'route' ? (
    <RouteSection
      guide={guide}
      section={section}
      policy={policy}
      featuredSlugs={featuredSlugs}
      trackLink={trackLink}
    />
  ) : section.layout === 'editorial' ? (
    <EquipmentSection
      guide={guide}
      policy={policy}
      section={section}
      articles={articles}
      featuredSlugs={featuredSlugs}
      trackLink={trackLink}
    />
  ) : (
    <Box
      as='section'
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      sx={{
        scrollMarginTop: `96px`,
        py: [3, 4],
        ...(guide.compactSpacing ? { py: [2, 3] } : {}),
        borderTop: `1px solid`,
        borderColor: `omegaLight`
      }}
    >
      <Grid
        sx={{
          gridTemplateColumns: [`1fr`, null, `minmax(220px, 0.7fr) 1.5fr`],
          gap: [3, 4, 5],
          alignItems: `start`
        }}
      >
        <Box>
          <Heading
            id={`${section.id}-title`}
            as='h2'
            sx={{
              ...headingStyle,
              fontSize: [5, 6],
              lineHeight: 1.12,
              m: 0
            }}
          >
            {section.title}
          </Heading>
          <Text
            as='p'
            sx={{ color: `text`, fontSize: [2, 3], lineHeight: 1.6, mb: 0 }}
          >
            {section.description}
          </Text>
          {section.moreLink && (
            <Link
              as={GatsbyLink}
              to={section.moreLink.path}
              onClick={trackLink(section.id, section.moreLink.path)}
              sx={{
                display: `inline-flex`,
                alignItems: `center`,
                minHeight: 44,
                color: `alpha`,
                fontWeight: `bold`,
                mt: 3,
                ...focusStyle
              }}
            >
              {section.moreLink.label} →
            </Link>
          )}
        </Box>
        <Grid
          as='ul'
          sx={{
            gridTemplateColumns: [`1fr`, null, `repeat(2, minmax(0, 1fr))`],
            gap: 3,
            listStyle: `none`,
            p: 0,
            m: 0
          }}
        >
          {articles.map(article => (
            <ArticleLinkCard
              key={article.id}
              article={article}
              featured={featuredSlugs.has(policy.articleKey(article.slug))}
              withImage={
                !guide.imageExcludedSlugs.includes(
                  policy.articleKey(article.slug)
                ) &&
                (guide.imageSectionIds.includes(section.id) ||
                  featuredSlugs.has(policy.articleKey(article.slug)))
              }
              onActivate={trackLink(section.id, article.slug)}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  )

const GuideHeroImage = ({ guide, heroArticle }) =>
  guide.hero.imageType === 'static' ? (
    guide.id === 'rotalar' ? (
      <StaticImage
        src='../../content/assets/rotalar-guide-hero.png'
        alt={guide.hero.imageAlt}
        layout='fullWidth'
        loading='eager'
        placeholder='blurred'
        quality={90}
        formats={['auto', 'webp', 'avif']}
        style={{ width: `100%`, height: `100%` }}
        imgStyle={{ objectFit: `cover`, objectPosition: `center` }}
      />
    ) : guide.id === 'doga-yuruyusleri' ? (
      <StaticImage
        src='../../content/assets/doga-yuruyusleri-guide-hero.png'
        alt={guide.hero.imageAlt}
        layout='fullWidth'
        loading='eager'
        placeholder='blurred'
        quality={90}
        formats={['auto', 'webp', 'avif']}
        style={{ width: `100%`, height: `100%` }}
        imgStyle={{ objectFit: `cover`, objectPosition: `center` }}
      />
    ) : guide.id === 'ekipmanlar' ? (
      <StaticImage
        src='../../content/assets/ekipmanlar-guide-flatlay.webp'
        alt={guide.hero.imageAlt}
        layout='fullWidth'
        loading='eager'
        placeholder='blurred'
        quality={90}
        formats={['auto', 'webp', 'avif']}
        style={{ width: `100%`, height: `100%` }}
        imgStyle={{ objectFit: `cover`, objectPosition: `center` }}
      />
    ) : (
      <StaticImage
        src='../../content/assets/camping-guide-hero.png'
        alt={guide.hero.imageAlt}
        layout='fullWidth'
        loading='eager'
        placeholder='blurred'
        quality={90}
        formats={['auto', 'webp', 'avif']}
        style={{ width: `100%`, height: `100%` }}
        imgStyle={{ objectFit: `cover`, objectPosition: `62% center` }}
      />
    )
  ) : heroArticle ? (
    <Img
      image={getImageVariant(heroArticle.thumbnail, 'natural')}
      alt={guide.hero.imageAlt}
      loading='eager'
      style={{ width: `100%`, height: `100%` }}
      imgStyle={{ objectFit: `cover`, objectPosition: `center` }}
    />
  ) : null

const GuideCategory = ({
  articles = [],
  latestArticles = [],
  guide = defaultGuide,
  policy = defaultPolicy
}) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tümü')
  const [randomRouteSlugs, setRandomRouteSlugs] = useState([])
  const [visibleArticleCount, setVisibleArticleCount] = useState(6)
  const visibleLatestArticles = useMemo(
    () => latestArticles.slice(0, 3),
    [latestArticles]
  )
  const articleLookup = useMemo(
    () =>
      new Map(
        articles.map(article => [policy.articleKey(article.slug), article])
      ),
    [articles]
  )
  const guideArticles = useMemo(
    () =>
      policy.selectGuideArticles({
        articles,
        curatedSlugs: getAllCuratedSlugs(guide),
        primaryCategory: guide.primaryCategory,
        categories: guide.hubCategories,
        tagNames: guide.tagNames
      }),
    [articles, guide, policy]
  )
  const filteredArticles = useMemo(
    () =>
      policy.filterArticles({
        articles: guideArticles,
        query,
        category,
        groupBySlug: guide.articleGroups
      }),
    [category, guide.articleGroups, guideArticles, query]
  )
  const categories = useMemo(
    () =>
      guide.groupFilters?.length
        ? ['Tümü', ...guide.groupFilters.map(item => item.id)]
        : [
            'Tümü',
            ...Array.from(
              new Set(
                guideArticles
                  .map(article => article.category?.name)
                  .filter(Boolean)
              )
            ).sort((a, b) => a.localeCompare(b, 'tr-TR'))
          ],
    [guide, guideArticles]
  )
  const routeSection = guide.sections.find(section => section.randomCategory)
  const fixedRouteSlugs = useMemo(
    () => new Set(routeSection?.slugs || []),
    [routeSection]
  )
  const randomRouteCandidates = useMemo(
    () =>
      articles.filter(
        article =>
          article.category?.name === routeSection?.randomCategory &&
          !fixedRouteSlugs.has(policy.articleKey(article.slug))
      ),
    [articles, fixedRouteSlugs, routeSection]
  )

  useEffect(() => {
    setRandomRouteSlugs(
      policy
        .selectRandomArticles({
          articles: randomRouteCandidates,
          count: routeSection?.randomCount || 0
        })
        .map(article => policy.articleKey(article.slug))
    )
  }, [randomRouteCandidates, routeSection])

  const visibleArticles = filteredArticles.slice(0, visibleArticleCount)
  const featuredSlugs = useMemo(() => new Set(guide.featuredSlugs), [guide])
  const latestArticlePaths = useMemo(
    () => new Set(visibleLatestArticles.map(article => article.slug)),
    [visibleLatestArticles]
  )
  const readingPath = guide.readingPath
    .map(item => ({ ...item, article: articleLookup.get(item.slug) }))
    .filter(item => item.article)
  const topicSections = guide.sections.map(section => {
    const configuredItems = (
      section.items || section.slugs.map(slug => ({ slug }))
    )
      .map(item => ({ ...item, article: articleLookup.get(item.slug) }))
      .filter(item => item.article)
    const configuredArticles = configuredItems.map(item => item.article)

    if (section.id !== routeSection?.id) {
      return {
        ...section,
        articles: configuredArticles,
        items: configuredItems,
        featuredArticle: section.featuredSlug
          ? articleLookup.get(section.featuredSlug)
          : null
      }
    }

    const selectedRandomRoutes = (
      randomRouteSlugs.length
        ? randomRouteSlugs.map(slug => articleLookup.get(slug)).filter(Boolean)
        : randomRouteCandidates.slice(0, section.randomCount)
    ).slice(0, section.randomCount)

    return {
      ...section,
      articles: [...configuredArticles, ...selectedRandomRoutes],
      items: configuredItems,
      featuredArticle: section.featuredSlug
        ? articleLookup.get(section.featuredSlug)
        : null
    }
  })

  const guideTopicLinks = getGuideTopicLinks(guide)
  const guideContentsItems = getGuideContentsItems(guide)
  const contentCount =
    guide.contentCountScope === 'primary'
      ? articles.filter(
          article => article.category?.name === guide.primaryCategory
        ).length
      : guideArticles.length
  const likyaCount = guide.likyaSlugs
    ? guideArticles.filter(article =>
        guide.likyaSlugs.includes(policy.articleKey(article.slug))
      ).length
    : 0
  const statValues = {
    content: contentCount,
    topics: guide.sections.length + 1,
    beginning: readingPath.length,
    likya: likyaCount,
    other: Math.max(0, contentCount - likyaCount)
  }
  const stats = guide.hero.stats || [
    { key: 'content', label: 'İçerik' },
    { key: 'topics', label: 'Konu' },
    { key: 'beginning', label: 'Başlangıç' }
  ]
  const heroArticle = guide.hero.imageSlug
    ? articleLookup.get(guide.hero.imageSlug)
    : null

  const trackLink = (sectionId, linkUrl) =>
    policy.createCategoryHubActivation({
      hub: guide.id,
      sectionId,
      linkUrl:
        linkUrl.startsWith('/') && linkUrl.endsWith('/')
          ? linkUrl
          : policy.articlePath(linkUrl),
      sourcePath: currentPagePath(),
      track: trackEvent
    })

  return (
    <Box>
      <Box
        as='header'
        sx={{
          ...surfaceStyle,
          display: `grid`,
          gridTemplateAreas: [
            `"image" "content"`,
            `"image" "content"`,
            `"content image"`
          ],
          gridTemplateColumns: [
            `minmax(0, 1fr)`,
            `minmax(0, 1fr)`,
            `minmax(0, 58fr) minmax(0, 42fr)`
          ],
          overflow: `hidden`,
          minHeight: [0, 0, 460]
        }}
      >
        <Flex
          sx={{
            gridArea: `content`,
            minWidth: 0,
            flexDirection: `column`,
            justifyContent: `center`,
            px: [`32px`, `48px`, `64px`],
            py: [`40px`, `56px`, `40px`]
          }}
        >
          <Text
            as='p'
            sx={{
              display: [`none`, `none`, `block`],
              order: 1,
              color: heroAccent,
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.12em`,
              textTransform: `uppercase`,
              mt: 0,
              mb: 3
            }}
          >
            {guide.hero.eyebrow}
          </Text>
          <Heading
            as='h1'
            sx={{
              ...headingStyle,
              order: 2,
              fontSize: [`32px`, `48px`, `56px`],
              lineHeight: 1.05,
              m: 0
            }}
          >
            {guide.title}
          </Heading>
          <Text
            as='p'
            sx={{
              order: 3,
              color: `text`,
              fontSize: [2, 3],
              lineHeight: 1.7,
              maxWidth: 650,
              mt: [3, 3, 2],
              mb: 0
            }}
          >
            {guide.description}
          </Text>
          <Flex
            sx={{
              order: [5, 5, 4],
              flexDirection: [`column`, `row`],
              flexWrap: `wrap`,
              gap: 3,
              mt: [4, 4, 3]
            }}
          >
            <Button
              as='a'
              href={guide.hero.ctaHref || '#baslangic'}
              sx={{
                justifyContent: `center`,
                width: [`100%`, `auto`],
                minWidth: [0, 180],
                minHeight: 52,
                display: `inline-flex`,
                alignItems: `center`,
                bg: heroAccent,
                borderRadius: `8px`,
                letterSpacing: `0.04em`,
                '&:hover': {
                  bg: `#0f43b4`
                },
                ...focusStyle
              }}
            >
              {guide.hero.ctaLabel}
            </Button>
            <Button
              as='a'
              href='#tum-icerikler'
              variant='mute'
              sx={{
                justifyContent: `center`,
                width: [`100%`, `auto`],
                minWidth: [0, 180],
                minHeight: 52,
                display: `inline-flex`,
                alignItems: `center`,
                bg: `transparent`,
                color: `heading`,
                border: `1px solid`,
                borderColor: `omega`,
                borderRadius: `8px`,
                letterSpacing: `0.04em`,
                '&:hover': {
                  color: heroAccent,
                  borderColor: heroAccent,
                  bg: `transparent`
                },
                ...focusStyle
              }}
            >
              {guide.hero.secondaryCtaLabel || 'Tüm içeriklerde ara'}
            </Button>
          </Flex>
          <Flex
            aria-label='Rehber özeti'
            sx={{
              order: [4, 4, 5],
              display: `grid`,
              gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
              width: `100%`,
              color: `omegaDark`,
              borderTop: `1px solid`,
              borderBottom: [`1px solid`, `1px solid`, `none`],
              borderColor: `omegaLight`,
              mt: [4, 5, 4],
              pt: [3, 4, 3],
              pb: [3, 0],
              '& > * + *': {
                borderLeft: `1px solid`,
                borderColor: `omegaLight`
              }
            }}
          >
            {stats.map(stat => (
              <Text
                as='span'
                key={stat.key}
                sx={{
                  display: `flex`,
                  flexDirection: `column`,
                  alignItems: `center`,
                  minWidth: 0
                }}
              >
                <Text
                  as='strong'
                  sx={{
                    color: heroAccent,
                    fontFamily: headingStyle.fontFamily,
                    fontSize: [5, 6],
                    fontWeight: 400,
                    lineHeight: 1
                  }}
                >
                  {statValues[stat.key]}
                </Text>
                <Text
                  as='small'
                  sx={{
                    mt: 1,
                    fontSize: 0,
                    fontWeight: `bold`,
                    letterSpacing: `0.08em`,
                    textTransform: `uppercase`
                  }}
                >
                  {stat.label}
                </Text>
              </Text>
            ))}
          </Flex>
        </Flex>
        <Box
          sx={{
            gridArea: `image`,
            minWidth: 0,
            minHeight: [210, 300, 460],
            bg: [`omegaLighter`, `omegaLighter`, `transparent`],
            '& .gatsby-image-wrapper': {
              width: `100%`,
              height: `100%`,
              '@media screen and (min-width: 64em)': {
                WebkitMaskImage: `linear-gradient(to right, transparent 0%, transparent 16%, rgba(0, 0, 0, 0.22) 21%, rgba(0, 0, 0, 0.72) 29%, #000 36%, #000 100%)`,
                maskImage: `linear-gradient(to right, transparent 0%, transparent 16%, rgba(0, 0, 0, 0.22) 21%, rgba(0, 0, 0, 0.72) 29%, #000 36%, #000 100%)`
              }
            }
          }}
        >
          <GuideHeroImage guide={guide} heroArticle={heroArticle} />
        </Box>
      </Box>

      <Box
        as='nav'
        aria-label={`${guide.title} konuları`}
        sx={{ py: guide.compactSpacing ? [2, 3] : [4, 5] }}
      >
        <Flex
          as='ul'
          sx={{ flexWrap: `wrap`, gap: 2, listStyle: `none`, p: 0 }}
        >
          {guideTopicLinks.map(item => (
            <Box as='li' key={item.id}>
              <Link
                href={`#${item.id}`}
                sx={{
                  display: `inline-flex`,
                  alignItems: `center`,
                  minHeight: 44,
                  bg: `contentBg`,
                  color: `heading`,
                  border: `1px solid`,
                  borderColor: `omegaLight`,
                  borderRadius: `999px`,
                  fontSize: 1,
                  fontWeight: `bold`,
                  textDecoration: `none`,
                  px: 3,
                  py: 2,
                  '&:visited': {
                    color: `heading`
                  },
                  '&:hover': {
                    borderColor: `alpha`,
                    color: `alpha`
                  },
                  ...focusStyle
                }}
              >
                {item.label}
              </Link>
            </Box>
          ))}
        </Flex>
      </Box>
      {guide.notice && (
        <Box
          role='note'
          sx={{
            bg: `alphaLighter`,
            border: `1px solid`,
            borderColor: `alphaLight`,
            borderRadius: `12px`,
            color: `heading`,
            px: [3, 4],
            py: 3,
            mb: guide.compactSpacing ? [2, 3] : [4, 5]
          }}
        >
          <Text as='strong' sx={{ display: `block`, mb: 1 }}>
            {guide.notice.label}
          </Text>
          <Text as='span' sx={{ color: `text`, lineHeight: 1.6 }}>
            {guide.notice.text}
          </Text>
        </Box>
      )}
      <ArticleContents
        items={guideContentsItems}
        showInlineNavigation={false}
      />

      <Box
        as='section'
        id='baslangic'
        aria-labelledby='baslangic-title'
        sx={{
          scrollMarginTop: `96px`,
          pb: [4, 5],
          ...(guide.compactSpacing ? { pb: [2, 3] } : {})
        }}
      >
        <Box
          sx={{
            maxWidth: [760, 760, `none`],
            mb: guide.compactSpacing ? 3 : 4
          }}
        >
          <Text
            as='p'
            sx={{
              color: `alpha`,
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.08em`,
              textTransform: `uppercase`,
              mb: 2
            }}
          >
            {guide.beginner.eyebrow}
          </Text>
          <Heading
            id='baslangic-title'
            as='h2'
            sx={{
              ...headingStyle,
              fontSize: [6, 7],
              lineHeight: 1.1,
              m: 0,
              '@media screen and (min-width: 64em)': {
                whiteSpace: `nowrap`
              }
            }}
          >
            {guide.beginner.title}
          </Heading>
          <Text
            as='p'
            sx={{
              color: `text`,
              fontSize: [2, 3],
              lineHeight: 1.65,
              maxWidth: `100%`
            }}
          >
            {guide.beginner.description}
          </Text>
        </Box>
        <Grid
          as='ol'
          data-reading-path-grid
          sx={{
            gridTemplateColumns: [
              `1fr`,
              null,
              `repeat(2, minmax(0, 1fr))`,
              `repeat(3, minmax(0, 1fr))`
            ],
            gap: guide.compactSpacing ? [2, 2, 3, 3] : [3, 3, 3, 4],
            listStyle: `none`,
            p: 0,
            m: 0
          }}
        >
          {readingPath.map((item, index) => (
            <ArticleLinkCard
              key={item.article.id}
              article={item.article}
              desktopImageOnly={!featuredSlugs.has(item.slug)}
              featured={featuredSlugs.has(item.slug)}
              withImage
              onActivate={trackLink('baslangic', item.article.slug)}
              summary={item.summary}
              step={index + 1}
            />
          ))}
        </Grid>
      </Box>

      {guide.research && (
        <RouteResearchSection guide={guide} research={guide.research} />
      )}

      {topicSections.map(section => (
        <TopicSection
          key={section.id}
          section={section}
          articles={section.articles}
          guide={guide}
          policy={policy}
          featuredSlugs={featuredSlugs}
          trackLink={trackLink}
        />
      ))}

      <Box
        as='section'
        id='yeni-eklenenler'
        aria-labelledby='yeniler-title'
        sx={{ scrollMarginTop: `96px`, pt: [4, 5], pb: [3, 4] }}
      >
        <Heading
          id='yeniler-title'
          as='h2'
          sx={{
            ...headingStyle,
            fontSize: [6, 7],
            lineHeight: 1.1,
            mb: 4
          }}
        >
          Yeni eklenenler
        </Heading>
        <Box
          onClick={event => {
            const link = event.target.closest && event.target.closest('a')
            if (link && latestArticlePaths.has(link.pathname)) {
              trackLink('yeni-eklenenler', link.pathname)()
            }
          }}
        >
          <CardList
            nodes={visibleLatestArticles}
            variant={['horizontal-md', 'vertical']}
            columns={[1, 2, 2, 3]}
            omitCategory
          />
        </Box>
      </Box>

      <Box
        as='section'
        id='tum-icerikler'
        aria-labelledby='tum-icerikler-title'
        sx={{
          scrollMarginTop: `96px`,
          pt: [3, 4],
          pb: 0,
          mt: [3, 4],
          mb: 0
        }}
      >
        <Grid
          sx={{
            gridTemplateColumns: [
              `1fr`,
              null,
              null,
              `minmax(0, 1fr) minmax(280px, 360px)`
            ],
            alignItems: `end`,
            gap: [4, 4, 5],
            mb: [4, 5]
          }}
        >
          <Box>
            <Heading
              id='tum-icerikler-title'
              as='h2'
              sx={{
                ...headingStyle,
                fontSize: [6, 7],
                lineHeight: 1.05,
                m: 0
              }}
            >
              Tüm içerikler
            </Heading>
            <Text
              as='p'
              sx={{
                color: `text`,
                fontSize: [2, 3],
                lineHeight: 1.6,
                maxWidth: 640,
                mt: 2,
                mb: 0
              }}
            >
              {guide.allContentDescription}
            </Text>
          </Box>

          <Box sx={{ position: `relative`, width: `100%` }}>
            <Label
              htmlFor={`${guide.id}-guide-search`}
              sx={{
                position: `absolute`,
                width: 1,
                height: 1,
                p: 0,
                m: -1,
                overflow: `hidden`,
                clip: `rect(0, 0, 0, 0)`,
                whiteSpace: `nowrap`,
                border: 0
              }}
            >
              İçeriklerde ara
            </Label>
            <Box
              aria-hidden='true'
              sx={{
                position: `absolute`,
                top: `50%`,
                left: 3,
                zIndex: 1,
                color: `omegaDark`,
                lineHeight: 0,
                transform: `translateY(-50%)`,
                pointerEvents: `none`
              }}
            >
              <FaSearch />
            </Box>
            <Input
              id={`${guide.id}-guide-search`}
              type='search'
              value={query}
              onChange={event => {
                setQuery(event.target.value)
                setVisibleArticleCount(6)
              }}
              placeholder='İçeriklerde ara...'
              sx={{
                minHeight: 52,
                bg: `contentBg`,
                color: `heading`,
                border: `1px solid`,
                borderColor: `omegaLight`,
                borderRadius: `10px`,
                pl: `2.75rem`,
                pr: 3,
                boxShadow: `0 8px 24px rgba(31, 41, 55, 0.04)`,
                ...focusStyle
              }}
            />
          </Box>
        </Grid>

        <Flex
          role='group'
          aria-label='İçerikleri kategoriye göre filtrele'
          sx={{ flexWrap: `wrap`, gap: 2, mb: [4, 5] }}
        >
          {categories.map(item => {
            const selected = category === item
            const label =
              guide.groupFilters?.find(filter => filter.id === item)?.label ||
              item

            return (
              <Button
                key={item}
                type='button'
                aria-pressed={selected}
                onClick={() => {
                  setCategory(item)
                  setVisibleArticleCount(6)
                }}
                variant='none'
                sx={{
                  display: `inline-flex`,
                  alignItems: `center`,
                  justifyContent: `center`,
                  minHeight: 40,
                  color: selected ? `white` : `heading`,
                  bg: selected ? `alpha` : `omegaLighter`,
                  borderRadius: `999px`,
                  fontSize: 1,
                  fontWeight: `bold`,
                  px: 4,
                  py: 2,
                  transition: `background-color 160ms ease, color 160ms ease`,
                  '&:hover': {
                    color: selected ? `white` : `alphaDark`,
                    bg: selected ? `alpha` : `omegaLight`
                  },
                  ...focusStyle
                }}
              >
                {label}
              </Button>
            )
          })}
        </Flex>

        <Text
          as='p'
          role='status'
          aria-live='polite'
          sx={{
            position: `absolute`,
            width: 1,
            height: 1,
            p: 0,
            m: -1,
            overflow: `hidden`,
            clip: `rect(0, 0, 0, 0)`,
            whiteSpace: `nowrap`,
            border: 0
          }}
        >
          {filteredArticles.length} içerik gösteriliyor
        </Text>

        {filteredArticles.length ? (
          <>
            <Grid
              as='ul'
              data-all-content-grid
              sx={{
                gridTemplateColumns: [
                  `1fr`,
                  null,
                  `repeat(2, minmax(0, 1fr))`,
                  `repeat(3, minmax(0, 1fr))`
                ],
                gap: [3, 4],
                listStyle: `none`,
                p: 0,
                m: 0
              }}
            >
              {visibleArticles.map(article => {
                const image = getImageVariant(article.thumbnail, 'natural')
                const imageAspectRatio =
                  image && image.width && image.height
                    ? `${image.width} / ${image.height}`
                    : null

                return (
                  <Box as='li' key={article.id} sx={{ minWidth: 0 }}>
                    <Link
                      as={GatsbyLink}
                      to={article.slug}
                      onClick={trackLink('tum-icerikler', article.slug)}
                      sx={{
                        display: `flex`,
                        height: `100%`,
                        minHeight: [360, 400],
                        flexDirection: `column`,
                        color: `heading`,
                        bg: `contentBg`,
                        border: `1px solid`,
                        borderColor: `omegaLight`,
                        borderRadius: `10px`,
                        boxShadow: `0 12px 30px rgba(31, 41, 55, 0.07)`,
                        overflow: `hidden`,
                        textDecoration: `none`,
                        transition: `transform 180ms ease, box-shadow 180ms ease`,
                        '@media (hover: hover) and (pointer: fine)': {
                          '&:hover': {
                            color: `heading`,
                            transform: `translateY(-3px)`,
                            boxShadow: `0 18px 36px rgba(31, 41, 55, 0.12)`
                          }
                        },
                        '&:visited': { color: `heading` },
                        ...focusStyle
                      }}
                    >
                      {image && (
                        <Box
                          sx={{
                            ...(imageAspectRatio
                              ? { aspectRatio: imageAspectRatio }
                              : { height: [190, 210, 220] }),
                            overflow: `hidden`,
                            bg: `omegaLighter`,
                            '& .gatsby-image-wrapper': {
                              width: `100%`,
                              height: `100%`
                            }
                          }}
                        >
                          <Img
                            image={image}
                            alt={article.title}
                            loading='lazy'
                            style={{ width: `100%`, height: `100%` }}
                            imgStyle={{ objectFit: `cover` }}
                          />
                        </Box>
                      )}
                      <Flex
                        sx={{
                          flex: 1,
                          flexDirection: `column`,
                          alignItems: `flex-start`,
                          p: [3, 4]
                        }}
                      >
                        {article.category?.name && (
                          <Text
                            as='span'
                            sx={{
                              color: `alphaDark`,
                              fontSize: 0,
                              fontWeight: `bold`,
                              letterSpacing: `0.09em`,
                              textTransform: `uppercase`,
                              mb: 2
                            }}
                          >
                            {article.category.name}
                          </Text>
                        )}
                        <Heading
                          as='h3'
                          sx={{
                            color: `heading`,
                            fontFamily: `'DM Serif Display', Georgia, serif`,
                            fontSize: [4, 5],
                            fontWeight: 400,
                            lineHeight: 1.12,
                            m: 0
                          }}
                        >
                          {article.title}
                        </Heading>
                        {article.timeToRead && (
                          <Flex
                            sx={{
                              alignItems: `center`,
                              gap: 2,
                              color: `omegaDark`,
                              fontSize: 1,
                              mt: `auto`,
                              pt: 3
                            }}
                          >
                            <FaRegClock aria-hidden='true' />
                            <Text as='span'>{article.timeToRead} dk okuma</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Link>
                  </Box>
                )
              })}
            </Grid>

            {visibleArticles.length < filteredArticles.length && (
              <Flex sx={{ justifyContent: `center`, mt: [4, 5] }}>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setVisibleArticleCount(count =>
                      Math.min(count + 6, filteredArticles.length)
                    )
                  }
                  sx={{
                    display: `inline-flex`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    gap: 3,
                    minHeight: 48,
                    color: `heading`,
                    bg: `transparent`,
                    border: `1px solid`,
                    borderColor: `heading`,
                    borderRadius: `6px`,
                    fontSize: 1,
                    fontWeight: `bold`,
                    px: 5,
                    ...focusStyle
                  }}
                >
                  Daha fazla içerik yükle
                  <FaChevronDown aria-hidden='true' />
                </Button>
              </Flex>
            )}
          </>
        ) : (
          <Box
            sx={{
              bg: `contentBg`,
              border: `1px solid`,
              borderColor: `omegaLight`,
              borderRadius: `12px`,
              textAlign: `center`,
              px: 3,
              py: 5,
              mt: 3
            }}
          >
            <Heading as='h3' sx={{ color: `heading`, fontSize: 4, mt: 0 }}>
              Aramana uygun içerik bulunamadı
            </Heading>
            <Text as='p' sx={{ color: `text`, mb: 3 }}>
              Başka bir kelime deneyebilir veya aramayı temizleyebilirsin.
            </Text>
            <Button
              type='button'
              variant='mute'
              onClick={() => {
                setQuery('')
                setCategory('Tümü')
                setVisibleArticleCount(6)
              }}
              sx={{ minHeight: 44, ...focusStyle }}
            >
              Aramayı temizle
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const allCuratedSlugs = getAllCuratedSlugs(defaultGuide)

export { allCuratedSlugs, getAllCuratedSlugs, GuideCategory }
export default GuideCategory
