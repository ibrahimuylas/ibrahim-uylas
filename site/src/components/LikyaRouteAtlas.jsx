import React, { useMemo, useState } from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import { FaArrowRight, FaExternalLinkAlt, FaFilter } from 'react-icons/fa'
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  Text
} from 'theme-ui'
import {
  filterRouteSections,
  regionDetails,
  sectionsByRegion
} from '../content-guides/likya/route-atlas'
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

const defaultFilters = { region: '', search: '' }

const ArchiveImage = ({ region }) => {
  const imageStyle = { height: '100%', width: '100%' }
  const imgStyle = { objectFit: 'cover', objectPosition: 'center' }

  if (region === 'west') {
    return (
      <StaticImage
        src='../../content/posts/diğer/likya-yolu-1-gün/likya-yolu-1-gun-baslangic.jpg'
        alt='Likya Yolu’ndan 2014 yürüyüş arşiv fotoğrafı'
        layout='fullWidth'
        placeholder='blurred'
        formats={['auto', 'webp', 'avif']}
        style={imageStyle}
        imgStyle={imgStyle}
      />
    )
  }

  if (region === 'central') {
    return (
      <StaticImage
        src='../../content/posts/diğer/likya-yolu-6-gün/likya-yolu-6-gun-kalkan.jpg'
        alt='Likya Yolu’ndan 2014 yürüyüş arşiv fotoğrafı'
        layout='fullWidth'
        placeholder='blurred'
        formats={['auto', 'webp', 'avif']}
        style={imageStyle}
        imgStyle={imgStyle}
      />
    )
  }

  return (
    <StaticImage
      src='../../content/posts/diğer/likya-yolu-11-gün/likya-yolu-11-gun-cadir-ucagiz.jpg'
      alt='Likya Yolu’ndan 2014 yürüyüş arşiv fotoğrafı'
      layout='fullWidth'
      placeholder='blurred'
      formats={['auto', 'webp', 'avif']}
      style={imageStyle}
      imgStyle={imgStyle}
    />
  )
}

const RouteCard = ({ section, mapCollectionUrl }) => {
  const hasScope = Boolean(section.start && section.end)
  const title = section.officialTitle.replace(/^Pafta \d+: /, '')

  return (
    <Card
      as='li'
      id={`bolum-${section.sequence}`}
      sx={{
        ...surfaceStyle,
        minWidth: 0,
        overflow: 'hidden',
        scrollMarginTop: 4
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: [156, 176, 196],
          bg: 'omegaLighter',
          overflow: 'hidden'
        }}
      >
        <ArchiveImage region={section.editorialRegion} />
        <Text
          as='span'
          sx={{
            position: 'absolute',
            left: 2,
            bottom: 2,
            px: 2,
            py: 1,
            bg: 'contentBg',
            borderRadius: 'sm',
            color: 'heading',
            fontSize: 0,
            fontWeight: 'bold'
          }}
        >
          2014 arşivinden
        </Text>
      </Box>
      <Box sx={{ p: [3, 4] }}>
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
          Bölüm {String(section.sequence).padStart(2, '0')}
        </Text>
        <Heading as='h4' sx={{ ...headingStyle, fontSize: [2, 3], m: 0 }}>
          {title}
        </Heading>
        <Text as='p' sx={{ color: 'article', lineHeight: 1.6, mt: 2, mb: 0 }}>
          {hasScope
            ? `${section.start} – ${section.end}`
            : 'Bu bölümün başlangıç ve bitiş kapsamı ayrıca doğrulanıyor.'}
        </Text>
        <Text
          as='p'
          sx={{
            color: 'omegaDark',
            fontSize: 0,
            lineHeight: 1.55,
            mt: 2,
            mb: 0
          }}
        >
          Ayrıntılı yürüyüş rehberi ve gün planı için editoryal doğrulama
          sürüyor.
        </Text>
        <Link
          href={mapCollectionUrl || section.officialMapUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            ...focusStyle,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 40,
            color: 'alpha',
            fontSize: 1,
            fontWeight: 'bold',
            mt: 3
          }}
        >
          Haritayı aç <FaExternalLinkAlt aria-hidden='true' size={10} />
        </Link>
      </Box>
    </Card>
  )
}

const RegionFilter = ({ filters, setFilters, location }) => (
  <Box as='fieldset' sx={{ border: 0, p: 0, m: 0 }}>
    <Text as='legend' sx={{ color: 'heading', fontWeight: 'bold', mb: 2 }}>
      Bölge seç
    </Text>
    <Grid
      sx={{
        gridTemplateColumns: [
          'repeat(2, minmax(0, 1fr))',
          null,
          'repeat(4, minmax(0, 1fr))'
        ],
        gap: 2
      }}
    >
      {[
        ['', 'Tümü'],
        ['west', 'Batı Likya'],
        ['central', 'Orta Likya'],
        ['east', 'Doğu Likya']
      ].map(([value, label]) => {
        const isSelected = filters.region === value

        return (
          <Button
            key={label}
            type='button'
            aria-pressed={isSelected}
            onClick={() => {
              setFilters(current => ({ ...current, region: value }))
              trackEvent('likya_atlas_region_open', {
                source_path: location.pathname,
                region: value || 'all'
              })
            }}
            sx={{
              ...focusStyle,
              width: '100%',
              minHeight: 42,
              px: [2, null, 2],
              whiteSpace: 'nowrap',
              color: isSelected ? 'white' : 'heading',
              bg: isSelected ? 'alpha' : 'contentBg',
              border: '1px solid',
              borderColor: isSelected ? 'alpha' : 'omegaLight',
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': {
                  color: isSelected ? 'white' : 'alphaDarker',
                  bg: isSelected ? 'alphaDark' : 'alphaLighter'
                }
              }
            }}
          >
            {label}
          </Button>
        )
      })}
    </Grid>
  </Box>
)

