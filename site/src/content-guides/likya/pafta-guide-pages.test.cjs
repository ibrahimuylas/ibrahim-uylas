const assert = require('node:assert/strict')
const test = require('node:test')

const {
  buildPublishedPaftaGuidePages,
  isValidGuidePath
} = require('./pafta-guide-pages')

const section = {
  id: 'ktb-pafta-1',
  officialTitle: 'Pafta 1: Ovacık – Kirme'
}

const record = {
  sectionId: section.id,
  guidePath: '/likya-yolu/pafta-1-ovacik-kirme/',
  summary: 'Pafta için test özeti.'
}

test('creates public guide pages only for paftas that passed their own gate', () => {
  const pages = buildPublishedPaftaGuidePages({
    routeSections: [section],
    paftaPublicationRecords: [record],
    publicationReadiness: [
      { sectionId: section.id, canPublish: true },
      { sectionId: 'ktb-pafta-2', canPublish: false }
    ]
  })

  assert.deepEqual(pages, [
    {
      path: '/likya-yolu/pafta-1-ovacik-kirme/',
      sectionId: section.id,
      title: section.officialTitle,
      summary: record.summary
    }
  ])
})

test('rejects paths outside the reserved public pafta area', () => {
  assert.equal(isValidGuidePath('/likya-yolu/pafta-1-ovacik-kirme/'), true)
  assert.equal(isValidGuidePath('/likya-yolu/'), false)
  assert.equal(isValidGuidePath('/category/rotalar/'), false)
})
