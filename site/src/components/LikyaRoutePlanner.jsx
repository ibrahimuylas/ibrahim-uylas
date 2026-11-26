import React, { useEffect, useState } from 'react'
import { Link as GatsbyLink } from 'gatsby'
import {
  FaArrowRight,
  FaChevronLeft,
  FaClipboard,
  FaMapMarkedAlt,
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
  recommendRoute,
  requestFromSearch,
  resultSearchParams
} from '../content-guides/likya/route-recommendation'
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

const defaultAnswers = {
  when: null,
  startDate: '',
  month: '',
  duration: null,
  experience: null,
  load: null,
  lodging: null,
  priority: null,
  transport: null,
  solo: null
}

const steps = [
  {
    title: 'Ne zaman yürümek istiyorsun?',
    helper:
      'Bu seçim mevsim uygunluğunu değerlendirir; yola çıkmadan hemen önce hava ve resmî kısıtlamaları ayrıca kontrol et.'
  },
  {
    title: 'Kaç yürüyüş günün var?',
    helper:
      'Yolculuk günlerini değil, gerçekten yürüyebileceğin gün sayısını seç.'
  },
  {
    title: 'Tempon nasıl olsun?',
    helper:
      'Süre, irtifa, zemin ve çanta ağırlığı birlikte değerlendirilir; kilometre tek başına yeterli değildir.'
  },
  {
    title: 'Nasıl bir gezi istiyorsun?',
    helper:
      'Konaklama biçimi ve gezinin karakteri, gerçekten uygulanabilir bir plan bulmak için önemlidir.'
  }
]

const durationOptions = [
  ['3', '3 gün'],
  ['5', '5 gün'],
  ['7', '7 gün'],
  ['10-plus', '10+ gün'],
  ['full', 'Baştan sona']
]

const experienceOptions = [
  ['first-multiday', 'İlk çok günlük yürüyüşüm'],
  ['some-multiday', 'Biraz çok günlük deneyimim var'],
  ['experienced', 'Deneyimliyim']
]

const loadOptions = [
  ['comfortable', 'Kısa ve rahat günler'],
  ['balanced', 'Dengeli tempo'],
  ['demanding', 'Uzun ve zorlayıcı günler']
]

const lodgingOptions = [
  ['camp', 'Kamp'],
  ['pension', 'Pansiyon / işletme'],
  ['mixed', 'Karma']
]

const priorityOptions = [
  ['sea', 'Deniz manzaraları'],
  ['ancient-sites', 'Antik kentler'],
  ['quiet-nature', 'Daha sakin doğa'],
  ['balanced', 'Dengeli']
]

const isStepComplete = (step, answers) => {
  if (step === 1) {
    return Boolean(
      answers.when === 'unknown' ||
      (answers.when === 'date' && answers.startDate) ||
      (answers.when === 'month' && answers.month)
    )
  }
  if (step === 2) return Boolean(answers.duration)
  if (step === 3) return Boolean(answers.experience && answers.load)

  return Boolean(answers.lodging && answers.priority)
}

const isPlannerComplete = answers =>
  [1, 2, 3, 4].every(step => isStepComplete(step, answers))

const RadioCards = ({ legend, name, options, value, onChange }) => (
  <Box as='fieldset' sx={{ border: 0, m: 0, p: 0 }}>
    <Text as='legend' sx={{ color: 'heading', fontWeight: 'bold', mb: 3 }}>
      {legend}
    </Text>
    <Grid
      sx={{
        gridTemplateColumns: ['1fr', 'repeat(2, minmax(0, 1fr))'],
        gap: 2
      }}
    >
      {options.map(([optionValue, label]) => {
        const checked = value === optionValue

        return (
          <Card
            as='label'
            key={optionValue}
            sx={{
              ...focusStyle,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              minHeight: 64,
              cursor: 'pointer',
              p: 3,
              border: '1px solid',
              borderColor: checked ? 'alpha' : 'omegaLight',
              bg: checked ? 'alphaLighter' : 'contentBg',
              borderRadius: 'lg'
            }}
          >
            <Input
              type='radio'
              name={name}
              value={optionValue}
              checked={checked}
              onChange={onChange}
              sx={{ flex: '0 0 auto', mt: 1, width: 18, height: 18 }}
            />
            <Text as='span' sx={{ color: 'heading', fontWeight: 'bold' }}>
              {label}
            </Text>
          </Card>
        )
      })}
    </Grid>
  </Box>
)

