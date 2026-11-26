import React, { useMemo, useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  FaArrowRight,
  FaCheck,
  FaChevronDown,
  FaClipboard,
  FaPrint,
  FaRedo
} from 'react-icons/fa'
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
  checklistItems,
  historicalArchiveLinks,
  preparationTopics
} from '../content-guides/likya/preparation-center'
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

const defaultContext = {
  lodging: 'mixed',
  duration: '5',
  season: 'spring',
  companion: 'solo'
}

const contextOptions = {
  lodging: [
    ['camp', 'Kamp'],
    ['pension', 'Pansiyon'],
    ['mixed', 'Karma']
  ],
  duration: [
    ['3', '3 gün'],
    ['5', '5 gün'],
    ['7', '7 gün'],
    ['full', 'Baştan sona']
  ],
  season: [
    ['spring', 'İlkbahar'],
    ['summer', 'Yaz'],
    ['autumn', 'Sonbahar'],
    ['winter', 'Kış']
  ],
  companion: [
    ['solo', 'Tek başıma'],
    ['group', 'Grup']
  ]
}

const matchesContext = (item, context) =>
  item.universal ||
  ((item.lodgingModes?.includes(context.lodging) ?? true) &&
    (item.durationBands?.includes(context.duration) ?? true) &&
    (item.seasonBands?.includes(context.season) ?? true) &&
    (item.companionModes?.includes(context.companion) ?? true))

const isInternalLink = href => href.startsWith('/')

