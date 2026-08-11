const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')

const root = path.resolve(__dirname, '..')
const migration = fs.readFileSync(
  fs
    .readdirSync(path.join(root, 'supabase/migrations'))
    .filter(file => file.endsWith('_add_supabase_comments.sql'))
    .map(file => path.join(root, 'supabase/migrations', file))[0],
  'utf8'
)
const visibilityFix = fs.readFileSync(
  fs
    .readdirSync(path.join(root, 'supabase/migrations'))
    .filter(file => file.endsWith('_fix_comment_visibility_and_outbox.sql'))
    .map(file => path.join(root, 'supabase/migrations', file))[0],
  'utf8'
)
const deletionMigration = fs.readFileSync(
  fs
    .readdirSync(path.join(root, 'supabase/migrations'))
    .filter(file => file.endsWith('_add_admin_comment_deletion.sql'))
    .map(file => path.join(root, 'supabase/migrations', file))[0],
  'utf8'
)
const sourceCleanupMigration = fs.readFileSync(
  fs
    .readdirSync(path.join(root, 'supabase/migrations'))
    .filter(file => file.endsWith('_remove_third_party_comment_source.sql'))
    .map(file => path.join(root, 'supabase/migrations', file))[0],
  'utf8'
)
const contactlessAdminMigration = fs.readFileSync(
  fs
    .readdirSync(path.join(root, 'supabase/migrations'))
    .filter(file =>
      file.endsWith('_include_contactless_comments_in_admin.sql')
    )
    .map(file => path.join(root, 'supabase/migrations', file))[0],
  'utf8'
)
const config = fs.readFileSync(path.join(root, 'site/gatsby-config.js'), 'utf8')
const defaultOptions = fs.readFileSync(
  path.join(
    root,
    'packages/blog/gatsby-blog-core/src/utils/default.options.js'
  ),
  'utf8'
)
const post = fs.readFileSync(
  path.join(
    root,
    'site/src/@elegantstack/gatsby-theme-flexiblog-agency/containers/Post.jsx'
  ),
  'utf8'
)
const comments = fs.readFileSync(
  path.join(root, 'site/src/components/Comments.jsx'),
  'utf8'
)
const submitFunction = fs.readFileSync(
  path.join(root, 'netlify/functions/comments-submit.mts'),
  'utf8'
)
const adminFunction = fs.readFileSync(
  path.join(root, 'netlify/functions/comments-admin.mts'),
  'utf8'
)
const admin = fs.readFileSync(
  path.join(root, 'site/src/cms/comments-management.jsx'),
  'utf8'
)

