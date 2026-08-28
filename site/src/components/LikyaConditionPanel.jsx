import React from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Box, Card, Grid, Heading, Link, Text } from 'theme-ui'
import { conditionRowsForScope } from '../content-guides/likya/condition-status'

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

const readableDate = value => {
  if (!value) return null

  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long' }).format(
    new Date(`${value.slice(0, 10)}T12:00:00`)
  )
}

const ConditionDates = ({ row }) => {
  const dates = [
    row.checkedAt && ['Kaynak kontrolü', row.checkedAt],
    row.observedAt && ['Saha gözlemi', row.observedAt],
    row.effectiveFrom && ['Yürürlük başlangıcı', row.effectiveFrom],
    row.effectiveTo && ['Yürürlük bitişi', row.effectiveTo],
    row.reviewDueAt && ['Sonraki inceleme', row.reviewDueAt]
  ].filter(Boolean)

  if (dates.length === 0) {
    return (
      <Text as='p' sx={{ color: 'omegaDark', fontSize: 0, mt: 2, mb: 0 }}>
        Kayıt tarihi yok; {row.replacementCheck}
      </Text>
    )
  }

  return (
    <Box
      as='dl'
      sx={{ color: 'omegaDark', fontSize: 0, lineHeight: 1.5, m: 0, mt: 3 }}
    >
      {dates.map(([label, value]) => (
        <Box key={label} sx={{ display: 'inline' }}>
          <Text as='dt' sx={{ display: 'inline', fontWeight: 'bold' }}>
            {label}:{' '}
          </Text>
          <Text as='dd' sx={{ display: 'inline', m: 0, mr: 2 }}>
            {readableDate(value)}
          </Text>
        </Box>
      ))}
    </Box>
  )
}

const ConditionRow = ({ row, compact }) => (
  <Card sx={{ ...surfaceStyle, minWidth: 0, p: 3 }}>
    <Text as='p' sx={{ color: 'heading', fontWeight: 'bold', mt: 0, mb: 1 }}>
      {row.category}
    </Text>
    <Text
      as='p'
      sx={{ color: 'alpha', fontSize: 1, fontWeight: 'bold', mt: 0, mb: 0 }}
    >
      {row.statusLabel}
    </Text>
    {!compact && (
      <Text
        as='p'
        sx={{ color: 'article', fontSize: 1, lineHeight: 1.6, mt: 2, mb: 0 }}
      >
        {row.summary}
      </Text>
    )}
    {!compact && <ConditionDates row={row} />}
    <Link
      href={row.sourceUrl}
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
        mt: compact ? 2 : 3,
        wordBreak: 'break-word'
      }}
    >
      Kaynağı aç <FaExternalLinkAlt aria-hidden='true' size={10} />
    </Link>
  </Card>
)

const LikyaConditionPanel = ({
  conditions,
  sourceById,
  scope,
  title = 'Yola çıkmadan kontrol et',
  compact = false,
  buildDate = new Date().toISOString().slice(0, 10)
}) => {
  const rows = conditionRowsForScope({
    conditions,
    scope,
    sourceById,
    buildDate
  })

  return (
    <Box as='section' aria-label={title}>
      {!compact && (
        <>
          <Heading as='h2' sx={{ ...headingStyle, fontSize: [3, 4], m: 0 }}>
            {title}
          </Heading>
          <Text
            as='p'
            sx={{ color: 'article', lineHeight: 1.65, mt: 3, mb: 0 }}
          >
            Bu panel bir canlı güvenlik hizmeti değildir. Kayıt yoksa rota
            güvenli, açık veya hizmetlerin çalışır olduğu sonucu çıkarılmaz.
          </Text>
        </>
      )}
      <Grid
        sx={{
          gridTemplateColumns: compact
            ? ['1fr', null, 'repeat(2, minmax(0, 1fr))']
            : ['1fr', null, 'repeat(2, minmax(0, 1fr))'],
          gap: 3,
          mt: compact ? 0 : 4
        }}
      >
        {rows.map(row => (
          <ConditionRow key={row.id} row={row} compact={compact} />
        ))}
      </Grid>
    </Box>
  )
}

export default LikyaConditionPanel
