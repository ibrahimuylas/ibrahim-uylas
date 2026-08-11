import React, { Suspense } from 'react'
export { PostBody, MdxContentProvider } from './Post.Body'
export { PostFooter } from './Post.Footer'
export { PostHead } from './Post.Head'
export { PostImage } from './Post.Image'
export { PostTagsShare } from './Post.Tags.Share'

const PostCommentsFacebookLazy = React.lazy(
  () => import('./Post.Comments.Facebook')
)
export const PostCommentsFacebook = props => (
  <Suspense fallback={null}>
    <PostCommentsFacebookLazy {...props} />
  </Suspense>
)

const PostCommentsGraphLazy = React.lazy(() => import('./Post.Comments.Graph'))
export const PostCommentsGraph = props => (
  <Suspense fallback={null}>
    <PostCommentsGraphLazy {...props} />
  </Suspense>
)
