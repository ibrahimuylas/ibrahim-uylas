const fs = require('fs')
const path = require('path')
const {
  isVerifiedExternalGpsLink,
  isWikilocUrl
} = require('./external-gps-links')
const {
  comparisonFields,
  isCompleteOfficialPaftaReview,
  isRecordedNeedsEvidenceReview,
  paftaReconciliationReviewStates
} = require('./pafta-reconciliation-reviews')
const {
  bookReferenceClaimTypes,
  isCompleteBookReferenceEvidence
} = require('./book-reference-evidence')
const {
  operationalEvidenceStates,
  operationalFactTypes
} = require('./stage-operational-evidence')
const {
  metricMeasurementMethods,
  routeMetricTypes
} = require('./stage-route-metrics')

const allowedSourceTypes = new Set([
  'official-route',
  'official-condition',
  'book',
  'community',
  'gps-platform',
  'first-hand',
  'editorial'
])

const allowedReuseStates = new Set([
  'link-only',
  'quote-with-limit',
  'embed-permitted',
  'file-reuse-permitted',
  'unknown'
])

const allowedGeometryStates = new Set([
  'external-reference',
  'licensed-local',
  'not-available'
])

const allowedRegions = new Set(['west', 'central', 'east'])
const allowedConditionStates = new Set([
  'official-notice',
  'season-reviewed',
  'historical-note',
  'review-due',
  'unknown'
])
const allowedHistoricalKinds = new Set([
  'planned-itinerary',
  'walked-itinerary',
  'historical-gps',
  'daily-journal',
  'equipment',
  'reflection'
])
const allowedStageResearchStates = new Set([
  'research',
  'needs-review',
  'withheld',
  'eligible',
  'published'
])

const isUrl = value =>
  typeof value === 'string' && (/^https:\/\//.test(value) || /^\//.test(value))

const isDateLike = value =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}(?:-\d{2})?(?:\/\d{4}-\d{2}-\d{2})?$/.test(value)

const uniqueItems = (items, label, report) => {
  const seen = new Set()

  items.forEach(item => {
    if (!item || !item.id) {
      report.errors.push(`${label} kaydında geçerli bir id yok.`)
      return
    }

    if (seen.has(item.id)) {
      report.errors.push(`${label} id tekrarı: ${item.id}`)
      return
    }

    seen.add(item.id)
  })
}

const walkFiles = directory => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) return walkFiles(entryPath)
    return entry.name === 'index.mdx' ? [entryPath] : []
  })
}

