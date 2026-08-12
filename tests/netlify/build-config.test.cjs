const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {
  BUILD_PATHS,
  getBuildDecision
} = require('../../scripts/netlify-ignore-build.cjs')

const projectRoot = path.resolve(__dirname, '..', '..')
const readProjectFile = relativePath =>
  fs.readFileSync(path.join(projectRoot, relativePath), 'utf8')

test('Netlify preserves Gatsby cache and delegates ignore decisions', () => {
  const config = readProjectFile('netlify.toml')

  assert.match(config, /command = "npm run build"/)
  assert.doesNotMatch(config, /gatsby clean|npm run clean/)
  assert.match(config, /ignore = "node \.\/scripts\/netlify-ignore-build\.cjs"/)
})

test('local builds can override the conservative Gatsby worker count', () => {
  const rootPackage = JSON.parse(readProjectFile('package.json'))
  const sitePackage = JSON.parse(readProjectFile('site/package.json'))

  assert.equal(
    rootPackage.scripts['build:local'],
    'GATSBY_CPU_COUNT=4 npm run build'
  )
  assert.equal(
    sitePackage.scripts['build:gatsby'],
    'GATSBY_CPU_COUNT=${GATSBY_CPU_COUNT:-2} gatsby build'
  )
})

test('ignore policy rebuilds every deploy-affecting project boundary', () => {
  assert.deepEqual(BUILD_PATHS, [
    '.nvmrc',
    'deno.lock',
    'netlify',
    'netlify.toml',
    'package.json',
    'package-lock.json',
    'packages',
    'scripts/netlify-ignore-build.cjs',
    'site'
  ])
})

test('ignore policy skips unrelated changes and fails open', () => {
  const runWithStatus = status => (_command, args, options) => {
    assert.equal(args[0], 'diff')
    assert.equal(args[1], '--quiet')
    assert.deepEqual(args.slice(-BUILD_PATHS.length), BUILD_PATHS)
    assert.deepEqual(options, { stdio: 'ignore' })
    return { status }
  }

  assert.deepEqual(
    getBuildDecision({
      cachedRef: 'before',
      commitRef: 'after',
      run: runWithStatus(0)
    }),
    { shouldBuild: false, reason: 'no deploy-affecting changes' }
  )
  assert.equal(
    getBuildDecision({
      cachedRef: 'before',
      commitRef: 'after',
      run: runWithStatus(1)
    }).shouldBuild,
    true
  )
  assert.equal(
    getBuildDecision({
      cachedRef: 'before',
      commitRef: 'after',
      run: runWithStatus(128)
    }).shouldBuild,
    true
  )
  assert.equal(
    getBuildDecision({ cachedRef: '', commitRef: 'after' }).shouldBuild,
    true
  )
})
