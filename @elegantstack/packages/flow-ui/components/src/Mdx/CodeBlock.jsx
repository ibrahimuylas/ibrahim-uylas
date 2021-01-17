import React from 'react'
import loadable from '@loadable/component'
import { Styled } from 'theme-ui'

const Prism = loadable(() => import('@theme-ui/prism'))

const CodeBlock = props => (
  <Prism {...props} fallback={<Styled.pre>{props.children}</Styled.pre>} />
)

export default CodeBlock