const readArticleSlugs = (
  postsDirectory = path.resolve(__dirname, '../../../content/posts')
) => {
  const slugs = new Set()

  walkFiles(postsDirectory).forEach(filePath => {
    const contents = fs.readFileSync(filePath, 'utf8')
    const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    const slug = frontmatter?.[1].match(/^slug:\s*(.+?)\s*$/m)?.[1]

    if (!slug) return
    slugs.add(slug.replace(/^(['"])(.*)\1$/, '$2'))
  })

  return slugs
}

const validateSources = (sources, report) => {
  uniqueItems(sources, 'Kaynak', report)

  sources.forEach(source => {
    if (!source) return

    ;['title', 'publisher', 'url', 'sourceType', 'accessedAt', 'reuse'].forEach(
      field => {
        if (!source[field]) {
          report.errors.push(
            `Kaynak ${source.id || '(id yok)'} için ${field} zorunlu.`
          )
        }
      }
    )

    if (source.url && !isUrl(source.url)) {
      report.errors.push(
        `Kaynak ${source.id} geçerli bir URL veya yerel yol içermiyor.`
      )
    }
    if (source.sourceType && !allowedSourceTypes.has(source.sourceType)) {
      report.errors.push(
        `Kaynak ${source.id} bilinmeyen sourceType kullanıyor.`
      )
    }
    if (source.reuse && !allowedReuseStates.has(source.reuse)) {
      report.errors.push(
        `Kaynak ${source.id} bilinmeyen reuse durumu kullanıyor.`
      )
    }
    if (source.accessedAt && !isDateLike(source.accessedAt)) {
      report.errors.push(
        `Kaynak ${source.id} geçerli bir accessedAt tarihi içermiyor.`
      )
    }
    if (
      !Array.isArray(source.authorityScope) ||
      source.authorityScope.length === 0
    ) {
      report.errors.push(`Kaynak ${source.id} authorityScope içermeli.`)
    }
  })
}

const sourceIdsFor = sources => new Set(sources.map(source => source.id))

const validateSourceReferences = (entity, report, sourceIds, label) => {
  ;(entity.sourceIds || []).forEach(sourceId => {
    if (!sourceIds.has(sourceId)) {
      report.errors.push(
        `${label} ${entity.id} çözümlenemeyen kaynak kullanıyor: ${sourceId}`
      )
    }
  })
}

const validateRouteSections = (
  routeSections,
  report,
  sourceIds,
  articleSlugs
) => {
  uniqueItems(routeSections, 'Resmî pafta', report)

  if (routeSections.length !== 31) {
    report.errors.push(
      `Resmî pafta envanteri 31 kayıt içermeli; şu an ${routeSections.length} kayıt var.`
    )
  }

  const seenSequences = new Set()

  routeSections.forEach(section => {
    if (!section) return

    if (!Number.isInteger(section.sequence) || section.sequence < 1) {
      report.errors.push(`Pafta ${section.id} geçerli bir sequence içermiyor.`)
    } else if (seenSequences.has(section.sequence)) {
      report.errors.push(`Pafta sequence tekrarı: ${section.sequence}`)
    } else {
      seenSequences.add(section.sequence)
    }

    ;[
      'name',
      'officialTitle',
      'officialMapSourceId',
      'officialMapNumber',
      'officialMapUrl',
      'geometryStatus',
      'verifiedAt',
      'verifiedBy',
      'reviewStatus'
    ].forEach(field => {
      if (!section[field] && section[field] !== 0) {
        report.errors.push(`Pafta ${section.id} için ${field} zorunlu.`)
      }
    })

    if (!sourceIds.has(section.officialMapSourceId)) {
      report.errors.push(
        `Pafta ${section.id} çözümlenemeyen resmî kaynak kullanıyor: ${section.officialMapSourceId}`
      )
    }
    if (section.officialMapUrl && !isUrl(section.officialMapUrl)) {
      report.errors.push(
        `Pafta ${section.id} geçerli bir officialMapUrl içermiyor.`
      )
    }
    if (!allowedGeometryStates.has(section.geometryStatus)) {
      report.errors.push(
        `Pafta ${section.id} bilinmeyen geometryStatus kullanıyor.`
      )
    }
    if (!allowedRegions.has(section.editorialRegion)) {
      report.errors.push(
        `Pafta ${section.id} geçerli bir editoryal bölgeye bağlı değil.`
      )
    }
    if (!section.start || !section.end) {
      report.warnings.push(
        `Pafta ${section.sequence} için başlangıç/bitiş kapsamı ayrıntı kaynağından doğrulanmalı.`
      )
    }
    if (!section.distanceKm || section.distanceKm.value === null) {
      report.warnings.push(
        `Pafta ${section.sequence} için mesafe henüz gösterime uygun değil.`
      )
    } else if (!sourceIds.has(section.distanceKm.sourceId)) {
      report.errors.push(
        `Pafta ${section.id} mesafesi geçerli bir sourceId ile desteklenmeli.`
      )
    }

    ;(section.relatedArticleSlugs || []).forEach(articleSlug => {
      if (!articleSlugs.has(articleSlug)) {
        report.errors.push(
          `Pafta ${section.id} bulunmayan dahili makaleye bağlanıyor: ${articleSlug}`
        )
      }
    })
  })
}

const validateHistoricalExperiences = (
  experiences,
  report,
  sourceIds,
  articleSlugs,
  routeSectionIds
) => {
  uniqueItems(experiences, 'Tarihsel deneyim', report)

  experiences.forEach(experience => {
    if (!experience) return

    ;[
      'articleSlug',
      'experienceDate',
      'routeCoverage',
      'contentKind',
      'historicalDisclaimer'
    ].forEach(field => {
      if (!experience[field]) {
        report.errors.push(
          `Tarihsel deneyim ${experience.id} için ${field} zorunlu.`
        )
      }
    })
    if (!allowedHistoricalKinds.has(experience.contentKind)) {
      report.errors.push(
        `Tarihsel deneyim ${experience.id} bilinmeyen contentKind kullanıyor.`
      )
    }
    if (!articleSlugs.has(experience.articleSlug)) {
      report.errors.push(
        `Tarihsel deneyim ${experience.id} bulunmayan makaleye bağlanıyor: ${experience.articleSlug}`
      )
    }
    if (!isDateLike(experience.experienceDate)) {
      report.errors.push(
        `Tarihsel deneyim ${experience.id} geçerli bir experienceDate içermiyor.`
      )
    }

    validateSourceReferences(experience, report, sourceIds, 'Tarihsel deneyim')

    ;(experience.relatedSectionIds || []).forEach(sectionId => {
      if (!routeSectionIds.has(sectionId)) {
        report.errors.push(
          `Tarihsel deneyim ${experience.id} çözümlenemeyen paftaya bağlanıyor: ${sectionId}`
        )
      }
    })

    if ((experience.relatedSectionIds || []).length === 0) {
      report.warnings.push(
        `Tarihsel deneyim ${experience.id} pafta eşleştirmesi bekliyor.`
      )
    }
  })
}

const validateWalkingStages = (
  stages,
  report,
  sourceIds,
  articleSlugs,
  routeSectionIds
) => {
  uniqueItems(stages, 'Yürüyüş etabı', report)

  stages.forEach(stage => {
    if (!stage) return

    ;[
      'name',
      'start',
      'end',
      'reviewedAt',
      'reviewStatus',
      'planningEligibility'
    ].forEach(field => {
      if (!stage[field]) {
        report.errors.push(`Yürüyüş etabı ${stage.id} için ${field} zorunlu.`)
      }
    })

    validateSourceReferences(stage, report, sourceIds, 'Yürüyüş etabı')

    ;(stage.relatedArticleSlugs || []).forEach(articleSlug => {
      if (!articleSlugs.has(articleSlug)) {
        report.errors.push(
          `Yürüyüş etabı ${stage.id} bulunmayan makaleye bağlanıyor: ${articleSlug}`
        )
      }
    })
    ;(stage.officialSectionIds || []).forEach(sectionId => {
      if (!routeSectionIds.has(sectionId)) {
        report.errors.push(
          `Yürüyüş etabı ${stage.id} çözümlenemeyen paftaya bağlanıyor: ${sectionId}`
        )
      }
    })

    if (
      stage.planningEligibility === 'eligible' &&
      (stage.officialSectionIds || []).length === 0
    ) {
      report.errors.push(
        `Planlamaya uygun etap ${stage.id} en az bir resmî paftaya bağlanmalı.`
      )
    }
    if (
      stage.planningEligibility === 'not-eligible-until-reconciled' &&
      (stage.officialSectionIds || []).length === 0
    ) {
      report.warnings.push(
        `Tarihsel etap ${stage.id} resmî pafta eşleştirmesi bekliyor; öneri motoruna alınmaz.`
      )
    }
  })
}

const validateStageResearchRecords = (
  records,
  report,
  sourceIds,
  routeSectionIds,
  sourcesById
) => {
  uniqueItems(records, 'Etap araştırma kaydı', report)

  records.forEach(record => {
    if (!record) return

    ;['researchStatus', 'updatedAt', 'researchOwner'].forEach(field => {
      if (!record[field]) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} için ${field} zorunlu.`
        )
      }
    })
    if (!allowedStageResearchStates.has(record.researchStatus)) {
      report.errors.push(
        `Etap araştırma kaydı ${record.id} bilinmeyen researchStatus kullanıyor.`
      )
    }
    if (record.updatedAt && !isDateLike(record.updatedAt)) {
      report.errors.push(
        `Etap araştırma kaydı ${record.id} geçerli updatedAt tarihi içermiyor.`
      )
    }
    validateSourceReferences(record, report, sourceIds, 'Etap araştırma kaydı')
    ;(record.externalGpsLinks || []).forEach(link => {
      ;[
        'provider',
        'url',
        'sourceId',
        'recordId',
        'author',
        'recordedAt',
        'uploadedAt',
        'routeMatchStatus',
        'reviewedAt'
      ].forEach(field => {
        if (!link[field]) {
          report.errors.push(
            `Etap araştırma kaydı ${record.id} haricî GPS bağlantısı için ${field} zorunlu.`
          )
        }
      })
      if (link.provider !== 'wikiloc' || !isWikilocUrl(link.url)) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} yalnızca geçerli bir Wikiloc haricî bağlantısı kullanabilir.`
        )
      }
      if (!sourceIds.has(link.sourceId)) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} çözümlenemeyen haricî GPS kaynağı kullanıyor: ${link.sourceId}`
        )
      } else if (sourcesById[link.sourceId]?.sourceType !== 'gps-platform') {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} haricî GPS bağlantısı gps-platform kaynağı kullanmalı.`
        )
      }
      if (
        !['candidate', 'verified', 'rejected'].includes(link.routeMatchStatus)
      ) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} bilinmeyen haricî GPS eşleşme durumu kullanıyor.`
        )
      }
      if (link.externalDownloadOnly !== true || link.localFilePath) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} haricî GPS kaydını sadece sağlayıcıda indirmeye yönlendirmeli.`
        )
      }
      ;['recordedAt', 'uploadedAt', 'reviewedAt'].forEach(field => {
        if (link[field] && !isDateLike(link[field])) {
          report.errors.push(
            `Etap araştırma kaydı ${record.id} haricî GPS için geçerli ${field} tarihi içermeli.`
          )
        }
      })
    })
    ;(record.officialSectionIds || []).forEach(sectionId => {
      if (!routeSectionIds.has(sectionId)) {
        report.errors.push(
          `Etap araştırma kaydı ${record.id} çözümlenemeyen paftaya bağlanıyor: ${sectionId}`
        )
      }
    })

    if (['eligible', 'published'].includes(record.researchStatus)) {
      ;[
        'name',
        'start',
        'end',
        'direction',
        'routeFactsCheckedAt',
        'operationalFactsCheckedAt',
        'reviewedAt',
        'reviewedBy'
      ].forEach(field => {
        if (!record[field]) {
          report.errors.push(
            `Yayıma uygun etap araştırma kaydı ${record.id} için ${field} zorunlu.`
          )
        }
      })
      if ((record.officialSectionIds || []).length === 0) {
        report.errors.push(
          `Yayıma uygun etap araştırma kaydı ${record.id} en az bir resmî paftaya bağlanmalı.`
        )
      }
      if ((record.sourceIds || []).length === 0) {
        report.errors.push(
          `Yayıma uygun etap araştırma kaydı ${record.id} en az bir kaynak içermeli.`
        )
      }

      const gps = record.gpsEvidence || {}
      const hasVerifiedExternalGps = (record.externalGpsLinks || []).some(
        isVerifiedExternalGpsLink
      )
      const routeMetrics = record.routeMetrics || {}
      const logisticsEvidence = record.logisticsEvidence || {}

      if (!hasVerifiedExternalGps) {
        ;['sourceId', 'owner', 'permission', 'recordedAt'].forEach(field => {
          if (!gps[field]) {
            report.errors.push(
              `Yayıma uygun etap araştırma kaydı ${record.id} GPS ${field} bilgisi içermeli.`
            )
          }
        })
        if (gps.sourceId && !sourceIds.has(gps.sourceId)) {
          report.errors.push(
            `Etap araştırma kaydı ${record.id} çözümlenemeyen GPS kaynağı kullanıyor: ${gps.sourceId}`
          )
        }
        if (gps.permission && gps.permission !== 'file-reuse-permitted') {
          report.errors.push(
            `Yayıma uygun etap araştırma kaydı ${record.id} GPS yeniden kullanım izni içermeli.`
          )
        }
      }

      ;['distanceKm', 'ascentM', 'descentM', 'expectedHours'].forEach(field => {
        const metric = routeMetrics[field]

        if (!metric || !Number.isFinite(metric.value) || !metric.sourceId) {
          report.errors.push(
            `Yayıma uygun etap araştırma kaydı ${record.id} kaynaklı ${field} rota metriği içermeli.`
          )
        } else if (!sourceIds.has(metric.sourceId)) {
          report.errors.push(
            `Etap araştırma kaydı ${record.id} çözümlenemeyen ${field} metriği kaynağı kullanıyor: ${metric.sourceId}`
          )
        }
      })

      ;['water', 'resupply', 'lodging', 'transport', 'emergencyExit'].forEach(
        field => {
          const evidence = logisticsEvidence[field]

          if (
            !evidence ||
            !['verified', 'unavailable'].includes(evidence.status)
          ) {
            report.errors.push(
              `Yayıma uygun etap araştırma kaydı ${record.id} ${field} lojistik durumu içermeli.`
            )
            return
          }
          if (
            evidence.status === 'verified' &&
            (!Array.isArray(evidence.sourceIds) ||
              evidence.sourceIds.length === 0)
          ) {
            report.errors.push(
              `Yayıma uygun etap araştırma kaydı ${record.id} doğrulanmış ${field} lojistiği için kaynak içermeli.`
            )
          }
          ;(evidence.sourceIds || []).forEach(sourceId => {
            if (!sourceIds.has(sourceId)) {
              report.errors.push(
                `Etap araştırma kaydı ${record.id} çözümlenemeyen ${field} lojistik kaynağı kullanıyor: ${sourceId}`
              )
            }
          })
        }
      )

      ;[
        'routeFactsCheckedAt',
        'operationalFactsCheckedAt',
        'reviewedAt',
        'recordedAt'
      ].forEach(field => {
        const value = field === 'recordedAt' ? gps.recordedAt : record[field]

        if (value && !isDateLike(value)) {
          report.errors.push(
            `Yayıma uygun etap araştırma kaydı ${record.id} geçerli ${field} tarihi içermeli.`
          )
        }
      })
    }
  })
}

