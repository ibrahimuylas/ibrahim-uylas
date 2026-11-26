const isValidGuidePath = value =>
  typeof value === 'string' &&
  /^\/likya-yolu\/[^/]+\/$/.test(value)

const buildPublishedPaftaGuidePages = ({
  routeSections = [],
  paftaPublicationRecords = [],
  publicationReadiness = []
} = {}) => {
  const sectionsById = Object.fromEntries(
    routeSections.map(section => [section.id, section])
  )

  return publicationReadiness
    .filter(item => item.canPublish)
    .flatMap(item => {
      const section = sectionsById[item.sectionId]
      const record = paftaPublicationRecords.find(
        candidate => candidate.sectionId === item.sectionId
      )

      if (!section || !record || !isValidGuidePath(record.guidePath)) {
        return []
      }

      return [
        {
          path: record.guidePath,
          sectionId: section.id,
          title: section.officialTitle,
          summary: record.summary
        }
      ]
    })
}

module.exports = {
  buildPublishedPaftaGuidePages,
  isValidGuidePath
}
