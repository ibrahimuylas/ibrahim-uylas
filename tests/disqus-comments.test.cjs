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

test('the site enables the existing Disqus comment thread', () => {
  const themePlugin = gatsbyConfig.plugins.find(
    plugin => plugin && plugin.resolve === '@elegantstack/gatsby-theme-flexiblog-agency'
  )

  assert.ok(themePlugin)
  assert.equal(themePlugin.options.services.disqus, 'ibrahim-uylas')
  assert.match(postContainer, /DeferredComments/)
  assert.match(postContainer, /services\.disqus/)
})
