const YOUTUBE_IFRAME_WITHOUT_REFERRER_POLICY =
  /<iframe\b(?=[^>]*\bsrc=["']https:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/)(?![^>]*\breferrerpolicy=)/i

const isVideoEmbed = node =>
  node?.type === 'html' &&
  /<div\s+class=["']embedVideo-container["']/.test(node.value)

const addYouTubeReferrerPolicy = value =>
  value.replace(
    YOUTUBE_IFRAME_WITHOUT_REFERRER_POLICY,
    `<iframe referrerpolicy="strict-origin-when-cross-origin"`
  )

const unwrapVideoParagraphs = node => {
  if (!Array.isArray(node?.children)) return

  node.children.forEach(child => {
    if (
      child.type === 'paragraph' &&
      child.children?.length === 1 &&
      isVideoEmbed(child.children[0])
    ) {
      const [videoEmbed] = child.children
      child.type = videoEmbed.type
      child.value = addYouTubeReferrerPolicy(videoEmbed.value)
      delete child.children
      delete child.position
      return
    }

    unwrapVideoParagraphs(child)
  })
}

module.exports = ({ markdownAST }) => {
  unwrapVideoParagraphs(markdownAST)
}