const PlannerActions = ({ step, complete, onBack, onNext, onReset }) => (
  <Flex
    sx={{
      flexDirection: ['column-reverse', 'row'],
      justifyContent: 'space-between',
      alignItems: ['stretch', 'center'],
      gap: 2,
      mt: 4
    }}
  >
    <Flex sx={{ gap: 2, flexWrap: 'wrap' }}>
      {step > 1 && (
        <Button
          type='button'
          variant='secondary'
          onClick={onBack}
          sx={{ ...focusStyle, minHeight: 44 }}
        >
          <FaChevronLeft aria-hidden='true' size={13} /> Geri
        </Button>
      )}
      {step > 1 && (
        <Button
          type='button'
          variant='secondary'
          onClick={onReset}
          sx={{ ...focusStyle, minHeight: 44 }}
        >
          <FaRedo aria-hidden='true' size={12} /> Baştan başla
        </Button>
      )}
    </Flex>
    <Button
      type='button'
      disabled={!complete}
      onClick={onNext}
      aria-describedby={`planner-step-${step}-help`}
      sx={{ ...focusStyle, minHeight: 48 }}
    >
      {step === 4 ? 'Önerimi göster' : 'Devam et'}{' '}
      <FaArrowRight aria-hidden='true' size={13} />
    </Button>
  </Flex>
)

const PlanResult = ({ result, onReset, onCopy }) => {
  if (result.status === 'no-match') {
    return (
      <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 4 }} aria-live='polite'>
        <Text as='p' sx={{ color: 'alpha', fontWeight: 'bold', mt: 0 }}>
          Bu cevaplarla net bir plan eşleşmedi
        </Text>
        <Text as='p' sx={{ color: 'article', lineHeight: 1.6 }}>
          {result.recovery}
        </Text>
        <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 3 }}>
          <Button type='button' onClick={onReset} sx={{ ...focusStyle }}>
            Cevaplarımı değiştir
          </Button>
          <Link
            as={GatsbyLink}
            to='/likya-yolu-hazirliklari/'
            sx={{ ...focusStyle, alignSelf: 'center', color: 'alpha' }}
          >
            Hazırlık rehberini aç
          </Link>
          <Link
            as='a'
            href='#tum-etaplar'
            sx={{ ...focusStyle, alignSelf: 'center', color: 'alpha' }}
          >
            Tüm rotaları keşfet
          </Link>
        </Flex>
      </Card>
    )
  }

  const { plan, reasons } = result.primary

  return (
    <Card sx={{ ...surfaceStyle, p: [3, 4], mt: 4 }} aria-live='polite'>
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
        Sana önerilen plan
      </Text>
      <Heading as='h3' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
        {plan.name}
      </Heading>
      <Text as='p' sx={{ color: 'article', lineHeight: 1.6, mt: 2 }}>
        {[
          plan.durationLabel,
          plan.start && plan.end && `${plan.start} – ${plan.end}`
        ]
          .filter(Boolean)
          .join(' · ')}
      </Text>
      <Heading as='h4' sx={{ color: 'heading', fontSize: 2, mt: 4, mb: 2 }}>
        Neden sana uygun?
      </Heading>
      <Box as='ul' sx={{ color: 'article', lineHeight: 1.65, m: 0, pl: 3 }}>
        {reasons.map(reason => (
          <Box as='li' key={reason} sx={{ mt: 1 }}>
            {reason}
          </Box>
        ))}
      </Box>
      {Array.isArray(plan.cautions) && plan.cautions.length > 0 && (
        <>
          <Heading as='h4' sx={{ color: 'heading', fontSize: 2, mt: 4, mb: 2 }}>
            Ne zaman uygun değil?
          </Heading>
          <Box as='ul' sx={{ color: 'article', lineHeight: 1.65, m: 0, pl: 3 }}>
            {plan.cautions.map(caution => (
              <Box as='li' key={caution} sx={{ mt: 1 }}>
                {caution}
              </Box>
            ))}
          </Box>
        </>
      )}
      <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 4 }}>
        <Link
          as={GatsbyLink}
          to={plan.detailPath}
          sx={{
            ...focusStyle,
            alignSelf: 'center',
            color: 'alpha',
            fontWeight: 'bold'
          }}
        >
          Planı ayrıntılı incele <FaArrowRight aria-hidden='true' size={13} />
        </Link>
        <Button
          type='button'
          variant='secondary'
          onClick={onCopy}
          sx={focusStyle}
        >
          <FaClipboard aria-hidden='true' size={13} /> Bağlantıyı kopyala
        </Button>
        <Button
          type='button'
          variant='secondary'
          onClick={onReset}
          sx={focusStyle}
        >
          Cevaplarımı değiştir
        </Button>
      </Flex>
    </Card>
  )
}

