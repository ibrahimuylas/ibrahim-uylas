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
  assert.doesNotMatch(migration, /create policy/i)
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

test('native comments are feature-flagged while Giscus remains configured', () => {
  assert.match(config, /GATSBY_NATIVE_COMMENTS_ENABLED === 'true'/)
  assert.match(config, /giscus,/)
  assert.match(config, /turnstileSiteKey/)
  assert.match(defaultOptions, /services\.comments/)
  assert.match(post, /services\.comments\?\.enabled/)
  assert.match(post, /services\.giscus\?\.repoId/)
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

test('public comments stay flat, responsive, and avoid iOS focus zoom', () => {
  assert.match(comments, /const fieldStyle = \{[\s\S]*fontSize: '16px'/)
  assert.match(comments, /data-comment-form/)
  assert.match(comments, /p: 0,[\s\S]*bg: 'transparent',[\s\S]*border: 0/)
  assert.match(
    comments,
    /options=\{\{[\s\S]*appearance: 'always',[\s\S]*size: 'flexible'/
  )
  assert.match(
    comments,
    /id='comment-sort'[\s\S]*fontSize: '16px'/
  )
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
  assert.match(
    adminFunction,
    /env\.COMMENTS_OWNER_EMAIL \|\| 'ibrahim@uylas\.net'/
  )
  assert.match(adminFunction, /context\.waitUntil\(drainEmailOutbox/)
})
