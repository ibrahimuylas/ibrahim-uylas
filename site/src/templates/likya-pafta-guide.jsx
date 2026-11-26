import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaMapMarkedAlt,
  FaRoute
} from 'react-icons/fa'
import { Box, Button, Card, Flex, Grid, Heading, Link, Text } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import Divider from '@components/Divider'
import LikyaConditionPanel from '@components/LikyaConditionPanel'
import Seo from '@widgets/Seo'
import likya from '../content-guides/likya'
import { isVerifiedExternalGpsLink } from '../content-guides/likya/external-gps-links'

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

const formatMetric = (value, suffix) =>
  `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(
    value
  )} ${suffix}`

const QuickFact = ({ label, children }) => (
  <Box>
    <Text
      as='p'
      sx={{
        color: 'omegaDark',
        fontSize: 0,
        fontWeight: 'bold',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        mt: 0,
        mb: 1
      }}
    >
      {label}
    </Text>
    <Text as='p' sx={{ color: 'heading', fontWeight: 'bold', m: 0 }}>
      {children}
    </Text>
  </Box>
)

const MetricFacts = ({ section, research }) => (
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
      Pafta özeti
    </Text>
    <Grid
      sx={{
        gridTemplateColumns: ['1fr 1fr', null, 'repeat(2, minmax(0, 1fr))'],
        gap: 3
      }}
    >
      <QuickFact label='Resmî başlık'>{section.officialTitle}</QuickFact>
      <QuickFact label='Yürüyüş yönü'>
        {research.direction === 'eastbound' ? 'Doğu yönü' : 'Batı yönü'}
      </QuickFact>
      <QuickFact label='Mesafe'>
        {formatMetric(research.routeMetrics.distanceKm.value, 'km')}
      </QuickFact>
      <QuickFact label='Tahmini süre'>
        {formatMetric(research.routeMetrics.expectedHours.value, 'saat')}
      </QuickFact>
      <QuickFact label='Toplam çıkış'>
        {formatMetric(research.routeMetrics.ascentM.value, 'm')}
      </QuickFact>
      <QuickFact label='Toplam iniş'>
        {formatMetric(research.routeMetrics.descentM.value, 'm')}
      </QuickFact>
    </Grid>
  </Card>
)

const SourceLinks = ({ sourceIds }) => (
  <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
      Kaynaklar ve harita
    </Heading>
    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
      Pafta sınırını yürüyüşten önce resmî haritadan yeniden kontrol et. Bu
      sayfadaki metin, kaynakların yerini tutmaz.
    </Text>
    <Box as='ul' sx={{ color: 'article', lineHeight: 1.65, pl: 3, mt: 3, mb: 0 }}>
      {sourceIds.map(sourceId => {
        const source = likya.sourceById[sourceId]

        if (!source) return null

        return (
          <Box as='li' key={source.id} sx={{ mb: 2 }}>
            <Link
              href={source.url}
              target='_blank'
              rel='noopener noreferrer'
              sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
            >
              {source.title} <FaExternalLinkAlt aria-hidden='true' size={10} />
            </Link>
            <Text as='span' sx={{ color: 'omegaDark', fontSize: 0, ml: 1 }}>
              · {source.publisher}
            </Text>
          </Box>
        )
      })}
    </Box>
  </Card>
)