const validatePaftaReconciliationReviews = (
  reviews,
  report,
  sourceIds,
  routeSections,
  stageResearchRecords,
  sourcesById
) => {
  uniqueItems(reviews, 'Pafta eşleştirme incelemesi', report)

  const sectionsById = Object.fromEntries(
    routeSections.map(section => [section.id, section])
  )
  const recordsById = Object.fromEntries(
    stageResearchRecords.map(record => [record.id, record])
  )

  reviews.forEach(review => {
    if (!review) return

    ;['sectionId', 'candidateRecordId', 'status'].forEach(field => {
      if (!review[field]) {
        report.errors.push(
          `Pafta eşleştirme incelemesi ${review.id} için ${field} zorunlu.`
        )
      }
    })
    if (!paftaReconciliationReviewStates.includes(review.status)) {
      report.errors.push(
        `Pafta eşleştirme incelemesi ${review.id} bilinmeyen durum kullanıyor.`
      )
    }

    const section = sectionsById[review.sectionId]
    const candidate = recordsById[review.candidateRecordId]

    if (!section) {
      report.errors.push(
        `Pafta eşleştirme incelemesi ${review.id} çözümlenemeyen paftaya bağlanıyor: ${review.sectionId}`
      )
    }
    if (!candidate) {
      report.errors.push(
        `Pafta eşleştirme incelemesi ${review.id} çözümlenemeyen aday kaydı kullanıyor: ${review.candidateRecordId}`
      )
    } else if (!candidate.officialSectionIds?.includes(review.sectionId)) {
      report.errors.push(
        `Pafta eşleştirme incelemesi ${review.id} aday kaydını farklı bir resmî paftaya bağlayamaz.`
      )
    }

    if (review.status === 'needs-evidence') {
      if (!isRecordedNeedsEvidenceReview(review)) {
        report.errors.push(
          `Ek kanıt bekleyen pafta incelemesi ${review.id} aday, resmî referans, gözlem kaynakları ve karar notu içermeli.`
        )
      }
      ;(review.observationSourceIds || []).forEach(sourceId => {
        if (!sourceIds.has(sourceId)) {
          report.errors.push(
            `Ek kanıt bekleyen pafta incelemesi ${review.id} çözümlenemeyen gözlem kaynağı kullanıyor: ${sourceId}`
          )
        }
      })
      return
    }

    if (review.status !== 'verified') return

    if (!isCompleteOfficialPaftaReview(review)) {
      report.errors.push(
        `Doğrulanmış pafta eşleştirme incelemesi ${review.id} tam karşılaştırma ve bağımsız kaynak içermeli.`
      )
      return
    }
    if (
      review.officialReference.sourceId !== section?.officialMapSourceId ||
      review.officialReference.url !==
        (section?.officialMapUrl || section?.officialMapCollectionUrl)
    ) {
      report.errors.push(
        `Doğrulanmış pafta eşleştirme incelemesi ${review.id} paftanın resmî referansını kullanmalı.`
      )
    }
    ;[
      review.officialReference.sourceId,
      ...(review.independentCorroboration.sourceIds || [])
    ].forEach(sourceId => {
      if (!sourceIds.has(sourceId)) {
        report.errors.push(
          `Pafta eşleştirme incelemesi ${review.id} çözümlenemeyen kaynak kullanıyor: ${sourceId}`
        )
      } else if (
        sourceId !== review.officialReference.sourceId &&
        sourcesById[sourceId]?.sourceType === 'gps-platform'
      ) {
        report.errors.push(
          `Pafta eşleştirme incelemesi ${review.id} bağımsız doğrulama için GPS platform kaynağı kullanamaz.`
        )
      }
    })
    ;[
      review.officialReference.checkedAt,
      review.independentCorroboration.checkedAt,
      review.reviewedAt
    ].forEach(value => {
      if (!isDateLike(value)) {
        report.errors.push(
          `Doğrulanmış pafta eşleştirme incelemesi ${review.id} geçerli bir inceleme tarihi içermeli.`
        )
      }
    })
    if (
      !comparisonFields.every(
        field => review.comparison?.[field] === 'matches-official-reference'
      )
    ) {
      report.errors.push(
        `Doğrulanmış pafta eşleştirme incelemesi ${review.id} tüm karşılaştırma kararlarını açıkça eşleşti olarak kaydetmeli.`
      )
    }
  })
}

