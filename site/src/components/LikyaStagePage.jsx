import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaMapMarkedAlt
} from 'react-icons/fa'
import { Box, Button, Card, Flex, Grid, Heading, Link, Text } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import { PostBody, PostImage, PostTagsShare } from '@widgets/Post'
import ArticleReactions from './ArticleReactions'
import DeferredComments from './DeferredComments'
import LikyaConditionPanel from './LikyaConditionPanel'
import likya from '../content-guides/likya'

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

const StageQuickFacts = ({ stage, source }) => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
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
      Etap bilgileri
    </Text>
    <Grid
      as='dl'
      sx={{
        gridTemplateColumns: ['1fr', '9rem minmax(0, 1fr)'],
        columnGap: 3,
        rowGap: 2,
        color: 'article',
        fontSize: 1,
        lineHeight: 1.55,
        m: 0
      }}
    >
      <Text as='dt' sx={{ color: 'omegaDark', fontWeight: 'bold' }}>
        Kayıt sırası
      </Text>
      <Text as='dd' sx={{ m: 0 }}>
        {stage.sequence} / 11 · 2014 yürüyüş arşivi
      </Text>
      <Text as='dt' sx={{ color: 'omegaDark', fontWeight: 'bold' }}>
        Başlangıç – bitiş
      </Text>
      <Text as='dd' sx={{ m: 0 }}>
        {stage.start} – {stage.end}
      </Text>
      <Text as='dt' sx={{ color: 'omegaDark', fontWeight: 'bold' }}>
        Mesafe
      </Text>
      <Text as='dd' sx={{ m: 0 }}>
        {stage.distanceKm.value} km · 2014 günlük kaydı
      </Text>
      <Text as='dt' sx={{ color: 'omegaDark', fontWeight: 'bold' }}>
        Güncel durum
      </Text>
      <Text as='dd' sx={{ m: 0 }}>
        Etap sınırı, efor ve süre yakın tarihte doğrulanmadı.
      </Text>
      <Text as='dt' sx={{ color: 'omegaDark', fontWeight: 'bold' }}>
        Kaynak
      </Text>
      <Text as='dd' sx={{ m: 0 }}>
        <Link
          as={GatsbyLink}
          to={source.url}
          sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
        >
          2014 yürüyüş arşivi
        </Link>
      </Text>
    </Grid>
  </Card>
)

const StageDecision = ({ stage }) => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
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
      Karar özeti
    </Text>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Bu sayfayı ne için kullanabilirsin?
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
      {stage.name} için burada saklanan bilgi, İbrahim’in {stage.experienceDate}{' '}
      tarihli yürüyüş anlatısıdır. Rota seçimi için bugünkü efor, konaklama, su
      veya geçiş koşullarını doğrulamaz.
    </Text>
    <Grid
      sx={{
        gridTemplateColumns: ['1fr', null, 'repeat(2, minmax(0, 1fr))'],
        gap: 3,
        mt: 4
      }}
    >
      <Box>
        <Text
          as='p'
          sx={{ color: 'heading', fontWeight: 'bold', mt: 0, mb: 1 }}
        >
          En doğru kullanım
        </Text>
        <Text
          as='p'
          sx={{ color: 'article', fontSize: 1, lineHeight: 1.6, m: 0 }}
        >
          Tarihsel saha deneyimini ve günlüğü okumak.
        </Text>
      </Box>
      <Box>
        <Text
          as='p'
          sx={{ color: 'heading', fontWeight: 'bold', mt: 0, mb: 1 }}
        >
          Başka etap seç
        </Text>
        <Text
          as='p'
          sx={{ color: 'article', fontSize: 1, lineHeight: 1.6, m: 0 }}
        >
          Güncel karar için ana rehberdeki planlayıcı ve resmî pafta
          envanterinden başla.
        </Text>
      </Box>
    </Grid>
  </Card>
)

const StageCurrentChecks = ({ stage }) => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <LikyaConditionPanel
      conditions={likya.conditions}
      sourceById={likya.sourceById}
      scope={{ stageIds: [stage.id] }}
    />
  </Card>
)

