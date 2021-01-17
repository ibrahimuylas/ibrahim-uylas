import React from 'react'
import { MDXRenderer } from 'gatsby-plugin-mdx'

export const PostBody = ({ body }) => {
  return <MDXRenderer>{body}</MDXRenderer>
}