const validateBookReferenceEvidence = (
  evidenceItems,
  report,
  sourceIds,
  routeSectionIds,
  sourcesById
) => {
  uniqueItems(evidenceItems, 'Kitap kaynak notu', report)

  evidenceItems.forEach(evidence => {
    if (!evidence) return

    if (!sourceIds.has(evidence.sourceId)) {
      report.errors.push(
        `Kitap kaynak notu ${evidence.id} çözümlenemeyen kaynak kullanıyor: ${evidence.sourceId}`
      )
    } else if (sourcesById[evidence.sourceId]?.sourceType !== 'book') {
      report.errors.push(
        `Kitap kaynak notu ${evidence.id} yalnızca book türü kaynak kullanabilir.`
      )
    }

    ;(evidence.sectionIds || []).forEach(sectionId => {
      if (!routeSectionIds.has(sectionId)) {
        report.errors.push(
          `Kitap kaynak notu ${evidence.id} çözümlenemeyen paftaya bağlanıyor: ${sectionId}`
        )
      }
    })

    if (
      evidence.claimType &&
      !bookReferenceClaimTypes.includes(evidence.claimType)
    ) {
      report.errors.push(
        `Kitap kaynak notu ${evidence.id} geçersiz bir iddia türü kullanıyor.`
      )
    }
    if (evidence.quote) {
      report.errors.push(
        `Kitap kaynak notu ${evidence.id} uzun alıntı saklayamaz; sayfa referanslı kısa bir özet kullan.`
      )
    }
    if (!isCompleteBookReferenceEvidence(evidence, sourcesById)) {
      report.errors.push(
        `Kitap kaynak notu ${evidence.id} kaynak, baskı, sayfa, kısa özet, tarih, inceleyen ve citation-only hak durumu içermeli.`
      )
    }
  })
}

