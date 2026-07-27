const isVideoEmbed = node =>
  node?.type === 'html' &&
  /<div\s+class=["']embedVideo-container["']/.test(node.value)

const readHtmlAttribute = (value, name) => {
  const match = value.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))
  return match ? match[1] : undefined
}

const createAttribute = (name, value) => ({
  type: 'mdxJsxAttribute',
  name,
  value
})

const createDeferredEmbed = ({ src, title, width, height, provider }) => ({
  type: 'mdxJsxFlowElement',
  name: 'DeferredEmbed',
  attributes: [
    createAttribute('src', src),
    createAttribute('provider', provider),
    createAttribute('title', title || 'Gömülü içerik'),
    width && createAttribute('width', width),
    height && createAttribute('height', height)
  ].filter(Boolean),
  children: []
})

const providerFor = src =>
  /youtube(?:-nocookie)?\.com\/embed\//i.test(src) ? 'youtube' : 'route'

const readJsxAttribute = (node, name) =>
  node.attributes?.find(attribute => attribute.name === name)?.value

const replaceExplicitIframe = node => {
  if (node?.type !== 'mdxJsxFlowElement' || node.name !== 'iframe') return false

  const src = readJsxAttribute(node, 'src')
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return false

  const replacement = createDeferredEmbed({
    src,
    provider: providerFor(src),
    title: readJsxAttribute(node, 'title'),
    width: readJsxAttribute(node, 'width'),
    height: readJsxAttribute(node, 'height')
  })

  Object.assign(node, replacement)
  return true
}

const replaceGeneratedVideo = node => {
  if (!isVideoEmbed(node)) return false

  const src = readHtmlAttribute(node.value, 'src')
  if (!src || providerFor(src) !== 'youtube') return false

  const replacement = createDeferredEmbed({
    src,
    provider: 'youtube',
    title: readHtmlAttribute(node.value, 'title') || 'YouTube videosu',
    width: readHtmlAttribute(node.value, 'width'),
    height: readHtmlAttribute(node.value, 'height')
  })

  Object.assign(node, replacement)
  delete node.value
  return true
}

const unwrapVideoParagraphs = node => {
  if (!Array.isArray(node?.children)) return

  node.children.forEach(child => {
    if (
      child.type === 'paragraph' &&
      child.children?.length === 1 &&
      isVideoEmbed(child.children[0])
    ) {
      const [videoEmbed] = child.children
      if (replaceGeneratedVideo(videoEmbed)) {
        Object.assign(child, videoEmbed)
        delete child.position
      }
      return
    }

    replaceExplicitIframe(child)
    replaceGeneratedVideo(child)
    unwrapVideoParagraphs(child)
  })
}

module.exports = ({ markdownAST }) => {
  unwrapVideoParagraphs(markdownAST)
}

module.exports.createDeferredEmbed = createDeferredEmbed
module.exports.providerFor = providerFor
