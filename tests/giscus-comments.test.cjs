const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')
const gatsbyConfig = require(path.join(projectRoot, 'site/gatsby-config.js'))
const postContainer = fs.readFileSync(
  path.join(
    projectRoot,
    'site/src/@elegantstack/gatsby-theme-flexiblog-agency/containers/Post.jsx'
  ),
  'utf8'
)
const giscusComments = fs.readFileSync(
  path.join(
    projectRoot,
    'packages/flow-ui/flow-ui-widgets/src/Post/Post.Comments.Giscus.jsx'
  ),
  'utf8'
)
const deferredComments = fs.readFileSync(
  path.join(projectRoot, 'site/src/components/DeferredComments.jsx'),
  'utf8'
)

test('the site configures Giscus for the existing public repository', () => {
  const themePlugin = gatsbyConfig.plugins.find(
    plugin =>
      plugin && plugin.resolve === '@elegantstack/gatsby-theme-flexiblog-agency'
  )

  assert.ok(themePlugin)
  assert.deepEqual(
    themePlugin.options.services.giscus.repo,
    'ibrahimuylas/ibrahim-uylas'
  )
  assert.equal(themePlugin.options.services.giscus.category, 'Blog Comments')
  assert.equal(themePlugin.options.services.giscus.theme, 'light')
})

test('the article template retains deferred Giscus as the production fallback', () => {
  assert.match(postContainer, /services\.comments\?\.enabled/)
  assert.match(postContainer, /services\.giscus\?\.repoId/)
  assert.match(postContainer, /services\.giscus\?\.categoryId/)
  assert.match(postContainer, /<DeferredComments/)
  assert.match(postContainer, /giscus=\{services\.giscus\}/)
})

test('Giscus uses strict pathname mapping and does not load during SSR', () => {
  assert.match(giscusComments, /typeof window === 'undefined'/)
  assert.match(giscusComments, /data-mapping': 'specific'/)
  assert.match(giscusComments, /data-term.*pathname\.replace/)
  assert.match(giscusComments, /data-strict': '1'/)
  assert.match(giscusComments, /data-reactions-enabled': '0'/)
  assert.match(giscusComments, /data-theme': giscus\.theme \|\| 'light'/)
  assert.match(giscusComments, /data-lang': 'tr'/)
  assert.match(giscusComments, /data-loading': 'lazy'/)
})

test('deferred comments select native comments only when the flag is enabled', () => {
  assert.match(deferredComments, /props\.comments\?\.enabled === true/)
  assert.match(deferredComments, /<Comments/)
  assert.match(deferredComments, /<PostComments/)
})