const validateStageOperationalEvidence = (
  evidenceItems,
  report,
  sourceIds,
  stageResearchRecords,
  buildDate
) => {
  uniqueItems(evidenceItems, 'Etap operasyonel kanıtı', report)

  const researchIds = new Set(stageResearchRecords.map(record => record.id))

  evidenceItems.forEach(evidence => {
    if (!evidence) return

    ;['stageResearchRecordId', 'factType', 'status'].forEach(field => {
      if (!evidence[field]) {
        report.errors.push(
          `Etap operasyonel kanıtı ${evidence.id} için ${field} zorunlu.`
        )
      }
    })
    if (!researchIds.has(evidence.stageResearchRecordId)) {
      report.errors.push(
        `Etap operasyonel kanıtı ${evidence.id} çözümlenemeyen etap araştırmasına bağlanıyor: ${evidence.stageResearchRecordId}`
      )
    }
    if (!operationalFactTypes.includes(evidence.factType)) {
      report.errors.push(
        `Etap operasyonel kanıtı ${evidence.id} bilinmeyen bilgi türü kullanıyor.`
      )
    }
    if (!operationalEvidenceStates.includes(evidence.status)) {
      report.errors.push(
        `Etap operasyonel kanıtı ${evidence.id} bilinmeyen durum kullanıyor.`
      )
    }

    if (!['verified', 'unavailable'].includes(evidence.status)) return

    ;['checkedAt', 'reviewDueAt', 'reviewedBy', 'note'].forEach(field => {
      if (!evidence[field]) {
        report.errors.push(
          `Tam operasyonel kanıt ${evidence.id} için ${field} zorunlu.`
        )
      }
    })
    if (!Array.isArray(evidence.sourceIds) || evidence.sourceIds.length === 0) {
      report.errors.push(
        `Tam operasyonel kanıt ${evidence.id} en az bir kaynak içermeli.`
      )
    }
    ;(evidence.sourceIds || []).forEach(sourceId => {
      if (!sourceIds.has(sourceId)) {
        report.errors.push(
          `Etap operasyonel kanıtı ${evidence.id} çözümlenemeyen kaynak kullanıyor: ${sourceId}`
        )
      }
    })
    ;['checkedAt', 'reviewDueAt'].forEach(field => {
      if (evidence[field] && !isDateLike(evidence[field])) {
        report.errors.push(
          `Tam operasyonel kanıt ${evidence.id} geçerli ${field} tarihi içermeli.`
        )
      }
    })
    if (evidence.reviewDueAt && evidence.reviewDueAt < buildDate) {
      report.errors.push(
        `Etap operasyonel kanıtı ${evidence.id} yeniden inceleme tarihini geçti.`
      )
    }
  })
}

