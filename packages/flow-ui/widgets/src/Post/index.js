import loadable from '@loadable/component'

export { PostBody } from './Post.Body'
export { PostFooter } from './Post.Footer'
export { PostHead } from './Post.Head'
export { PostImage } from './Post.Image'
export { PostTags } from './Post.Tags'
export { PostTagsShare } from './Post.Tags.Share'

export const PostComments = loadable(() =>
  import(/* webpackPrefetch: true */ './Post.Comments')
)
export const PostShare = loadable(() =>
  import(/* webpackPrefetch: true */ './Post.Share')
)
