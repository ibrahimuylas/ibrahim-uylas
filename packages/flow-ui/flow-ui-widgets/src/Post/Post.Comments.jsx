import React from 'react'
import { Box, Divider } from 'theme-ui'
import { DiscussionEmbed, CommentCount } from 'disqus-react'
import createDisqusConfig from './createDisqusConfig'

const PostComments = ({ title, slug, siteUrl, shortname }) => {
  // Existing discussions on this site are keyed by URL. Adding a new
  // identifier now would split those threads and hide their older comments.
  const disqusConfig = createDisqusConfig({ title, slug, siteUrl })

  return (
    <Box>
      <Divider />
      <CommentCount
        shortname={shortname}
        config={disqusConfig}
        placeholder=''
      />
      <DiscussionEmbed shortname={shortname} config={disqusConfig} />
    </Box>
  )
}

export default PostComments