const VerifiedGpsLinks = ({ links }) => {
  const verifiedLinks = links.filter(isVerifiedExternalGpsLink)

  if (verifiedLinks.length === 0) return null

  return (
    <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
      <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
        Doğrulanmış haricî GPS kaydı
      </Heading>
      <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
        Bu bağlantı haricî platformda açılır. İndirmeden önce kayıt tarihi,
        yönü ve seçtiğin varyantı tekrar kontrol et.
      </Text>
      <Box as='ul' sx={{ color: 'article', lineHeight: 1.65, pl: 3, mt: 3, mb: 0 }}>
        {verifiedLinks.map(link => (
          <Box as='li' key={link.url} sx={{ mb: 2 }}>
            <Link
              href={link.url}
              target='_blank'
              rel='noopener noreferrer'
              sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
            >
              Wikiloc kaydını aç <FaExternalLinkAlt aria-hidden='true' size={10} />
            </Link>
            <Text as='span' sx={{ color: 'omegaDark', fontSize: 0, ml: 1 }}>
              · kayıt: {link.recordedAt} · inceleme: {link.reviewedAt}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  )
}

const LikyaPaftaGuidePage = ({ pageContext, ...props }) => {
  const section = likya.routeSectionById[pageContext.sectionId]
  const publicationRecord = likya.paftaPublicationRecords.find(
    record => record.sectionId === section?.id
  )
  const publicationReadiness = likya.buildPaftaPublicationReadiness({
    routeSections: likya.routeSections,
    stageResearchRecords: likya.stageResearchRecords,
    paftaReconciliationReviews: likya.paftaReconciliationReviews,
    officialPaftaObservations: likya.officialPaftaObservations,
    paftaPublicationRecords: likya.paftaPublicationRecords
  })
  const readiness = publicationReadiness.find(item => item.sectionId === section?.id)
  const research = likya.stageResearchRecords.find(
    record => record.id === publicationRecord?.primaryResearchRecordId
  )

  // Dynamic pages are created only after this condition is true. Keeping the
  // guard here prevents stale build artifacts from exposing a withdrawn pafta.
  if (!section || !publicationRecord || !readiness?.canPublish || !research) {
    return null
  }

  const officialSource = likya.sourceById[section.officialMapSourceId]
  const sourceIds = [...new Set([officialSource?.id, ...publicationRecord.sourceIds])]
    .filter(Boolean)
  const pageTitle = `${section.officialTitle} yürüyüş rehberi`

  return (
    <Layout pageContext={pageContext} {...props}>
      <Seo
        title={pageTitle}
        description={publicationRecord.summary}
        keywords={['Likya Yolu', section.officialTitle, 'yürüyüş rehberi']}
      />
      <Divider space={3} />
      <Stack>
        <Main>
          <Box as='article'>
            <Card sx={{ ...surfaceStyle, overflow: 'hidden' }}>
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
                  Likya Yolu · Resmî pafta {section.sequence} · doğrulanmış rehber
                </Text>
                <Heading
                  as='h1'
                  sx={{ ...headingStyle, fontSize: [5, 6], lineHeight: 1.06, m: 0 }}
                >
                  {section.officialTitle}
                </Heading>
                <Text
                  as='p'
                  sx={{
                    color: 'article',
                    fontSize: [2, 3],
                    lineHeight: 1.65,
                    mt: 3,
                    mb: 0,
                    maxWidth: '46rem'
                  }}
                >
                  {publicationRecord.summary}
                </Text>
                <Flex sx={{ gap: 3, flexWrap: 'wrap', mt: 4 }}>
                  <Button
                    as='a'
                    href={officialSource.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    sx={{ ...focusStyle, minHeight: 48 }}
                  >
                    Resmî haritayı aç <FaExternalLinkAlt aria-hidden='true' size={12} />
                  </Button>
                  <Link
                    as={GatsbyLink}
                    to='/likya-yolu-hazirliklari/'
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
                    Hazırlık kontrol listesi <FaArrowRight aria-hidden='true' size={12} />
                  </Link>
                </Flex>
              </Box>
            </Card>

            <Grid
              sx={{
                gridTemplateColumns: ['1fr', null, 'minmax(0, 1fr) minmax(0, 1fr)'],
                gap: 3,
                mt: 4
              }}
            >
              <MetricFacts section={section} research={research} />
              <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                  <FaRoute aria-hidden='true' size={17} />
                  <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
                    Bu paftayı nasıl kullanmalı?
                  </Heading>
                </Flex>
                <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
                  Bir pafta, tek başına sabit bir gün planı değildir. Yürüyüş
                  gününü hava, gün ışığı, taşıdığın yük ve güncel erişim durumuna
                  göre böl; kararını yoldayken yeniden değerlendirebil.
                </Text>
              </Card>
            </Grid>

            <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 3 }}>
              <Flex sx={{ alignItems: 'center', gap: 2 }}>
                <FaMapMarkedAlt aria-hidden='true' size={17} />
                <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
                  Rota bağlamı
                </Heading>
              </Flex>
              <Text as='p' sx={{ color: 'article', lineHeight: 1.7, mt: 3, mb: 0 }}>
                {publicationRecord.routeNarrative}
              </Text>
            </Card>

            <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 3 }}>
              <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
                Karar noktaları
              </Heading>
              <Grid
                sx={{
                  gridTemplateColumns: ['1fr', null, 'repeat(2, minmax(0, 1fr))'],
                  gap: 3,
                  mt: 3
                }}
              >
                {publicationRecord.decisionPoints.map(point => (
                  <Box key={point.title} sx={{ minWidth: 0 }}>
                    <Text as='h3' sx={{ color: 'heading', fontWeight: 'bold', mt: 0, mb: 1 }}>
                      {point.title}
                    </Text>
                    <Text as='p' sx={{ color: 'article', lineHeight: 1.65, m: 0 }}>
                      {point.description}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Card>

            <Box sx={{ display: 'grid', gap: 3, mt: 3 }}>
              <VerifiedGpsLinks links={research.externalGpsLinks || []} />
              <SourceLinks sourceIds={sourceIds} />
              <Card sx={{ ...surfaceStyle, p: [3, 4] }}>
                <LikyaConditionPanel
                  conditions={likya.conditions}
                  sourceById={likya.sourceById}
                  scope={{ routeSectionIds: [section.id] }}
                />
              </Card>
            </Box>

            <Link
              as={GatsbyLink}
              to='/category/rotalar/'
              sx={{
                ...focusStyle,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                minHeight: 48,
                color: 'alpha',
                fontWeight: 'bold',
                mt: 4
              }}
            >
              <FaArrowLeft aria-hidden='true' size={12} /> Tüm rota rehberlerine dön
            </Link>
          </Box>
        </Main>
      </Stack>
    </Layout>
  )
}

export default LikyaPaftaGuidePage
