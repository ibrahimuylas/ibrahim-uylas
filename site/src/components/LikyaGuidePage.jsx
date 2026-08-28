import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { Box, Button, Card, Flex, Heading, Link, Text } from 'theme-ui'
import { FaArrowRight, FaCompass } from 'react-icons/fa'
import { Layout, Main, Stack } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import ArticleContents from './ArticleContents'
import LikyaRouteAtlas from './LikyaRouteAtlas'
import LikyaRoutePlanner from './LikyaRoutePlanner'
import LikyaPreparationCenter from './LikyaPreparationCenter'
import likya from '../content-guides/likya'
import guideMeta from '../content-guides/likya/guide-meta'
import { trackEvent } from '../utils/analytics'

const surfaceStyle = {
  bg: 'contentBg',
  border: '1px solid',
  borderColor: 'omegaLight',
  borderRadius: 'lg',
  boxShadow: theme => `0 18px 50px -42px ${theme.colors.omegaDarker}`
}

const headingStyle = {
  color: 'heading',
  fontFamily: "'DM Serif Display', Georgia, serif",
  fontWeight: 400,
  letterSpacing: '-0.02em'
}

const focusStyle = {
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'alpha',
    outlineOffset: 3
  }
}

const actionStyle = {
  ...focusStyle,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  minHeight: 48,
  px: 3,
  py: 2,
  borderRadius: 'full',
  fontSize: 1,
  fontWeight: 'bold',
  lineHeight: 1.2,
  textDecoration: 'none',
  transition: 'background-color 160ms ease, transform 160ms ease',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': {
      transform: 'translateY(-1px)'
    }
  }
}

const guideContents = [
  {
    title: 'Rotanı seç',
    url: '#planlayici'
  },
  {
    title: 'Hazırlan',
    url: '#hazirlik-merkezi'
  },
  {
    title: 'Bölümleri keşfet',
    url: '#tum-etaplar'
  }
]

const trackedAnchor =
  (eventName, parameters = {}) =>
  () =>
    trackEvent(eventName, parameters)

const GuideAction = ({ children, href, onClick, primary = false }) => (
  <Button
    as='a'
    href={href}
    onClick={onClick}
    sx={{
      ...actionStyle,
      color: primary ? 'white' : 'alpha',
      bg: primary ? 'alpha' : 'transparent',
      border: primary ? 0 : '1px solid',
      borderColor: primary ? 'alpha' : 'alpha',
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
          color: primary ? 'white' : 'alphaDarker',
          bg: primary ? 'alphaDark' : 'alphaLighter',
          transform: 'translateY(-1px)'
        }
      }
    }}
  >
    {children}
  </Button>
)

const LikyaGuidePage = ({
  post,
  location,
  services,
  siteUrl,
  relatedPosts,
  ...props
}) => {
  const officialSource = likya.sourceById[guideMeta.officialRouteSourceId]
  return (
    <Layout {...props}>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider space={3} />
      <Stack>
        <Main>
          <ArticleContents items={guideContents} showInlineNavigation={false} />
          <Box as='article' sx={{ minWidth: 0 }}>
            <Card
              sx={{
                ...surfaceStyle,
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: [
                  '1fr',
                  null,
                  'minmax(0, 1.05fr) minmax(0, 0.95fr)'
                ]
              }}
            >
              <Box
                sx={{
                  order: [0, null, 1],
                  minHeight: [220, 280, '100%'],
                  bg: 'omegaLighter',
                  '& .gatsby-image-wrapper': { height: '100%' }
                }}
              >
                <StaticImage
                  src='../../content/assets/rotalar-guide-hero.png'
                  alt='Pusula, topoğrafik harita ve Likya Yolu’nda yürüyüş rotası'
                  layout='fullWidth'
                  loading='eager'
                  placeholder='blurred'
                  quality={90}
                  formats={['auto', 'webp', 'avif']}
                  style={{ width: '100%', height: '100%' }}
                  imgStyle={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </Box>
              <Box sx={{ order: [1, null, 0], minWidth: 0, p: [3, 4, 5] }}>
                <Text
                  as='p'
                  sx={{
                    color: 'alpha',
                    fontSize: 0,
                    fontWeight: 'bold',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    mt: 0,
                    mb: 2
                  }}
                >
                  Likya Yolu rehberi
                </Text>
                <Heading
                  as='h1'
                  sx={{
                    ...headingStyle,
                    fontSize: [5, 6, 7],
                    lineHeight: 1.04,
                    m: 0
                  }}
                >
                  {post.title}
                </Heading>
                <Text
                  as='p'
                  sx={{
                    color: 'article',
                    fontSize: [2, 3],
                    lineHeight: 1.6,
                    mt: 3,
                    mb: 0,
                    maxWidth: '36rem'
                  }}
                >
                  Likya Yolu’nda kaç gün yürümek istediğini, hangi dönemde yola
                  çıkacağını ve nasıl konaklayacağını düşünerek doğru başlangıcı
                  bulmana yardım edecek rehber.
                </Text>
                <Flex
                  sx={{
                    flexDirection: ['column', 'row'],
                    alignItems: ['stretch', 'center'],
                    flexWrap: 'wrap',
                    gap: 2,
                    mt: 4
                  }}
                >
                  <GuideAction
                    href='#planlayici'
                    primary
                    onClick={trackedAnchor('likya_planner_start', {
                      source_path: location.pathname
                    })}
                  >
                    Rota seçmeye başla{' '}
                    <FaCompass size={15} aria-hidden='true' />
                  </GuideAction>
                  <GuideAction
                    href='#tum-etaplar'
                    onClick={trackedAnchor('likya_atlas_open', {
                      source_path: location.pathname
                    })}
                  >
                    Tüm rotaları keşfet{' '}
                    <FaArrowRight size={14} aria-hidden='true' />
                  </GuideAction>
                </Flex>
              </Box>
            </Card>

            <LikyaRoutePlanner
              location={location}
              plans={likya.routePlans}
              catalog={likya.routePlanCatalog}
            />

            <LikyaPreparationCenter location={location} />

            <LikyaRouteAtlas
              location={location}
              source={officialSource}
              sourceById={likya.sourceById}
              mapCollectionUrl={
                likya.sourceById['ktb-likya-map-collection'].url
              }
              sections={likya.routeSections}
              regionPackages={[
                likya.westernLikyaRegion,
                likya.centralLikyaRegion,
                likya.easternLikyaRegion
              ]}
            />
          </Box>

          <Divider />
          {post.category && (
            <CardList
              title='İlgili Yazılar'
              nodes={relatedPosts}
              variant={['horizontal-md']}
              columns={[1, 2, 2, 2]}
              limit={6}
              distinct
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

export default LikyaGuidePage