const StageRouteStatus = () => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Rota ve efor
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3 }}>
      Bu tarihsel etap, resmî paftalarla henüz birebir eşleştirilmedi. Arazi,
      yükselti, süre ve çıkış noktaları için doğrulanmış yapılandırılmış veri
      yoktur.
    </Text>
  </Card>
)

const StageDayFlow = () => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Günün akışı
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
      Bu etap için 3–6 doğrulanmış karar noktası henüz yapılandırılmadı.
      Aşağıdaki 2014 saha anlatısı, bir yönlendirme veya turn-by-turn navigasyon
      yerine tarihsel bağlam olarak okunmalıdır.
    </Text>
  </Card>
)

const StageServicesAndAccess = () => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Su, konaklama ve ulaşım
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
      Su kaynakları, işletmeler, kamp/pansiyon imkânları, toplu taşıma ve erken
      çıkış seçenekleri yakın tarihte doğrulanmadı. Bu alanlar, kaynak ve gözlem
      tarihi eklenmeden öneri olarak gösterilmez.
    </Text>
  </Card>
)

const StageGps = ({ officialSource }) => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Harita ve GPS
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3 }}>
      Bu etap için sahipliği, tarihi, yönü ve varyantı doğrulanmış bir GPS kaydı
      henüz bağlanmadı. İşaretleri ve resmî/yerel duyuruları her zaman ayrıca
      karşılaştır.
    </Text>
    <Flex sx={{ gap: 3, flexWrap: 'wrap', mt: 3 }}>
      <Link
        href={officialSource.url}
        target='_blank'
        rel='noopener noreferrer'
        sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
      >
        Resmî pafta envanterini aç{' '}
        <FaExternalLinkAlt aria-hidden='true' size={11} />
      </Link>
      <Link
        as={GatsbyLink}
        to='/likya-yolu-hazirliklari/'
        sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
      >
        Çevrimdışı navigasyon hazırlığına git{' '}
        <FaArrowRight aria-hidden='true' size={12} />
      </Link>
    </Flex>
  </Card>
)

const LikyaSeriesNavigation = ({ stage }) => {
  const currentIndex = likya.stageGuides.findIndex(item => item.id === stage.id)
  const previous = likya.stageGuides[currentIndex - 1]
  const next = likya.stageGuides[currentIndex + 1]

  return (
    <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
      <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
        Yolculuğa devam et
      </Heading>
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', null, 'repeat(2, minmax(0, 1fr))'],
          gap: 3,
          mt: 3
        }}
      >
        {previous ? (
          <Link
            as={GatsbyLink}
            to={`/${previous.articleSlug}/`}
            sx={{
              ...focusStyle,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              minHeight: 48,
              color: 'alpha',
              fontWeight: 'bold'
            }}
          >
            <FaArrowLeft aria-hidden='true' size={12} /> Önceki: {previous.name}
          </Link>
        ) : (
          <Link
            as={GatsbyLink}
            to='/likya-yolu-rotasi/'
            sx={{
              ...focusStyle,
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 48,
              color: 'alpha',
              fontWeight: 'bold'
            }}
          >
            Ana rehbere dön
          </Link>
        )}
        {next && (
          <Link
            as={GatsbyLink}
            to={`/${next.articleSlug}/`}
            sx={{
              ...focusStyle,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: ['flex-start', 'flex-end'],
              gap: 2,
              minHeight: 48,
              color: 'alpha',
              fontWeight: 'bold'
            }}
          >
            Sonraki: {next.name} <FaArrowRight aria-hidden='true' size={12} />
          </Link>
        )}
      </Grid>
      <Flex sx={{ gap: 3, flexWrap: 'wrap', mt: 3 }}>
        <Link
          as={GatsbyLink}
          to='/likya-yolu-rotasi/#tum-etaplar'
          sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
        >
          Tüm paftaları gör
        </Link>
        <Link
          as={GatsbyLink}
          to={`/${stage.journalSlug}/`}
          sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
        >
          Aynı günün günlüğünü oku
        </Link>
      </Flex>
    </Card>
  )
}