test('comments schema enables RLS and reserves access for service_role', () => {
  for (const table of [
    'comment_threads',
    'comments',
    'comment_contacts',
    'comment_email_outbox',
    'comment_moderation_events'
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
  assert.match(
    migration,
    /grant execute on function public\.submit_comment_internal[\s\S]+to service_role/
  )
  assert.match(
    migration,
    /source text not null default 'native' check \(source in \('native', 'disqus'\)\)/
  )
  assert.doesNotMatch(migration, /create policy/i)
})

test('comment sources exclude the removed discussion integration', () => {
  assert.match(
    sourceCleanupMigration,
    /drop constraint comments_source_check[\s\S]+check \(source in \('native', 'disqus'\)\)/
  )
})

test('admin comment listing includes imported comments without contact data', () => {
  assert.match(
    contactlessAdminMigration,
    /left join public\.comment_contacts cc on cc\.comment_id = c\.id/
  )
  assert.match(
    contactlessAdminMigration,
    /coalesce\(cc\.notify_replies, false\)/
  )
  assert.match(
    contactlessAdminMigration,
    /revoke all on function public\.list_comments_admin_internal\(integer\)[\s\S]+from public, anon, authenticated/
  )
  assert.match(
    contactlessAdminMigration,
    /grant execute on function public\.list_comments_admin_internal\(integer\)[\s\S]+to service_role/
  )
})

test('public comment listing excludes hidden conversations and outbox claims recover', () => {
  assert.match(
    visibilityFix,
    /where c\.root_comment_id is null\s+and c\.status = 'published'/
  )
  assert.match(
    visibilityFix,
    /where q\.root_comment_id = r\.id and q\.status = 'published'/
  )
  assert.match(visibilityFix, /state = 'sending'[\s\S]+interval '15 minutes'/)
  assert.match(
    visibilityFix,
    /grant execute on function public\.claim_comment_email_jobs_internal\(integer\) to service_role/
  )
})

test('native comments are the only article comment integration', () => {
  assert.match(config, /GATSBY_NATIVE_COMMENTS_ENABLED === 'true'/)
  assert.match(config, /turnstileSiteKey/)
  assert.match(defaultOptions, /services\.comments/)
  assert.match(post, /services\.comments\?\.enabled/)
})

test('comment submission route uses Netlify-readable typed config', () => {
  assert.match(submitFunction, /export const config: Config =/)
  assert.match(submitFunction, /path: '\/api\/comments\/submit'/)
  assert.doesNotMatch(submitFunction, /}\s+as Config/)
})

test('public UI collects required identity privately and supports replies/order', () => {
  assert.match(comments, /name='name'/)
  assert.match(comments, /name='email'/)
  assert.match(comments, /name='comment'/)
  assert.match(comments, /notifyReplies/)
  assert.match(comments, /turnstileToken/)
  assert.match(comments, /appearance: 'always'/)
  assert.doesNotMatch(comments, /appearance: 'interaction-only'/)
  assert.match(comments, /value='newest'/)
  assert.match(comments, /value='oldest'/)
  assert.match(comments, /replyTo/)
  assert.match(comments, /E-posta adresin yayınlanmaz/)
  assert.match(comments, /response\.text\(\)/)
  assert.match(comments, /responseText \? JSON\.parse\(responseText\) : null/)
  assert.match(comments, /!result\?\.ok/)
})

test('public comments group replies, stay responsive, and avoid iOS focus zoom', () => {
  assert.match(comments, /const fieldStyle = \{[\s\S]*fontSize: '16px'/)
  assert.match(comments, /data-comment-form/)
  assert.match(comments, /p: 0,[\s\S]*bg: 'transparent',[\s\S]*border: 0/)
  assert.match(
    comments,
    /options=\{\{[\s\S]*appearance: 'always',[\s\S]*size: 'flexible'/
  )
  assert.match(comments, /id='comment-sort'[\s\S]*fontSize: '16px'/)
  assert.match(comments, /setForm\(initialForm\)/)
  assert.match(comments, /setMessage\(''\)[\s\S]*}, 7000\)/)
  assert.match(comments, /theme: colorMode === 'dark' \? 'dark' : 'light'/)
  assert.match(comments, /data-comment-thread/)
  assert.match(comments, /data-comment-replies/)
  assert.doesNotMatch(comments, /variant='secondary'/)
})

test('comments management extends Decap and reuses its GitHub session', () => {
  assert.match(
    config,
    /modulePath: `\$\{__dirname\}\/src\/cms\/comments-management\.jsx`/
  )
  assert.match(admin, /COMMENTS_ROUTE = '\/comments-management'/)
  assert.match(admin, /decap-cms-user/)
  assert.match(admin, /user\?\.token/)
  assert.match(admin, /data-comments-management-nav/)
  assert.doesNotMatch(admin, /signInWithOAuth|signInWithOtp|window\.prompt/)
  assert.equal(
    fs.existsSync(path.join(root, 'site/src/pages/yorum-yonetimi.jsx')),
    false
  )
  assert.match(admin, /'hide'/)
  assert.match(admin, /'restore'/)
  assert.match(admin, /'edit'/)
  assert.match(admin, /action: 'reply'/)
  assert.match(admin, /groupedComments\.map/)
  assert.match(admin, /request\('DELETE', \{ id: comment\.id \}\)/)
  assert.match(admin, /window\.confirm/)
  assert.match(admin, /aria-label='Sil'/)
  assert.match(admin, /comments-management-route-header/)
  assert.match(admin, /nav::-webkit-scrollbar \{ display: none; \}/)
  assert.match(adminFunction, /request\.method === 'DELETE'/)
  assert.match(adminFunction, /'delete_comment_internal'/)
  assert.match(
    adminFunction,
    /env\.COMMENTS_OWNER_EMAIL \|\| 'ibrahim@uylas\.net'/
  )
  assert.match(adminFunction, /context\.waitUntil\(drainEmailOutbox/)
})

test('admin deletion cascades replies and remains restricted to service_role', () => {
  assert.match(
    deletionMigration,
    /comments_root_comment_id_fkey[\s\S]+on delete cascade/
  )
  assert.match(
    deletionMigration,
    /comments_reply_to_comment_id_fkey[\s\S]+on delete cascade/
  )
  assert.match(
    deletionMigration,
    /comment_moderation_events_comment_id_fkey[\s\S]+on delete set null/
  )
  assert.match(deletionMigration, /'delete'/)
  assert.match(
    deletionMigration,
    /grant delete on table public\.comments to service_role/
  )
  assert.match(
    deletionMigration,
    /create or replace function public\.delete_comment_internal/
  )
  assert.match(
    deletionMigration,
    /revoke all on function public\.delete_comment_internal\(bigint,uuid\)[\s\S]+from public, anon, authenticated/
  )
  assert.match(
    deletionMigration,
    /grant execute on function public\.delete_comment_internal\(bigint,uuid\)[\s\S]+to service_role/
  )
})
