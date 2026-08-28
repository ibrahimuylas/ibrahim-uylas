const { hasEligibleResearchEvidence } = require('./stage-research')
const { sourceById } = require('./sources')
const {
  buildPaftaReconciliationReviewIndex,
  buildPaftaReviewHistoryIndex
} = require('./pafta-reconciliation-reviews')

const reconciliationChecks = [
  'official-boundary',
  'endpoint-and-direction',
  'route-variant',
  'independent-corroboration',
  'navigation-link',
  'practical-stage-decision'
]

const externalMatchStatus = records => {
  const links = records.flatMap(record => record.externalGpsLinks || [])

  if (links.some(link => link.routeMatchStatus === 'verified')) {
    return 'verified-external-match'
  }
  if (links.some(link => link.routeMatchStatus === 'candidate')) {
    return 'candidate-external-match'
  }
  if (links.some(link => link.routeMatchStatus === 'rejected')) {
    return 'rejected-external-match'
  }

  return 'no-external-match'
}

const reconciliationStatusFor = records => {
  if (records.some(hasEligibleResearchEvidence)) return 'evidence-complete'

  const matchStatus = externalMatchStatus(records)

  if (matchStatus === 'candidate-external-match') return 'candidate-review'
  if (matchStatus === 'verified-external-match')
    return 'facts-and-rights-review'
  if (matchStatus === 'rejected-external-match') return 'blocked'

  return 'unmapped'
}

const checkStatusFor = ({ checkId, status, records }) => {
  if (status === 'evidence-complete') return 'complete'

  const matchStatus = externalMatchStatus(records)

  if (checkId === 'navigation-link') {
    return matchStatus === 'verified-external-match'
      ? 'complete'
      : matchStatus === 'candidate-external-match'
        ? 'candidate'
        : 'required'
  }

  return 'required'
}

const nextActionFor = status => {
  switch (status) {
    case 'candidate-review':
      return 'Aday izi resmî pafta üzerinde başlangıç, bitiş, yön ve varyant açısından elle karşılaştır.'
    case 'facts-and-rights-review':
      return 'Dış navigasyon eşleşmesi doğrulandı; operasyonel gerçekleri, ikinci kaynağı ve yayın uygunluğunu tamamla.'
    case 'official-match-reviewed':
      return 'Resmî pafta eşleşmesi kaydedildi; navigasyon bağlantısı, rota metrikleri ve operasyonel gerçekler için ayrı kanıt topla.'
    case 'blocked':
      return 'Reddedilen adayı kullanma; yeni, doğrudan eşleşen bir kaynak ara.'
    case 'evidence-complete':
      return 'İkinci editör incelemesine ve yayın kapısı kontrolüne gönder.'
    default:
      return 'Önce resmî pafta referansını incele; tahmine dayalı etap eşleştirmesi yapma.'
  }
}