const PreparationTopicCard = ({ topic, index }) => (
  <Card
    as='article'
    id={topic.id}
    sx={{
      ...surfaceStyle,
      display: 'flex',
      flexDirection: 'column',
      flex: ['0 0 min(22rem, 84vw)', null, 'auto'],
      minWidth: 0,
      scrollSnapAlign: 'start',
      p: [3, 4]
    }}
  >
    <Flex
      as='p'
      sx={{
        alignItems: 'center',
        gap: 2,
        color: 'alpha',
        fontSize: 0,
        fontWeight: 'bold',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        mt: 0,
        mb: 2
      }}
    >
      <Flex
        as='span'
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
          width: 28,
          height: 28,
          borderRadius: 'full',
          bg: 'heading',
          color: 'contentBg',
          fontSize: 0,
          letterSpacing: 0
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </Flex>
      Hazırlık adımı
    </Flex>
    <Heading
      as='h3'
      sx={{
        ...headingStyle,
        fontSize: [2, 3],
        minHeight: [0, null, '2.8rem'],
        m: 0
      }}
    >
      {topic.title}
    </Heading>
    <Box
      as='ul'
      sx={{
        color: 'article',
        fontSize: 1,
        lineHeight: 1.6,
        minHeight: [0, null, '12rem'],
        m: 0,
        mt: 3,
        pl: 3
      }}
    >
      {topic.shortAnswer.slice(0, 3).map(item => (
        <Box as='li' key={item} sx={{ mt: 1 }}>
          {item}
        </Box>
      ))}
    </Box>
    <Box as='details' sx={{ mt: 4 }}>
      <Box
        as='summary'
        sx={{
          ...focusStyle,
          color: 'heading',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Yola çıkmadan önce
      </Box>
      <Box
        as='ol'
        sx={{
          color: 'article',
          fontSize: 1,
          lineHeight: 1.6,
          m: 0,
          mt: 3,
          pl: 3
        }}
      >
        {topic.apply.map(item => (
          <Box as='li' key={item} sx={{ mt: 2 }}>
            {item}
          </Box>
        ))}
      </Box>
    </Box>
    {topic.deepLinks.length > 0 && (
      <Flex sx={{ gap: 3, flexWrap: 'wrap', mt: 'auto', pt: 4 }}>
        {topic.deepLinks.map(link =>
          isInternalLink(link.href) ? (
            <Link
              key={link.href}
              as={GatsbyLink}
              to={link.href}
              sx={{
                ...focusStyle,
                color: 'alpha',
                fontSize: 1,
                fontWeight: 'bold'
              }}
            >
              {link.label} <FaArrowRight aria-hidden='true' size={12} />
            </Link>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              sx={{
                ...focusStyle,
                color: 'alpha',
                fontSize: 1,
                fontWeight: 'bold'
              }}
            >
              {link.label} <FaArrowRight aria-hidden='true' size={12} />
            </Link>
          )
        )}
      </Flex>
    )}
  </Card>
)

const ContextSelect = ({ label, name, value, onSelect }) => {
  const selectedLabel = contextOptions[name].find(
    ([optionValue]) => optionValue === value
  )?.[1]

  return (
    <Box>
      <Text
        as='p'
        id={`checklist-${name}`}
        sx={{ color: 'heading', fontWeight: 'bold', m: 0 }}
      >
        {label}
      </Text>
      <Box
        as='details'
        sx={{
          mt: 2,
          position: 'relative',
          '&[open] summary': {
            borderColor: 'alpha',
            boxShadow: theme => `0 0 0 2px ${theme.colors.alphaLighter}`
          }
        }}
      >
        <Box
          as='summary'
          aria-labelledby={`checklist-${name}`}
          sx={{
            ...focusStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            minHeight: 48,
            px: 3,
            border: '1px solid',
            borderColor: 'omegaLight',
            borderRadius: 'sm',
            bg: 'contentBg',
            color: 'heading',
            cursor: 'pointer',
            listStyle: 'none',
            '&::-webkit-details-marker': { display: 'none' }
          }}
        >
          {selectedLabel}
          <FaChevronDown aria-hidden='true' size={13} />
        </Box>
        <Box
          role='group'
          aria-label={`${label} seçenekleri`}
          sx={{
            position: 'absolute',
            zIndex: 2,
            left: 0,
            right: 0,
            display: 'grid',
            gap: 1,
            mt: 1,
            p: 1,
            bg: 'contentBg',
            border: '1px solid',
            borderColor: 'omegaLight',
            borderRadius: 'sm',
            boxShadow: theme => `0 16px 32px -24px ${theme.colors.omegaDarker}`
          }}
        >
          {contextOptions[name].map(([optionValue, optionLabel]) => {
            const isSelected = optionValue === value

            return (
              <Button
                key={optionValue}
                type='button'
                onClick={() => onSelect(name, optionValue)}
                sx={{
                  ...focusStyle,
                  justifyContent: 'flex-start',
                  minHeight: 42,
                  px: 2,
                  py: 1,
                  color: isSelected ? 'white' : 'heading',
                  bg: isSelected ? 'alpha' : 'transparent',
                  border: 0,
                  borderRadius: 'sm',
                  fontSize: 1,
                  fontWeight: isSelected ? 'bold' : 'normal',
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': {
                      bg: isSelected ? 'alphaDark' : 'alphaLighter'
                    }
                  }
                }}
              >
                {isSelected ? '✓ ' : ''}
                {optionLabel}
              </Button>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

const ChecklistFallback = () => (
  <noscript>
    <div>
      <p>JavaScript kapalıyken evrensel hazırlık maddeleri gösterilir.</p>
      <ul>
        {checklistItems
          .filter(item => item.universal)
          .map(item => (
            <li key={item.id}>{item.label}</li>
          ))}
      </ul>
      <p>
        Konaklama biçimine göre:{' '}
        <a href='#konaklama'>kamp, pansiyon ve karma kalış rehberi</a>
      </p>
    </div>
  </noscript>
)

const LikyaPreparationChecklist = ({ location }) => {
  const [context, setContext] = useState(defaultContext)
  const [checked, setChecked] = useState({})
  const [status, setStatus] = useState('')
  const visibleItems = useMemo(
    () => checklistItems.filter(item => matchesContext(item, context)),
    [context]
  )
  const checkedCount = visibleItems.filter(item => checked[item.id]).length
  const generatedDate = new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'long'
  }).format(new Date())

  const persist = (nextContext, nextChecked) => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      'likya-preparation-checklist-v1',
      JSON.stringify({ context: nextContext, checked: nextChecked })
    )
  }

  const updateContext = (name, value) => {
    const nextContext = { ...context, [name]: value }
    setContext(nextContext)
    persist(nextContext, checked)
    setStatus(
      'Kontrol listesi seçimine göre güncellendi ve bu cihazda saklandı.'
    )
    trackEvent('likya_preparation_context_change', {
      source_path: location.pathname,
      field: name,
      value
    })
  }

  const toggleItem = event => {
    const nextChecked = {
      ...checked,
      [event.target.name]: event.target.checked
    }
    setChecked(nextChecked)
    persist(context, nextChecked)
    setStatus('Kontrol listesi bu cihazda saklandı.')
  }

  const clearAll = () => {
    setChecked({})
    persist(context, {})
    setStatus('Tüm işaretler temizlendi.')
  }

  const copyChecklist = async () => {
    const text = [
      'Likya Yolu hazırlık kontrol listesi',
      `Seçim: ${contextOptions.lodging.find(item => item[0] === context.lodging)[1]} · ${contextOptions.duration.find(item => item[0] === context.duration)[1]} · ${contextOptions.season.find(item => item[0] === context.season)[1]} · ${contextOptions.companion.find(item => item[0] === context.companion)[1]}`,
      ...visibleItems.map(
        item => `${checked[item.id] ? '✓' : '○'} ${item.label}`
      ),
      `Oluşturulma tarihi: ${generatedDate}`
    ].join('\n')

    try {
      await window.navigator.clipboard.writeText(text)
      setStatus('Kontrol listesi kopyalandı.')
      trackEvent('likya_preparation_checklist_copy', {
        source_path: location.pathname
      })
    } catch {
      setStatus('Liste kopyalanamadı; yazdır görünümünü kullanabilirsin.')
    }
  }

  return (
    <Card
      id='hazirlik-kontrol-listesi'
      sx={{
        ...surfaceStyle,
        mt: 5,
        p: [3, 4],
        '@media print': {
          borderColor: 'black',
          boxShadow: 'none',
          '& .likya-checklist-actions': { display: 'none' }
        }
      }}
    >
      <Text
        as='p'
        sx={{ color: 'alpha', fontSize: 0, fontWeight: 'bold', mt: 0, mb: 2 }}
      >
        Etkileşimli kontrol listesi
      </Text>
      <Heading as='h3' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
        Çantayı ve kararlarını kendi yürüyüşüne göre gözden geçir
      </Heading>
      <Text as='p' sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}>
        Önce yürüyüşünün çerçevesini seç. Sonra yalnızca sana uygun hazırlık
        maddelerini tek tek tamamla; bittiğinde listeyi yanında taşıyabilirsin.
      </Text>
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', null, 'repeat(2, minmax(0, 1fr))'],
          gap: 3,
          mt: 4
        }}
      >
        <ContextSelect
          label='Konaklama'
          name='lodging'
          value={context.lodging}
          onSelect={updateContext}
        />
        <ContextSelect
          label='Yürüyüş günü'
          name='duration'
          value={context.duration}
          onSelect={updateContext}
        />
        <ContextSelect
          label='Dönem'
          name='season'
          value={context.season}
          onSelect={updateContext}
        />
        <ContextSelect
          label='Yürüyüş biçimi'
          name='companion'
          value={context.companion}
          onSelect={updateContext}
        />
      </Grid>
      <Text as='p' sx={{ color: 'article', fontSize: 1, mt: 4, mb: 2 }}>
        Hazırlık ilerlemen: {checkedCount} / {visibleItems.length} madde
        tamamlandı
      </Text>
      <Box as='ul' sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {visibleItems.map(item => {
          const isChecked = Boolean(checked[item.id])

          return (
            <Card
              as='li'
              key={item.id}
              sx={{
                ...surfaceStyle,
                bg: isChecked ? 'alphaLighter' : 'contentBg',
                borderColor: isChecked ? 'alpha' : 'omegaLight',
                mt: 2,
                p: 0,
                '@media print': { borderColor: 'black', boxShadow: 'none' }
              }}
            >
              <Box
                as='label'
                sx={{
                  ...focusStyle,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  minHeight: 48,
                  cursor: 'pointer',
                  p: 3
                }}
              >
                <Input
                  type='checkbox'
                  name={item.id}
                  checked={isChecked}
                  onChange={toggleItem}
                  sx={{ flex: '0 0 auto', width: 20, height: 20, mt: 1 }}
                />
                <Text
                  as='span'
                  sx={{
                    color: 'heading',
                    fontWeight: isChecked ? 'bold' : 'normal',
                    lineHeight: 1.55
                  }}
                >
                  {isChecked && <FaCheck aria-hidden='true' size={12} />}{' '}
                  {item.label}
                </Text>
              </Box>
            </Card>
          )
        })}
      </Box>
      <Flex
        className='likya-checklist-actions'
        sx={{ gap: 2, flexWrap: 'wrap', mt: 4 }}
      >
        <Button
          type='button'
          onClick={clearAll}
          sx={{
            ...focusStyle,
            minHeight: 48,
            color: 'heading',
            bg: 'contentBg',
            border: '1px solid',
            borderColor: 'omegaLight',
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { bg: 'omegaLighter', borderColor: 'omegaDark' }
            }
          }}
        >
          <FaRedo aria-hidden='true' size={12} /> Tümünü temizle
        </Button>
        <Button
          type='button'
          onClick={copyChecklist}
          sx={{
            ...focusStyle,
            minHeight: 48,
            color: 'heading',
            bg: 'contentBg',
            border: '1px solid',
            borderColor: 'omegaLight',
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { bg: 'omegaLighter', borderColor: 'omegaDark' }
            }
          }}
        >
          <FaClipboard aria-hidden='true' size={12} /> Listeyi kopyala
        </Button>
        <Button
          type='button'
          onClick={() => window.print()}
          sx={{
            ...focusStyle,
            minHeight: 48,
            color: 'heading',
            bg: 'contentBg',
            border: '1px solid',
            borderColor: 'omegaLight',
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { bg: 'omegaLighter', borderColor: 'omegaDark' }
            }
          }}
        >
          <FaPrint aria-hidden='true' size={12} /> Yazdır
        </Button>
      </Flex>
      <Text as='p' sx={{ color: 'omegaDark', fontSize: 0, mt: 3, mb: 0 }}>
        Yazdırılan kontrol listesi: {generatedDate}. Değişken rota ve koşul
        bilgilerini yola çıkmadan hemen önce yeniden doğrula.
      </Text>
      {status && (
        <Text
          as='p'
          role='status'
          sx={{ color: 'article', fontSize: 1, mt: 3, mb: 0 }}
        >
          {status}
        </Text>
      )}
      <ChecklistFallback />
    </Card>
  )
}

