const likya = require('../src/content-guides/likya')
const guideMeta = require('../src/content-guides/likya/guide-meta')
const {
  evaluateLikyaRelease,
  formatLikyaReleaseReadiness
} = require('../src/content-guides/likya/release-readiness')

const report = evaluateLikyaRelease({
  ...likya,
  guideMeta,
  regions: [
    likya.westernLikyaRegion,
    likya.centralLikyaRegion,
    likya.easternLikyaRegion
  ]
})

process.stdout.write(`${formatLikyaReleaseReadiness(report)}\n`)

if (
  process.env.LIKYA_REQUIRE_READY === '1' &&
  !report.canEnableCanonicalShell
) {
  process.exitCode = 1
}
