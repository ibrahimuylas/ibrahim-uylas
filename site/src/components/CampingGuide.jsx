import React, { useMemo, useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { GatsbyImage as Img } from 'gatsby-plugin-image'
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
import campingGuide from '../content-guides/campingGuide'
import { currentPagePath, trackEvent } from '../utils/analytics'
import policy from './campingGuidePolicy'

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

const allCuratedSlugs = [
  ...campingGuide.readingPath.map(item => item.slug),
  ...campingGuide.sections.flatMap(section => section.slugs)
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
  featured,
  onActivate,
  summary,
  step,
  withImage
}) => {
  const image = withImage
    ? getImageVariant(article.thumbnail, 'vertical')
    : null

  return (
    <Box
      as='li'
      sx={{
        ...surfaceStyle,
        position: `relative`,
        minWidth: 0,
        p: [3, 4],
        transition: `transform 180ms ease, border-color 180ms ease`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': {
            borderColor: `alpha`,
            transform: `translateY(-2px)`
          }
        }
      }}
    >
      <Flex sx={{ alignItems: `flex-start`, gap: 3 }}>
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
            gridTemplateColumns: image
              ? [
                  `minmax(0, 1fr) 72px`,
                  `minmax(0, 1fr) 80px`,
                  `minmax(0, 1fr) 88px`
                ]
              : `minmax(0, 1fr)`,
            columnGap: [2, 3],
            alignItems: `start`
          }}
        >
          <Box sx={{ minWidth: 0, gridColumn: image ? `1 / -1` : `auto` }}>
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
                color: `heading`,
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
          </Box>
          <Box sx={{ minWidth: 0 }}>
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
              {summary || article.excerpt}
            </Text>
            <ArticleMeta article={article} />
          </Box>
          {image && (
            <Box
              data-guide-thumbnail
              aria-hidden='true'
              sx={{
                width: [72, 80, 88],
                height: [54, 60, 66],
                mt: 2,
                overflow: `hidden`,
                borderRadius: `10px`,
                bg: `omegaLighter`,
                pointerEvents: `none`,
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
        </Grid>
      </Flex>
    </Box>
  )
}

const TopicSection = ({ section, articles, featuredSlugs, trackLink }) => (
  <Box
    as='section'
    id={section.id}
    aria-labelledby={`${section.id}-title`}
    sx={{
      scrollMarginTop: `96px`,
      py: [4, 5],
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
              campingGuide.imageSectionIds.includes(section.id) ||
              featuredSlugs.has(policy.articleKey(article.slug))
            }
            onActivate={trackLink(section.id, article.slug)}
          />
        ))}
      </Grid>
    </Grid>
  </Box>
)

