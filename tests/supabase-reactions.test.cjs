const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const root = path.resolve(__dirname, '..')
const migration = fs.readFileSync(
  path.join(
    root,
    'supabase/migrations/20260811162039_add_article_reactions.sql'
  ),
  'utf8'
)
const component = fs.readFileSync(
  path.join(root, 'site/src/components/ArticleReactions.jsx'),
  'utf8'
)
const post = fs.readFileSync(
  path.join(
    root,
    'site/src/@elegantstack/gatsby-theme-flexiblog-agency/containers/Post.jsx'
  ),
  'utf8'
)

test('reaction tables keep imported totals separate from anonymous native votes', () => {
  assert.match(migration, /create table public\.article_reaction_threads/)
  assert.match(migration, /create table public\.article_reaction_totals/)
  assert.match(migration, /imported_count integer not null default 0/)
  assert.match(migration, /create table public\.article_reaction_votes/)
  assert.match(migration, /primary key \(thread_id, visitor_hash\)/)
  assert.match(
    migration,
    /coalesce\(totals\.imported_count, 0\) \+ coalesce\(native_votes\.vote_count, 0\)/
  )
})

test('reaction tables and RPCs remain restricted to service_role', () => {
  for (const table of [
    'article_reaction_threads',
    'article_reaction_totals',
    'article_reaction_votes'
  ]) {
    assert.match(
      migration,
      new RegExp(`alter table public\\.${table} enable row level security`)
    )
    assert.match(
      migration,
      new RegExp(
        `revoke all on table public\\.${table} from public, anon, authenticated`
      )
    )
  }

  assert.match(migration, /security invoker/g)
  assert.match(
    migration,
    /revoke all on function public\.list_article_reactions_internal\(text,text\)[\s\S]+from public, anon, authenticated/
  )
  assert.match(
    migration,
    /grant execute on function public\.toggle_article_reaction_internal\(text,text,text,text\)[\s\S]+to service_role/
  )
})

test('articles render the six accessible native reactions', () => {
  assert.match(post, /services\.reactions\?\.enabled/)
  assert.match(post, /<ArticleReactions/)
  assert.match(component, /role='toolbar'/)
  assert.match(component, /aria-pressed=/)
  for (const label of [
    'Beğendim',
    'Eğlendim',
    'Bayıldım',
    'Şaşırdım',
    'Kızdım',
    'Üzüldüm'
  ]) {
    assert.match(component, new RegExp(label))
  }
})
