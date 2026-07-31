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
})

test('the article template only mounts deferred Giscus comments when configured', () => {
  assert.match(postContainer, /services\.giscus\?\.repoId/)
  assert.match(postContainer, /services\.giscus\?\.categoryId/)
  assert.match(postContainer, /<DeferredComments/)
  assert.match(postContainer, /giscus=\{services\.giscus\}/)
})

test('Giscus uses strict pathname mapping and does not load during SSR', () => {
  assert.match(giscusComments, /typeof window === 'undefined'/)
  assert.match(giscusComments, /data-mapping': 'pathname'/)
  assert.match(giscusComments, /data-strict': '1'/)
  assert.match(giscusComments, /data-reactions-enabled': '1'/)
  assert.match(giscusComments, /data-lang': 'tr'/)
  assert.match(giscusComments, /data-loading': 'lazy'/)
})