const validateStageRouteMetrics = (
  metrics,
  report,
  sourceIds,
  stageResearchRecords,
  sourcesById,
  buildDate
) => {
  uniqueItems(metrics, 'Etap rota metriği', report)

  const researchIds = new Set(stageResearchRecords.map(record => record.id))

  metrics.forEach(metric => {
    if (!metric) return

    ;[
      'stageResearchRecordId',
      'metricType',
      'value',
      'measurementMethod'
    ].forEach(field => {
      if (metric[field] === undefined || metric[field] === null) {
        report.errors.push(
          `Etap rota metriği ${metric.id} için ${field} zorunlu.`
        )
      }
    })
    if (!researchIds.has(metric.stageResearchRecordId)) {
      report.errors.push(
        `Etap rota metriği ${metric.id} çözümlenemeyen etap araştırmasına bağlanıyor: ${metric.stageResearchRecordId}`
      )
    }
    if (!routeMetricTypes.includes(metric.metricType)) {
      report.errors.push(
        `Etap rota metriği ${metric.id} bilinmeyen metrik türü kullanıyor.`
      )
    }
    if (!metricMeasurementMethods.includes(metric.measurementMethod)) {
      report.errors.push(
        `Etap rota metriği ${metric.id} bilinmeyen ölçüm yöntemi kullanıyor.`
      )
    }
    if (!Number.isFinite(metric.value) || metric.value < 0) {
      report.errors.push(
        `Etap rota metriği ${metric.id} negatif olmayan sayısal değer içermeli.`
      )
    }
    if (
      ['distance-km', 'expected-hours'].includes(metric.metricType) &&
      metric.value <= 0
    ) {
      report.errors.push(
        `Etap rota metriği ${metric.id} sıfırdan büyük olmalı.`
      )
    }
    if (!Array.isArray(metric.sourceIds) || metric.sourceIds.length === 0) {
      report.errors.push(
        `Etap rota metriği ${metric.id} en az bir kaynak içermeli.`
      )
    }
    ;['checkedAt', 'reviewDueAt', 'reviewedBy', 'note'].forEach(field => {
      if (!metric[field]) {
        report.errors.push(
          `Etap rota metriği ${metric.id} için ${field} zorunlu.`
        )
      }
    })
    ;['checkedAt', 'reviewDueAt'].forEach(field => {
      if (metric[field] && !isDateLike(metric[field])) {
        report.errors.push(
          `Etap rota metriği ${metric.id} geçerli ${field} tarihi içermeli.`
        )
      }
    })
    if (metric.reviewDueAt && metric.reviewDueAt < buildDate) {
      report.errors.push(
        `Etap rota metriği ${metric.id} yeniden inceleme tarihini geçti.`
      )
    }
    ;(metric.sourceIds || []).forEach(sourceId => {
      const source = sourcesById[sourceId]

      if (!sourceIds.has(sourceId)) {
        report.errors.push(
          `Etap rota metriği ${metric.id} çözümlenemeyen kaynak kullanıyor: ${sourceId}`
        )
        return
      }
      if (
        metric.measurementMethod === 'official-source' &&
        source?.sourceType !== 'official-route'
      ) {
        report.errors.push(
          `Etap rota metriği ${metric.id} resmî kaynak yöntemi için official-route kaynağı kullanmalı.`
        )
      }
      if (
        metric.measurementMethod === 'rights-cleared-gps-analysis' &&
        source?.reuse !== 'file-reuse-permitted'
      ) {
        report.errors.push(
          `Etap rota metriği ${metric.id} GPS analizi için dosya yeniden kullanım izni içermeli.`
        )
      }
      if (
        metric.measurementMethod === 'field-observation' &&
        source?.sourceType !== 'first-hand'
      ) {
        report.errors.push(
          `Etap rota metriği ${metric.id} saha gözlemi için birincil kaynak kullanmalı.`
        )
      }
    })
  })
}

