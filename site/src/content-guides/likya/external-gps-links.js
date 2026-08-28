const isWikilocUrl = url =>
  typeof url === 'string' &&
  /^https:\/\/(?:(?:[a-z]{2}|www)\.)?wikiloc\.com\//.test(url)

const isVerifiedExternalGpsLink = link =>
  link?.provider === 'wikiloc' &&
  link.routeMatchStatus === 'verified' &&
  link.externalDownloadOnly === true &&
  !link.localFilePath &&
  isWikilocUrl(link.url) &&
  [
    'sourceId',
    'recordId',
    'author',
    'recordedAt',
    'uploadedAt',
    'reviewedAt'
  ].every(field => Boolean(link[field]))

module.exports = {
  isVerifiedExternalGpsLink,
  isWikilocUrl
}
