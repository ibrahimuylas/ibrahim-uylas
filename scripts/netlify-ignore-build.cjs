const { spawnSync } = require('node:child_process')

const BUILD_PATHS = Object.freeze([
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

const getBuildDecision = ({ cachedRef, commitRef, run = spawnSync }) => {
  if (!cachedRef || !commitRef) {
    return { shouldBuild: true, reason: 'missing commit reference' }
  }

  const result = run(
    'git',
    ['diff', '--quiet', cachedRef, commitRef, '--', ...BUILD_PATHS],
    { stdio: 'ignore' }
  )

  if (result.status === 0) {
    return { shouldBuild: false, reason: 'no deploy-affecting changes' }
  }

  if (result.status === 1) {
    return { shouldBuild: true, reason: 'deploy-affecting changes detected' }
  }

  return { shouldBuild: true, reason: 'change detection failed open' }
}

if (require.main === module) {
  const decision = getBuildDecision({
    cachedRef: process.env.CACHED_COMMIT_REF,
    commitRef: process.env.COMMIT_REF
  })

  console.log(`Netlify build decision: ${decision.reason}`)
  process.exitCode = decision.shouldBuild ? 1 : 0
}

module.exports = { BUILD_PATHS, getBuildDecision }