const publishedPlanFields = [
  'name',
  'durationDays',
  'start',
  'end',
  'sourceIds',
  'stageIds',
  'detailPath',
  'direction',
  'regionCoverage',
  'totalDistanceKm',
  'totalAscentM',
  'minimumExperience',
  'recommendedSeasonBands',
  'excludedSeasonBands',
  'dailyLoadBand',
  'lodgingModes',
  'transportModes',
  'gpsTracks',
  'fallbackExitStrategy',
  'reviewedAt',
  'reviewStatus',
  'planningEligibility'
]

const validateRoutePlans = (
  routePlans,
  report,
  sourceIds,
  stageIds,
  eligibleStageIds
) => {
  uniqueItems(routePlans, 'Rota planı', report)

  routePlans.forEach(plan => {
    if (!plan) return

    if (!['published', 'withheld'].includes(plan.publicationStatus)) {
      report.errors.push(
        `Rota planı ${plan.id} geçerli bir publicationStatus içermeli.`
      )
    }

    const requiredFields =
      plan.publicationStatus === 'published'
        ? publishedPlanFields
        : ['name', 'durationDays', 'start', 'end', 'sourceIds', 'stageIds']

    requiredFields.forEach(field => {
      if (!plan[field] && plan[field] !== 0) {
        report.errors.push(`Rota planı ${plan.id} için ${field} zorunlu.`)
      }
    })
    validateSourceReferences(plan, report, sourceIds, 'Rota planı')
    ;(plan.stageIds || []).forEach(stageId => {
      if (!stageIds.has(stageId)) {
        report.errors.push(
          `Rota planı ${plan.id} çözümlenemeyen etap kullanıyor: ${stageId}`
        )
      }
    })

    if (plan.publicationStatus === 'published') {
      if (plan.planningEligibility !== 'eligible') {
        report.errors.push(
          `Yayımlanan rota planı ${plan.id} planlamaya uygun olmalı.`
        )
      }
      if ((plan.stageIds || []).length === 0) {
        report.errors.push(
          `Yayımlanan rota planı ${plan.id} en az bir doğrulanmış etap içermeli.`
        )
      }
      ;(plan.stageIds || []).forEach(stageId => {
        if (!eligibleStageIds.has(stageId)) {
          report.errors.push(
            `Yayımlanan rota planı ${plan.id} planlamaya uygun olmayan etap kullanıyor: ${stageId}`
          )
        }
      })
    }
  })
}

const conditionCategories = new Set([
  'weather',
  'fire-forest',
  'route-transport',
  'water-services'
])

const hasConditionScope = condition =>
  ['routeSectionIds', 'stageIds', 'regionIds'].some(
    field => Array.isArray(condition[field]) && condition[field].length > 0
  )

const conditionScopeKey = condition =>
  ['routeSectionIds', 'stageIds', 'regionIds']
    .flatMap(field => (condition[field] || []).map(id => `${field}:${id}`))
    .sort()
    .join('|')

const isActiveOfficialNotice = (condition, buildDate) =>
  condition.status === 'official-notice' &&
  !condition.archivedAt &&
  (!condition.effectiveTo || condition.effectiveTo >= buildDate)