const LikyaStagePage = ({
  post,
  location,
  services,
  siteUrl,
  relatedPosts,
  ...props
}) => {
  const stage = likya.stageGuideByArticleSlug[post.slug]
  const source = likya.sourceById[stage.sourceIds[0]]
  const officialSource = likya.sourceById['ktb-likya-route-home']

  return (
    <Layout {...props}>
      <Seo {...post} siteUrl={siteUrl} />
      <Divider space={3} />
      <Stack>
        <Main>
          <Box as='article'>
            <Card sx={{ ...surfaceStyle, overflow: 'hidden' }}>
              <PostImage {...post} inCardLarge />
              <Box sx={{ p: [3, 4, 5] }}>
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
                  Likya Yolu · 2014 saha arşivi · Etap {stage.sequence}
                </Text>
                <Heading
                  as='h1'
                  sx={{
                    ...headingStyle,
                    fontSize: [5, 6],
                    lineHeight: 1.06,
                    m: 0
                  }}
                >
                  {stage.start} – {stage.end}
                </Heading>
                <Text
                  as='p'
                  sx={{
                    color: 'article',
                    fontSize: [2, 3],
                    lineHeight: 1.65,
                    mt: 3,
                    mb: 0,
                    maxWidth: '44rem'
                  }}
                >
                  Bu sayfa, bu segmentin 2014’teki yürüyüş deneyimini saklar;
                  güncel etap seçimi için doğrulanmış rota rehberi değildir.
                </Text>
                <Button
                  as={GatsbyLink}
                  to='/likya-yolu-rotasi/#planlayici'
                  sx={{ ...focusStyle, mt: 4, minHeight: 48 }}
                >
                  Bu etaba uygun planları gör{' '}
                  <FaArrowRight aria-hidden='true' size={13} />
                </Button>
              </Box>
            </Card>

            <Grid
              sx={{
                gridTemplateColumns: [
                  '1fr',
                  null,
                  'minmax(0, 1fr) minmax(0, 1fr)'
                ],
                gap: 3,
                mt: 4
              }}
            >
              <StageQuickFacts stage={stage} source={source} />
              <StageDecision stage={stage} />
            </Grid>
            <Box sx={{ display: 'grid', gap: 3, mt: 3 }}>
              <StageRouteStatus />
              <StageDayFlow />
              <StageServicesAndAccess />
              <StageGps officialSource={officialSource} />
              <StageCurrentChecks stage={stage} />
              <Card sx={{ ...surfaceStyle, overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: [3, 4],
                    bg: 'omegaLighter',
                    borderBottom: '1px solid',
                    borderColor: 'omegaLight'
                  }}
                >
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                    <FaMapMarkedAlt aria-hidden='true' size={17} />
                    <Heading
                      as='h2'
                      sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}
                    >
                      İbrahim’in 2014 saha notu
                    </Heading>
                  </Flex>
                  <Text
                    as='p'
                    sx={{ color: 'article', lineHeight: 1.6, mt: 2, mb: 0 }}
                  >
                    Deneyim tarihi: {stage.experienceDate}. Aşağıdaki anlatıdaki
                    hizmet, su, kamp ve işaret bilgileri güncel kabul edilmez.
                  </Text>
                </Box>
                <Box
                  sx={{ p: [3, 4, 5] }}
                  {...(post.private ? {} : { 'data-pagefind-body': '' })}
                >
                  <PostBody />
                </Box>
              </Card>
              <LikyaSeriesNavigation stage={stage} />
            </Box>
            <Box sx={{ px: [0, 0], mt: 4 }}>
              <PostTagsShare {...post} location={location} />
              {services.reactions?.enabled && <ArticleReactions {...post} />}
              {services.comments?.enabled && (
                <DeferredComments
                  {...post}
                  siteUrl={siteUrl}
                  comments={services.comments}
                />
              )}
            </Box>
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

export default LikyaStagePage