const PlanCatalogUnavailable = ({ catalog = {} }) => {
  const requirements = catalog.requirements || []
  const actions = catalog.nextBestActions || []

  return (
    <Box id='planlayici' as='section' sx={{ mt: [5, 6], scrollMarginTop: 4 }}>
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
        Rota seçimi
      </Text>
      <Heading as='h2' sx={{ ...headingStyle, fontSize: [4, 5], m: 0 }}>
        Gün gün planlar henüz doğrulanıyor
      </Heading>
      <Text
        as='p'
        sx={{
          color: 'article',
          fontSize: [2, 3],
          lineHeight: 1.65,
          mt: 3,
          mb: 0,
          maxWidth: '48rem'
        }}
      >
        {catalog.summary ||
          'Yayıma uygun bir Likya planı henüz yok. Resmî paftaları ve hazırlık rehberini kullanarak kendi araştırmana başlayabilirsin.'}
      </Text>

      <Card sx={{ ...surfaceStyle, maxWidth: '52rem', mt: 4, p: [3, 4] }}>
        <Text as='p' sx={{ color: 'heading', fontWeight: 'bold', mt: 0 }}>
          Planın yayımlanabilmesi için
        </Text>
        <Box
          as='ul'
          sx={{ color: 'article', lineHeight: 1.65, m: 0, mt: 3, pl: 3 }}
        >
          {requirements.map(requirement => (
            <Box as='li' key={requirement} sx={{ mt: 2 }}>
              {requirement}
            </Box>
          ))}
        </Box>
        <Flex sx={{ gap: 2, flexWrap: 'wrap', mt: 4 }}>
          {actions.map(action =>
            action.href.startsWith('/') ? (
              <Link
                key={action.href}
                as={GatsbyLink}
                to={action.href}
                sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
              >
                {action.label} <FaArrowRight aria-hidden='true' size={13} />
              </Link>
            ) : (
              <Link
                key={action.href}
                href={action.href}
                sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
              >
                {action.label} <FaArrowRight aria-hidden='true' size={13} />
              </Link>
            )
          )}
        </Flex>
      </Card>
    </Box>
  )
}