const validateConditions = (
  conditions,
  report,
  sourceIds,
  routeSectionIds,
  sourcesById,
  buildDate
) => {
  uniqueItems(conditions, 'Koşul kaydı', report)
  const activeNotices = new Map()

  conditions.forEach(condition => {
    if (!condition) return

    ;[
      'category',
      'summary',
      'status',
      'sourceId',
      'sourceUrl',
      'reviewDueAt',
      'editorialOwner',
      'replacementCheck'
    ].forEach(field => {
      if (!condition[field]) {
        report.errors.push(`Koşul kaydı ${condition.id} için ${field} zorunlu.`)
      }
    })
    if (!allowedConditionStates.has(condition.status)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} bilinmeyen status kullanıyor.`
      )
    }
    if (!conditionCategories.has(condition.category)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} geçerli bir category içermeli.`
      )
    }
    if (!sourceIds.has(condition.sourceId)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} çözümlenemeyen kaynak kullanıyor.`
      )
    }
    if (condition.sourceUrl && !isUrl(condition.sourceUrl)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} geçerli bir sourceUrl içermeli.`
      )
    }
    if (!isDateLike(condition.reviewDueAt)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} geçerli reviewDueAt içermiyor.`
      )
    }
    if (!condition.checkedAt && !condition.observedAt) {
      report.errors.push(
        `Koşul kaydı ${condition.id} checkedAt veya observedAt içermeli.`
      )
    }
    ;[
      'checkedAt',
      'observedAt',
      'effectiveFrom',
      'effectiveTo',
      'archivedAt'
    ].forEach(field => {
      if (condition[field] && !isDateLike(condition[field])) {
        report.errors.push(
          `Koşul kaydı ${condition.id} geçerli ${field} tarihi içermeli.`
        )
      }
    })
    if (!hasConditionScope(condition)) {
      report.errors.push(
        `Koşul kaydı ${condition.id} en az bir pafta, etap veya bölge kapsamı içermeli.`
      )
    }
    ;(condition.routeSectionIds || []).forEach(sectionId => {
      if (!routeSectionIds.has(sectionId)) {
        report.errors.push(
          `Koşul kaydı ${condition.id} çözümlenemeyen pafta kullanıyor: ${sectionId}`
        )
      }
    })

    if (condition.blocksRecommendation && !hasConditionScope(condition)) {
      report.errors.push(
        `Öneriyi engelleyen koşul kaydı ${condition.id} kapsam içermeli.`
      )
    }
    if (condition.blocksRecommendation && !condition.blockReason) {
      report.errors.push(
        `Öneriyi engelleyen koşul kaydı ${condition.id} blockReason içermeli.`
      )
    }
    if (condition.status === 'official-notice') {
      const source = sourcesById[condition.sourceId]

      if (source && source.sourceType !== 'official-condition') {
        report.errors.push(
          `Resmî duyuru ${condition.id} birincil resmî kaynak kullanmalı.`
        )
      }
      if (!condition.effectiveFrom || !condition.reviewDueAt) {
        report.errors.push(
          `Resmî duyuru ${condition.id} effectiveFrom ve reviewDueAt içermeli.`
        )
      }
      if (isActiveOfficialNotice(condition, buildDate)) {
        const key = `${condition.category}|${condition.sourceId}|${conditionScopeKey(condition)}`

        if (activeNotices.has(key)) {
          report.errors.push(
            `Aynı kaynak ve kapsam için çakışan etkin resmî duyurular var: ${condition.id}, ${activeNotices.get(key)}`
          )
        } else {
          activeNotices.set(key, condition.id)
        }
      }
    }
    if (
      condition.status === 'season-reviewed' &&
      condition.reviewDueAt < buildDate
    ) {
      report.errors.push(
        `Bu sezon kaynak kontrol edildi kaydı ${condition.id} gözden geçirme tarihini geçti.`
      )
    }
  })
}

const validateLikyaData = ({
  sources,
  routeSections,
  historicalExperiences,
  historicalWalkingStages,
  publishedWalkingStages,
  stageResearchRecords = [],
  paftaReconciliationReviews = [],
  bookReferenceEvidence = [],
  stageOperationalEvidence = [],
  stageRouteMetrics = [],
  routePlans,
  conditions,
  buildDate = process.env.LIKYA_BUILD_DATE ||
    new Date().toISOString().slice(0, 10),
  articleSlugs = readArticleSlugs()
}) => {
  const report = { errors: [], warnings: [] }
  const allWalkingStages = [
    ...historicalWalkingStages,
    ...publishedWalkingStages
  ]

  validateSources(sources, report)

  const sourceIds = sourceIdsFor(sources)
  const routeSectionIds = new Set(routeSections.map(section => section.id))
  const stageIds = new Set(allWalkingStages.map(stage => stage.id))
  const eligibleStageIds = new Set(
    allWalkingStages
      .filter(stage => stage.planningEligibility === 'eligible')
      .map(stage => stage.id)
  )

  validateRouteSections(routeSections, report, sourceIds, articleSlugs)
  validateHistoricalExperiences(
    historicalExperiences,
    report,
    sourceIds,
    articleSlugs,
    routeSectionIds
  )
  validateWalkingStages(
    allWalkingStages,
    report,
    sourceIds,
    articleSlugs,
    routeSectionIds
  )
  validateStageResearchRecords(
    stageResearchRecords,
    report,
    sourceIds,
    routeSectionIds,
    Object.fromEntries(sources.map(source => [source.id, source]))
  )
  validatePaftaReconciliationReviews(
    paftaReconciliationReviews,
    report,
    sourceIds,
    routeSections,
    stageResearchRecords,
    Object.fromEntries(sources.map(source => [source.id, source]))
  )
  validateBookReferenceEvidence(
    bookReferenceEvidence,
    report,
    sourceIds,
    routeSectionIds,
    Object.fromEntries(sources.map(source => [source.id, source]))
  )
  validateStageOperationalEvidence(
    stageOperationalEvidence,
    report,
    sourceIds,
    stageResearchRecords,
    buildDate
  )
  validateStageRouteMetrics(
    stageRouteMetrics,
    report,
    sourceIds,
    stageResearchRecords,
    Object.fromEntries(sources.map(source => [source.id, source])),
    buildDate
  )
  validateRoutePlans(routePlans, report, sourceIds, stageIds, eligibleStageIds)
  validateConditions(
    conditions,
    report,
    sourceIds,
    routeSectionIds,
    Object.fromEntries(sources.map(source => [source.id, source])),
    buildDate
  )

  return report
}

const formatValidationReport = report => {
  const lines = [
    `Likya veri doğrulaması: ${report.errors.length} hata, ${report.warnings.length} uyarı.`
  ]

  if (report.errors.length) {
    lines.push('', 'Hatalar:')
    report.errors.forEach(error => lines.push(`- ${error}`))
  }
  if (report.warnings.length) {
    lines.push('', 'Uyarılar:')
    report.warnings.forEach(warning => lines.push(`- ${warning}`))
  }

  return lines.join('\n')
}

module.exports = {
  formatValidationReport,
  readArticleSlugs,
  validateLikyaData
}
