export const localizeCollectionData = (data, pageContext) => {
  const { localizedCollection, previewTranslations } = pageContext || {}
  if (!localizedCollection) return data

  const { collectionInfo, posts } = data
  return {
    collectionInfo: { ...collectionInfo, ...localizedCollection },
    posts: {
      ...posts,
      nodes: posts.nodes.map(post => {
        const translation = previewTranslations?.[post.slug]
        if (!translation) return post

        return {
          ...post,
          ...translation,
          category: translation.category && {
            ...post.category,
            ...translation.category
          },
          author: translation.author && {
            ...post.author,
            ...translation.author
          }
        }
      })
    }
  }
}
