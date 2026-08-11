'use strict'

const assert = require('node:assert/strict')
const { test } = require('node:test')
const {
  countsFromResponse,
  prepareReactionImport,
  prepareReactionThreads
} = require('../scripts/import-disqus-reactions.cjs')

const exportXml = `<?xml version="1.0" encoding="UTF-8"?>
<disqus xmlns="http://disqus.com"
  xmlns:dsq="http://disqus.com/disqus-internals">
  <thread dsq:id="101">
    <link>https://www.ibrahimuylas.com/first?utm_source=old</link>
    <title>First article</title>
  </thread>
  <thread dsq:id="101">
    <link>https://www.ibrahimuylas.com/first/</link>
    <title>Duplicate row</title>
  </thread>
  <thread dsq:id="102">
    <link>https://ibrahimuylas.com/first/</link>
    <title>Legacy copy of first article</title>
  </thread>
  <thread dsq:id="103">
    <link>https://ibrahimuylas.com/second/</link>
    <title>Second article</title>
  </thread>
  <thread dsq:id="104">
    <link>https://example.com/external/</link>
    <title>External article</title>
  </thread>
</disqus>`

const reactions = {
  101: {
    eligible: true,
    reactions: [
      { text: 'Beğendim', votes: 2 },
      { text: 'Bayıldım', votes: 3 }
    ]
  },
  102: {
    eligible: false,
    reactions: [{ text: 'Beğendim', votes: 5 }]
  },
  103: {
    eligible: false,
    reactions: [{ text: 'Not configured', votes: 99 }]
  }
}

const mockFetch = async url => {
  const thread = new URL(url).searchParams.get('thread')
  return {
    ok: true,
    status: 200,
    async json() {
      return { code: 0, response: reactions[thread] }
    }
  }
}

test('deduplicates exported thread rows and rejects external paths', () => {
  const prepared = prepareReactionThreads(exportXml)

  assert.deepEqual(prepared.summary, {
    exportedThreadRows: 5,
    skippedThreads: 1,
    uniqueThreadPaths: 3,
    uniqueDisqusThreads: 3
  })
  assert.equal(prepared.threads[0].path, '/first/')
})

test('maps the configured Turkish Disqus reactions only', () => {
  assert.deepEqual(
    countsFromResponse({
      reactions: [
        { text: 'Beğendim', votes: 4 },
        { text: 'Üzüldüm', votes: 2 },
        { text: 'Unknown', votes: 100 },
        { text: 'Kızdım', votes: -1 }
      ]
    }),
    { like: 4, funny: 0, love: 0, surprised: 0, angry: 0, sad: 2 }
  )
})

test('sums multiple Disqus threads per article without double counting rows', async () => {
  const plan = await prepareReactionImport(exportXml, {
    apiKey: 'test-key',
    concurrency: 2,
    fetchImpl: mockFetch
  })

  assert.equal(plan.articles.length, 2)
  assert.deepEqual(plan.articles[0], {
    path: '/first/',
    title: 'First article',
    counts: {
      like: 7,
      funny: 0,
      love: 3,
      surprised: 0,
      angry: 0,
      sad: 0
    },
    sourceIds: ['101', '102']
  })
  assert.deepEqual(plan.summary, {
    exportedThreadRows: 5,
    skippedThreads: 1,
    uniqueThreadPaths: 3,
    uniqueDisqusThreads: 3,
    eligibleDisqusThreads: 1,
    disqusThreadsWithVotes: 2,
    articlePaths: 2,
    articlePathsWithVotes: 1,
    totalImportedVotes: 10,
    byReaction: {
      like: 7,
      funny: 0,
      love: 3,
      surprised: 0,
      angry: 0,
      sad: 0
    }
  })
})
