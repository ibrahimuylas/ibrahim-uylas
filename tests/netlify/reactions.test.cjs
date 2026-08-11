const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const root = path.resolve(__dirname, '../..')
const loadReactions = () =>
  import('../../netlify/functions/_shared/reactions.mts')

const listFunction = fs.readFileSync(
  path.join(root, 'netlify/functions/reactions-list.mts'),
  'utf8'
)
const voteFunction = fs.readFileSync(
  path.join(root, 'netlify/functions/reactions-vote.mts'),
  'utf8'
)

test('hashes stable anonymous reaction visitors without storing the token', async () => {
  const { reactionVisitorHash } = await loadReactions()
  const token = '7ed08c19-6714-4b46-91aa-6b80caad6680'
  const first = reactionVisitorHash(token)

  assert.match(first, /^[0-9a-f]{64}$/)
  assert.equal(first, reactionVisitorHash(token))
  assert.notEqual(first, token)
  assert.equal(reactionVisitorHash('short'), '')
})

test('validates and normalizes reaction vote payloads', async () => {
  const { reactionVotePayload } = await loadReactions()
  const visitor = '7ed08c19-6714-4b46-91aa-6b80caad6680'
  const prepared = reactionVotePayload({
    path: '/kamp-yazisi?preview=true',
    title: ' Kamp yazısı ',
    reaction: 'love',
    visitor
  })

  assert.ok(prepared)
  assert.equal(prepared.p_path, '/kamp-yazisi/')
  assert.equal(prepared.p_title, 'Kamp yazısı')
  assert.equal(prepared.p_reaction, 'love')
  assert.match(prepared.p_visitor_hash, /^[0-9a-f]{64}$/)
  assert.equal(
    reactionVotePayload({
      path: '/kamp-yazisi/',
      title: 'Kamp yazısı',
      reaction: 'unknown',
      visitor
    }),
    null
  )
})

test('keeps reaction access server-side and rate-limits votes', () => {
  assert.match(listFunction, /path: '\/api\/reactions'/)
  assert.match(listFunction, /'list_article_reactions_internal'/)
  assert.match(voteFunction, /path: '\/api\/reactions\/vote'/)
  assert.match(voteFunction, /'toggle_article_reaction_internal'/)
  assert.match(voteFunction, /windowLimit: 20/)
  assert.match(voteFunction, /aggregateBy: \['domain', 'ip'\]/)
})