const LikyaRouteAtlas = ({ location, mapCollectionUrl, sections }) => {
  const [filters, setFilters] = useState(defaultFilters)
  const visibleSections = useMemo(
    () => filterRouteSections(sections, filters),
    [filters, sections]
  )
  const groupedSections = useMemo(
    () => sectionsByRegion(visibleSections),
    [visibleSections]
  )
  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const updateFilter = event => {
    const { name, value } = event.target
    setFilters(current => ({ ...current, [name]: value }))
  }

  const clearFilters = () => setFilters(defaultFilters)

  return (
    <Box id='tum-etaplar' as='section' sx={{ mt: [5, 6], scrollMarginTop: 4 }}>
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
        Rota keşfi
      </Text>
      <Heading as='h2' sx={{ ...headingStyle, fontSize: [4, 5], m: 0 }}>
        Likya Yolu’nda nereden yürümek istiyorsun?
      </Heading>
      <Text
        as='p'
        sx={{
          color: 'article',
          fontSize: [2, 3],
          lineHeight: 1.65,
          mt: 3,
          mb: 0,
          maxWidth: '52rem'
        }}
      >
        Bildiğin bir yerden veya bölgeden başla. Bölümler, yolun resmî
        sıralamasını anlamaya yardım eder; yürüyüş gününü planlamak için önce
        yukarıdaki planlayıcıyı kullan.
      </Text>

      <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 4 }}>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <FaFilter aria-hidden='true' size={15} />
          <Heading as='h3' sx={{ ...headingStyle, fontSize: [2, 3], m: 0 }}>
            Bölüm bul
          </Heading>
        </Flex>
        <Grid
          sx={{
            gridTemplateColumns: ['1fr', null, 'minmax(0, 1fr) minmax(0, 1fr)'],
            gap: 3,
            mt: 3
          }}
        >
          <Box>
            <Text
              as='label'
              htmlFor='atlas-search'
              sx={{ color: 'heading', fontWeight: 'bold' }}
            >
              Yer veya bölüm ara
            </Text>
            <Input
              id='atlas-search'
              name='search'
              value={filters.search}
              onChange={updateFilter}
              placeholder='Örn. Patara, Kaş veya 12'
              sx={{ mt: 2 }}
            />
          </Box>
          <RegionFilter
            filters={filters}
            setFilters={setFilters}
            location={location}
          />
        </Grid>
        {activeFilterCount > 0 && (
          <Button
            type='button'
            onClick={clearFilters}
            sx={{
              ...focusStyle,
              minHeight: 40,
              color: 'heading',
              bg: 'contentBg',
              border: '1px solid',
              borderColor: 'omegaLight',
              mt: 3,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { bg: 'omegaLighter', borderColor: 'omegaDark' }
              }
            }}
          >
            Filtreleri temizle
          </Button>
        )}
      </Card>

      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          flexWrap: 'wrap',
          mt: 4
        }}
      >
        <Text role='status' aria-live='polite' sx={{ color: 'article', m: 0 }}>
          {visibleSections.length} bölüm gösteriliyor
        </Text>
        <Link
          href={mapCollectionUrl}
          target='_blank'
          rel='noopener noreferrer'
          sx={{
            ...focusStyle,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            minHeight: 40,
            color: 'alpha',
            fontWeight: 'bold'
          }}
        >
          Resmî haritaları aç <FaExternalLinkAlt aria-hidden='true' size={10} />
        </Link>
      </Flex>

      {visibleSections.length === 0 ? (
        <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 4 }}>
          <Heading as='h3' sx={{ ...headingStyle, fontSize: 3, m: 0 }}>
            Bu aramayla eşleşen bölüm bulunamadı
          </Heading>
          <Text as='p' sx={{ color: 'article', lineHeight: 1.6 }}>
            Yer adını kısaltmayı veya bölge seçimini temizlemeyi dene.
          </Text>
          <Button
            type='button'
            onClick={clearFilters}
            sx={{
              ...focusStyle,
              minHeight: 44,
              color: 'white',
              bg: 'alpha',
              border: 0,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { bg: 'alphaDark' }
              }
            }}
          >
            Tüm bölümleri göster
          </Button>
        </Card>
      ) : (
        groupedSections
          .filter(group => group.sections.length > 0)
          .map(group => (
            <Box key={group.region} as='section' sx={{ mt: 5 }}>
              <Heading
                id={`atlas-${group.region}`}
                tabIndex='-1'
                as='h3'
                sx={{
                  ...headingStyle,
                  fontSize: [3, 4],
                  m: 0,
                  scrollMarginTop: 4
                }}
              >
                {group.label}
              </Heading>
              <Text
                as='p'
                sx={{ color: 'article', lineHeight: 1.6, mt: 2, mb: 0 }}
              >
                {regionDetails[group.region].description}
              </Text>
              <Box
                as='ol'
                sx={{
                  display: 'grid',
                  gridTemplateColumns: [
                    '1fr',
                    null,
                    'repeat(2, minmax(0, 1fr))'
                  ],
                  gap: 3,
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  mt: 3
                }}
              >
                {group.sections.map(section => (
                  <RouteCard
                    key={section.id}
                    section={section}
                    mapCollectionUrl={mapCollectionUrl}
                  />
                ))}
              </Box>
            </Box>
          ))
      )}

      <Link
        as='a'
        href='#planlayici'
        sx={{
          ...focusStyle,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          minHeight: 44,
          color: 'alpha',
          fontWeight: 'bold',
          mt: 5
        }}
      >
        Bana uygun yürüyüşü planla <FaArrowRight aria-hidden='true' size={12} />
      </Link>
    </Box>
  )
}

export default LikyaRouteAtlas