const CampingGuide = ({ articles = [], latestArticles = [] }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tümü')
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
        curatedSlugs: allCuratedSlugs
      }),
    [articles]
  )
  const filteredArticles = useMemo(
    () => policy.filterArticles({ articles: guideArticles, query, category }),
    [guideArticles, query, category]
  )
  const categories = useMemo(
    () => [
      'Tümü',
      ...Array.from(
        new Set(
          guideArticles.map(article => article.category?.name).filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b, 'tr-TR'))
    ],
    [guideArticles]
  )
  const featuredSlugs = useMemo(() => new Set(campingGuide.featuredSlugs), [])
  const latestArticlePaths = useMemo(
    () => new Set(latestArticles.map(article => article.slug)),
    [latestArticles]
  )
  const readingPath = campingGuide.readingPath
    .map(item => ({ ...item, article: articleLookup.get(item.slug) }))
    .filter(item => item.article)
  const topicSections = campingGuide.sections.map(section => ({
    ...section,
    articles: section.slugs.map(slug => articleLookup.get(slug)).filter(Boolean)
  }))

  const trackLink = (sectionId, linkUrl) =>
    policy.createCategoryHubActivation({
      hub: campingGuide.id,
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
          position: `relative`,
          overflow: `hidden`,
          px: [3, 4, 5, 6],
          py: [4, 5, 6],
          '&::before': {
            content: `""`,
            position: `absolute`,
            width: [180, 260, 360],
            height: [180, 260, 360],
            top: [-90, -130, -180],
            right: [-90, -100, -120],
            bg: `alphaLighter`,
            borderRadius: `50%`,
            opacity: 0.75
          }
        }}
      >
        <Box sx={{ position: `relative`, maxWidth: 850 }}>
          <Text
            as='p'
            sx={{
              color: `alpha`,
              fontSize: 1,
              fontWeight: `bold`,
              letterSpacing: `0.08em`,
              textTransform: `uppercase`,
              mt: 0,
              mb: 2
            }}
          >
            Kampçılık içerik merkezi
          </Text>
          <Heading
            as='h1'
            sx={{
              ...headingStyle,
              fontSize: [7, 8, 9],
              lineHeight: 1.02,
              m: 0
            }}
          >
            {campingGuide.title}
          </Heading>
          <Text
            as='p'
            sx={{
              color: `text`,
              fontSize: [3, 4],
              lineHeight: 1.65,
              maxWidth: 760,
              mt: 3,
              mb: 4
            }}
          >
            {campingGuide.description}
          </Text>
          <Flex sx={{ flexWrap: `wrap`, gap: 3 }}>
            <Button
              as='a'
              href='#baslangic'
              sx={{
                minHeight: 48,
                display: `inline-flex`,
                alignItems: `center`,
                ...focusStyle
              }}
            >
              İlk kampına buradan başla
            </Button>
            <Button
              as='a'
              href='#tum-icerikler'
              variant='mute'
              sx={{
                minHeight: 48,
                display: `inline-flex`,
                alignItems: `center`,
                ...focusStyle
              }}
            >
              Tüm içeriklerde ara
            </Button>
          </Flex>
          <Flex
            aria-label='Rehber özeti'
            sx={{
              flexWrap: `wrap`,
              gap: [3, 4],
              color: `omegaDark`,
              fontSize: [1, 2],
              mt: 4
            }}
          >
            <Text as='span'>
              <strong>{guideArticles.length}</strong> bağlantılı içerik
            </Text>
            <Text as='span'>
              <strong>6</strong> konu
            </Text>
            <Text as='span'>
              <strong>{readingPath.length}</strong> adımlık başlangıç yolu
            </Text>
          </Flex>
        </Box>
      </Box>

      <Box as='nav' aria-label='Kampçılık rehberi konuları' sx={{ py: [4, 5] }}>
        <Flex
          as='ul'
          sx={{ flexWrap: `wrap`, gap: 2, listStyle: `none`, p: 0 }}
        >
          {[
            { id: 'baslangic', label: 'İlk kamp ve hazırlık' },
            ...campingGuide.sections.map(section => ({
              id: section.id,
              label: section.title
            }))
          ].map(item => (
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

      <Box
        as='section'
        id='baslangic'
        aria-labelledby='baslangic-title'
        sx={{
          scrollMarginTop: `96px`,
          pb: [5, 6]
        }}
      >
        <Box sx={{ maxWidth: 760, mb: 4 }}>
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
            Yeni başlayanlar için okuma yolu
          </Text>
          <Heading
            id='baslangic-title'
            as='h2'
            sx={{
              ...headingStyle,
              fontSize: [6, 7],
              lineHeight: 1.1,
              m: 0
            }}
          >
            İlk kampını adım adım planla
          </Heading>
          <Text
            as='p'
            sx={{ color: `text`, fontSize: [2, 3], lineHeight: 1.65 }}
          >
            Bu sırayı takip ederek kamp hayatını tanıyabilir, temel güvenlik
            kararlarını verebilir ve sıcak bir uyku sistemi kurabilirsin.
          </Text>
        </Box>
        <Grid
          as='ol'
          sx={{
            gridTemplateColumns: [`1fr`, null, `repeat(2, minmax(0, 1fr))`],
            gap: 3,
            listStyle: `none`,
            p: 0,
            m: 0
          }}
        >
          {readingPath.map((item, index) => (
            <ArticleLinkCard
              key={item.article.id}
              article={item.article}
              featured={featuredSlugs.has(item.slug)}
              withImage={featuredSlugs.has(item.slug)}
              onActivate={trackLink('baslangic', item.article.slug)}
              summary={item.summary}
              step={index + 1}
            />
          ))}
        </Grid>
      </Box>

      {topicSections.map(section => (
        <TopicSection
          key={section.id}
          section={section}
          articles={section.articles}
          featuredSlugs={featuredSlugs}
          trackLink={trackLink}
        />
      ))}

      <Box
        as='section'
        aria-labelledby='yeniler-title'
        sx={{ pt: [5, 6], pb: [4, 5] }}
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
            nodes={latestArticles}
            variant={['horizontal-md', 'vertical']}
            columns={[1, 2, 2, 4]}
            omitCategory
          />
        </Box>
      </Box>

      <Box
        as='section'
        id='tum-icerikler'
        aria-labelledby='tum-icerikler-title'
        sx={{
          ...surfaceStyle,
          scrollMarginTop: `96px`,
          px: [3, 4, 5],
          py: [4, 5],
          my: [4, 5]
        }}
      >
        <Heading
          id='tum-icerikler-title'
          as='h2'
          sx={{
            ...headingStyle,
            fontSize: [6, 7],
            lineHeight: 1.1,
            m: 0
          }}
        >
          Tüm kampçılık içerikleri
        </Heading>
        <Text
          as='p'
          sx={{ color: `text`, fontSize: [2, 3], lineHeight: 1.6, mb: 4 }}
        >
          Başlık veya açıklamada ara; dilersen kaynak kategoriye göre daralt.
        </Text>

        <Box sx={{ maxWidth: 680 }}>
          <Label htmlFor='camping-guide-search' sx={{ fontWeight: `bold` }}>
            İçerik ara
          </Label>
          <Input
            id='camping-guide-search'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Örneğin: uyku tulumu, çadır, kamp ateşi'
            sx={{
              minHeight: 48,
              bg: `background`,
              color: `heading`,
              border: `1px solid`,
              borderColor: `omegaLight`,
              borderRadius: `10px`,
              px: 3,
              ...focusStyle
            }}
          />
        </Box>

        <Flex
          aria-label='İçerikleri kategoriye göre filtrele'
          sx={{ flexWrap: `wrap`, gap: 2, mt: 3 }}
        >
          {categories.map(item => (
            <Button
              key={item}
              type='button'
              variant={category === item ? 'primary' : 'mute'}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              sx={{ minHeight: 44, px: 3, py: 2, ...focusStyle }}
            >
              {item}
            </Button>
          ))}
        </Flex>

        <Text
          as='p'
          role='status'
          aria-live='polite'
          sx={{ color: `omegaDark`, fontSize: 1, mt: 3, mb: 2 }}
        >
          {filteredArticles.length} içerik gösteriliyor
        </Text>

        {filteredArticles.length ? (
          <Grid
            as='ul'
            sx={{
              gridTemplateColumns: [`1fr`, null, `repeat(2, minmax(0, 1fr))`],
              gap: 2,
              listStyle: `none`,
              p: 0,
              m: 0
            }}
          >
            {filteredArticles.map(article => (
              <Box
                as='li'
                key={article.id}
                sx={{
                  borderTop: `1px solid`,
                  borderColor: `omegaLight`
                }}
              >
                <Link
                  as={GatsbyLink}
                  to={article.slug}
                  onClick={trackLink('tum-icerikler', article.slug)}
                  sx={{
                    display: `block`,
                    minHeight: 72,
                    color: `heading`,
                    textDecoration: `none`,
                    py: 3,
                    '&:hover': { color: `alpha` },
                    ...focusStyle
                  }}
                >
                  <Text
                    as='span'
                    sx={{
                      display: `block`,
                      fontSize: [2, 3],
                      fontWeight: `bold`,
                      lineHeight: 1.35
                    }}
                  >
                    {article.title}
                  </Text>
                  <Text
                    as='span'
                    sx={{
                      display: `block`,
                      color: `omegaDark`,
                      fontSize: 1,
                      mt: 1
                    }}
                  >
                    {article.category?.name}
                    {article.timeToRead ? ` · ${article.timeToRead} dk` : ''}
                  </Text>
                </Link>
              </Box>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              bg: `background`,
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
              Başka bir kelime deneyebilir veya tüm kategorileri
              gösterebilirsin.
            </Text>
            <Button
              type='button'
              variant='mute'
              onClick={() => {
                setQuery('')
                setCategory('Tümü')
              }}
              sx={{ minHeight: 44, ...focusStyle }}
            >
              Filtreleri temizle
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export { allCuratedSlugs }
export default CampingGuide
