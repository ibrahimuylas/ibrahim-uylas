const isVideoEmbed = node =>
  node?.type === 'html' &&
  /<div\s+class=["']embedVideo-container["']/.test(node.value)

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
      child.value = videoEmbed.value
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