const LikyaRoutePlanner = ({ location, plans = [], catalog }) => {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState(defaultAnswers)
  const [result, setResult] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')
  const plannerAvailable = plans.some(
    plan =>
      plan.publicationStatus === 'published' &&
      plan.planningEligibility === 'eligible'
  )

  const complete = isStepComplete(step, answers)
  const activeStep = steps[step - 1]
  useEffect(() => {
    const restored = requestFromSearch(location?.search)

    if (!restored.duration) return

    setAnswers(current => ({ ...current, ...restored }))
    setStep(4)

    if (!isPlannerComplete(restored)) return

    const restoredResult = recommendRoute({ plans, request: restored })
    const isRetiredPlan =
      restored.planId && restoredResult.primary?.plan.id !== restored.planId

    if (isRetiredPlan) {
      setCopyStatus(
        'Bu bağlantıdaki plan artık güncel değil. Cevaplarınla yeni bir öneri oluşturabilirsin.'
      )
      return
    }

    setResult(restoredResult)
  }, [location?.search, plans])

  const updateAnswer = event => {
    const { name, value } = event.target
    setAnswers(current => ({ ...current, [name]: value }))
  }

  const reset = () => {
    setAnswers(defaultAnswers)
    setStep(1)
    setResult(null)
    setCopyStatus('')
    trackEvent('likya_planner_restart', { source_path: location.pathname })
  }

  const showResult = () => {
    const nextResult = recommendRoute({ plans, request: answers })
    const search = resultSearchParams(answers, {
      planId: nextResult.primary?.plan.id
    })

    setResult(nextResult)
    if (typeof window !== 'undefined') {
      window.history.replaceState(
        {},
        '',
        `${location.pathname}${search ? `?${search}` : ''}#planlayici`
      )
    }
    trackEvent('likya_planner_result', {
      source_path: location.pathname,
      result_status: nextResult.status,
      plan_id: nextResult.primary?.plan.id || null,
      duration: answers.duration
    })
  }

  const next = () => {
    if (!complete) {
      trackEvent('likya_planner_validation_failure', {
        source_path: location.pathname,
        step
      })
      return
    }
    if (step === 4) {
      showResult()
      return
    }

    trackEvent('likya_planner_step_complete', {
      source_path: location.pathname,
      step,
      duration: answers.duration
    })
    setStep(current => current + 1)
  }

  const copyResultLink = async () => {
    const search = resultSearchParams(answers, {
      includeExactDate: true,
      planId: result?.primary?.plan.id
    })
    const url = `${window.location.origin}${location.pathname}?${search}`

    try {
      await window.navigator.clipboard.writeText(url)
      setCopyStatus('Bağlantı kopyalandı.')
      trackEvent('likya_planner_share', { source_path: location.pathname })
    } catch {
      setCopyStatus(
        'Bağlantı kopyalanamadı; tarayıcının adres çubuğundaki bağlantıyı kullanabilirsin.'
      )
    }
  }

  if (!plannerAvailable) {
    return <PlanCatalogUnavailable catalog={catalog} />
  }

  return (
    <Box id='planlayici' as='section' sx={{ mt: [5, 6], scrollMarginTop: 4 }}>
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
        Rota seçimi
      </Text>
      <Heading as='h2' sx={{ ...headingStyle, fontSize: [4, 5], m: 0 }}>
        Nereden başlamalıyım?
      </Heading>
      <Text
        as='p'
        sx={{
          color: 'article',
          fontSize: [2, 3],
          lineHeight: 1.65,
          mt: 3,
          mb: 0,
          maxWidth: '48rem'
        }}
      >
        Dört kısa cevapla, editoryal olarak doğrulanmış planlar arasından sana
        uygun başlangıcı bul.
      </Text>

      <Card sx={{ ...surfaceStyle, maxWidth: '52rem', mt: 4, p: [3, 4] }}>
        {!result && (
          <>
            <Flex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
                flexWrap: 'wrap',
                mb: 3
              }}
            >
              <Text as='p' sx={{ color: 'heading', fontWeight: 'bold', m: 0 }}>
                Adım {step} / 4
              </Text>
              <Box
                role='progressbar'
                aria-label='Rota seçimi ilerlemesi'
                aria-valuemin={1}
                aria-valuemax={4}
                aria-valuenow={step}
                sx={{
                  width: [120, 160],
                  height: 8,
                  bg: 'omegaLight',
                  borderRadius: 'full',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    width: `${(step / 4) * 100}%`,
                    height: '100%',
                    bg: 'alpha'
                  }}
                />
              </Box>
            </Flex>
            <Heading as='h3' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
              {activeStep.title}
            </Heading>
            <Text
              id={`planner-step-${step}-help`}
              as='p'
              sx={{ color: 'article', lineHeight: 1.6, mt: 2, mb: 4 }}
            >
              {activeStep.helper}
            </Text>

            {step === 1 && (
              <Box as='fieldset' sx={{ border: 0, m: 0, p: 0 }}>
                <Text
                  as='legend'
                  sx={{ color: 'heading', fontWeight: 'bold', mb: 3 }}
                >
                  Çıkış zamanın
                </Text>
                <Grid sx={{ gap: 2 }}>
                  <Card as='label' sx={{ ...surfaceStyle, p: 3 }}>
                    <Input
                      type='radio'
                      name='when'
                      value='date'
                      checked={answers.when === 'date'}
                      onChange={updateAnswer}
                    />
                    <Text
                      as='span'
                      sx={{ color: 'heading', fontWeight: 'bold', ml: 2 }}
                    >
                      Yaklaşık tarih biliyorum
                    </Text>
                    <Input
                      type='date'
                      name='startDate'
                      value={answers.startDate}
                      disabled={answers.when !== 'date'}
                      onChange={updateAnswer}
                      sx={{ display: 'block', mt: 3, maxWidth: 240 }}
                    />
                  </Card>
                  <Card as='label' sx={{ ...surfaceStyle, p: 3 }}>
                    <Input
                      type='radio'
                      name='when'
                      value='month'
                      checked={answers.when === 'month'}
                      onChange={updateAnswer}
                    />
                    <Text
                      as='span'
                      sx={{ color: 'heading', fontWeight: 'bold', ml: 2 }}
                    >
                      Ayı biliyorum
                    </Text>
                    <Box
                      as='select'
                      name='month'
                      value={answers.month}
                      disabled={answers.when !== 'month'}
                      onChange={updateAnswer}
                      sx={{
                        display: 'block',
                        width: '100%',
                        maxWidth: 240,
                        mt: 3,
                        p: 2,
                        borderColor: 'omegaLight',
                        borderRadius: 'sm',
                        bg: 'contentBg'
                      }}
                    >
                      <option value=''>Ay seç</option>
                      {[
                        'Ocak',
                        'Şubat',
                        'Mart',
                        'Nisan',
                        'Mayıs',
                        'Haziran',
                        'Temmuz',
                        'Ağustos',
                        'Eylül',
                        'Ekim',
                        'Kasım',
                        'Aralık'
                      ].map((month, index) => (
                        <option key={month} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </Box>
                  </Card>
                  <Card as='label' sx={{ ...surfaceStyle, p: 3 }}>
                    <Input
                      type='radio'
                      name='when'
                      value='unknown'
                      checked={answers.when === 'unknown'}
                      onChange={updateAnswer}
                    />
                    <Text
                      as='span'
                      sx={{ color: 'heading', fontWeight: 'bold', ml: 2 }}
                    >
                      Henüz bilmiyorum
                    </Text>
                  </Card>
                </Grid>
              </Box>
            )}
            {step === 2 && (
              <RadioCards
                legend='Yürüyüş günü sayısı'
                name='duration'
                options={durationOptions}
                value={answers.duration}
                onChange={updateAnswer}
              />
            )}
            {step === 3 && (
              <Grid
                sx={{
                  gridTemplateColumns: [
                    '1fr',
                    null,
                    'repeat(2, minmax(0, 1fr))'
                  ],
                  gap: 4
                }}
              >
                <RadioCards
                  legend='Deneyimin'
                  name='experience'
                  options={experienceOptions}
                  value={answers.experience}
                  onChange={updateAnswer}
                />
                <RadioCards
                  legend='Tercih ettiğin tempo'
                  name='load'
                  options={loadOptions}
                  value={answers.load}
                  onChange={updateAnswer}
                />
              </Grid>
            )}
            {step === 4 && (
              <Grid
                sx={{
                  gridTemplateColumns: [
                    '1fr',
                    null,
                    'repeat(2, minmax(0, 1fr))'
                  ],
                  gap: 4
                }}
              >
                <RadioCards
                  legend='Konaklama'
                  name='lodging'
                  options={lodgingOptions}
                  value={answers.lodging}
                  onChange={updateAnswer}
                />
                <RadioCards
                  legend='Gezi önceliğin'
                  name='priority'
                  options={priorityOptions}
                  value={answers.priority}
                  onChange={updateAnswer}
                />
              </Grid>
            )}
            <PlannerActions
              step={step}
              complete={complete}
              onBack={() => setStep(current => current - 1)}
              onNext={next}
              onReset={reset}
            />
          </>
        )}
        {result && (
          <PlanResult result={result} onReset={reset} onCopy={copyResultLink} />
        )}
        {copyStatus && (
          <Text
            as='p'
            role='status'
            sx={{ color: 'article', fontSize: 1, mt: 3, mb: 0 }}
          >
            {copyStatus}
          </Text>
        )}
      </Card>

      <Flex sx={{ alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 3 }}>
        <FaMapMarkedAlt aria-hidden='true' size={16} />
        <Link
          as='a'
          href='#tum-etaplar'
          sx={{ ...focusStyle, color: 'alpha', fontWeight: 'bold' }}
        >
          Karar vermeden tüm etapları kendim incelemek istiyorum
        </Link>
      </Flex>
    </Box>
  )
}

export default LikyaRoutePlanner