const buildOfficialPaftaReconciliationQueue = ({
  routeSections = [],
  stageResearchRecords = [],
  paftaReconciliationReviews = [],
  officialPaftaObservations = [],
  sourcesById = sourceById
} = {}) => {
  const completedReviews = buildPaftaReconciliationReviewIndex(
    paftaReconciliationReviews
  )
  const reviewHistory = buildPaftaReviewHistoryIndex(paftaReconciliationReviews)

  return routeSections.map(section => {
    const records = stageResearchRecords.filter(record =>
      record.officialSectionIds?.includes(section.id)
    )
    const officialContext = officialPaftaObservations.filter(
      observation => observation.sectionId === section.id
    )
    const review = completedReviews[section.id]
    const latestReview = reviewHistory[section.id]
    const status = review
      ? 'official-match-reviewed'
      : reconciliationStatusFor(records)

    return {
      id: `reconciliation-${section.id}`,
      sectionId: section.id,
      sequence: section.sequence,
      officialTitle: section.officialTitle,
      officialReference: {
        sourceId: section.officialMapSourceId,
        url: section.officialMapUrl || section.officialMapCollectionUrl
      },
      status,
      candidateRecordIds: records.map(record => record.id),
      reconciliationReviewId: review?.id || null,
      latestReviewId: latestReview?.id || null,
      externalMatchStatus: externalMatchStatus(records),
      reviewPacket: {
        officialContext: officialContext.map(observation => ({
          observationId: observation.id,
          sourceId: observation.sourceId,
          accessedAt: observation.accessedAt,
          sourceFreshness: observation.sourceFreshness,
          sourceTitle: sourcesById[observation.sourceId]?.title || null,
          sourceUrl: sourcesById[observation.sourceId]?.url || null,
          routeContext: observation.routeContext,
          reviewPrompt: observation.reviewPrompt
        })),
        candidateLinks: records.flatMap(record =>
          (record.externalGpsLinks || []).map(link => ({
            recordId: record.id,
            provider: link.provider,
            sourceId: link.sourceId,
            url: link.url,
            recordedAt: link.recordedAt || null,
            uploadedAt: link.uploadedAt || null,
            routeMatchStatus: link.routeMatchStatus,
            externalDownloadOnly: link.externalDownloadOnly,
            matchNotes: link.matchNotes
          }))
        ),
        latestReview: latestReview
          ? {
              id: latestReview.id,
              status: latestReview.status,
              reviewedAt: latestReview.reviewedAt,
              reviewedBy: latestReview.reviewedBy,
              decisionNote: latestReview.decisionNote
            }
          : null,
        requiredChecks: reconciliationChecks
      },
      checks: reconciliationChecks.map(id => ({
        id,
        status: checkStatusFor({ checkId: id, status, records })
      })),
      doNotPublish: status !== 'evidence-complete',
      nextAction: nextActionFor(status)
    }
  })
}

const formatOfficialPaftaReviewPackets = queue => {
  const lines = ['Likya resmî pafta inceleme paketleri', '']

  queue.forEach(item => {
    lines.push(`## ${item.sequence}. ${item.officialTitle}`)
    lines.push(`Durum: ${item.status}`)

    item.reviewPacket.officialContext.forEach(context => {
      lines.push(`Resmî ayrıntı: ${context.sourceTitle} — ${context.sourceUrl}`)
      lines.push(`İnceleme notu: ${context.reviewPrompt}`)
    })

    if (item.reviewPacket.candidateLinks.length === 0) {
      lines.push(
        'GPS adayı: Yok; önce doğrudan eşleşen bir haricî aday araştır.'
      )
    } else {
      item.reviewPacket.candidateLinks.forEach(link => {
        lines.push(
          `GPS adayı (${link.provider}, ${link.routeMatchStatus}): ${link.url}`
        )
        lines.push(`Aday notu: ${link.matchNotes}`)
      })
    }

    if (item.reviewPacket.latestReview) {
      lines.push(
        `Son inceleme (${item.reviewPacket.latestReview.status}, ${item.reviewPacket.latestReview.reviewedAt}): ${item.reviewPacket.latestReview.decisionNote}`
      )
    }

    lines.push(
      `Zorunlu kontroller: ${item.reviewPacket.requiredChecks.join(', ')}`
    )
    lines.push('')
  })

  return lines.join('\n')
}

const formatOfficialPaftaReconciliationQueue = queue => {
  const lines = ['Likya resmî pafta eşleştirme kuyruğu', '']

  queue.forEach(item => {
    const required = item.checks.filter(
      check => check.status === 'required'
    ).length

    lines.push(
      `- ${item.sequence}. ${item.officialTitle}: ${item.status}; ${item.reviewPacket.officialContext.length} resmî bağlam kaydı ve ${required} zorunlu doğrulama adımı bekliyor.`
    )
  })

  return lines.join('\n')
}

module.exports = {
  buildOfficialPaftaReconciliationQueue,
  formatOfficialPaftaReconciliationQueue,
  formatOfficialPaftaReviewPackets,
  reconciliationChecks
}
