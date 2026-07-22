import React from 'react'
import { Box, Divider } from 'theme-ui'
import { Disqus, CommentCount } from 'gatsby-plugin-disqus'
import createDisqusConfig from './createDisqusConfig'

const PostComments = ({ title, slug, siteUrl }) => {
  // Existing discussions on this site are keyed by URL. Adding a new
  // identifier now would split those threads and hide their older comments.
  const disqusConfig = createDisqusConfig({ title, slug, siteUrl })

  return (
    <Box>
      <Divider />
      <CommentCount config={disqusConfig} placeholder='' />
      <Disqus config={disqusConfig} />
    </Box>
  )
}

export default PostComments