const LikyaPreparationCenter = ({ location }) => (
  <Box
    id='hazirlik-merkezi'
    as='section'
    sx={{ mt: [5, 6], scrollMarginTop: 4 }}
  >
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
      Hazırlık merkezi
    </Text>
    <Heading as='h2' sx={{ ...headingStyle, fontSize: [4, 5], m: 0 }}>
      Nasıl hazırlanmalı, yanıma ne almalıyım?
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
      Hazırlığı sırayla kur: önce vücudunu ve çantanı dene, sonra yön bulma,
      konaklama ve gün sonu planını tamamla. Her kartın altında, o konuyu
      pratiğe dökmek için kısa bir sonraki adım var.
    </Text>
    <Box
      sx={{
        display: ['flex', null, 'grid'],
        gridTemplateColumns: [null, null, 'repeat(2, minmax(0, 1fr))'],
        gap: 3,
        mt: 4,
        overflowX: ['auto', null, 'visible'],
        scrollSnapType: ['x mandatory', null, 'none'],
        scrollPaddingInline: [3, null, 0],
        mx: [-3, null, 0],
        px: [3, null, 0],
        pb: [2, null, 0]
      }}
    >
      {preparationTopics.map((topic, index) => (
        <PreparationTopicCard key={topic.id} topic={topic} index={index} />
      ))}
    </Box>
    <LikyaPreparationChecklist location={location} />
    <Card sx={{ ...surfaceStyle, mt: 5, p: [3, 4] }}>
      <Text
        as='p'
        sx={{ color: 'alpha', fontSize: 0, fontWeight: 'bold', mt: 0, mb: 2 }}
      >
        Benim 2014 deneyimim
      </Text>
      <Heading as='h3' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
        2014’te nasıl hazırlandım?
      </Heading>
      <Box
        as='ul'
        sx={{ color: 'article', lineHeight: 1.65, m: 0, mt: 3, pl: 3 }}
      >
        {historicalArchiveLinks.map(link => (
          <Box as='li' key={link.href} sx={{ mt: 2 }}>
            <Link
              as={GatsbyLink}
              to={link.href}
              sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
            >
              {link.label}
            </Link>{' '}
            <Text as='span' sx={{ fontSize: 1 }}>
              — {link.note}
            </Text>
          </Box>
        ))}
      </Box>
    </Card>
  </Box>
)

export default LikyaPreparationCenter
