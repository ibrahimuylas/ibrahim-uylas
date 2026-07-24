import React, { Suspense } from 'react'
import { Box } from 'theme-ui'

export const Prism = React.lazy(() => import('@theme-ui/prism'))

const CodeBlock = props => (
  <Suspense
    fallback={
      <Box as='pre' variant='styles.pre'>
        {props.children}
      </Box>
    }
  >
    <Prism {...props} />
  </Suspense>
)

export const InlineCode = props => (
  <Box as='code' variant='styles.code' {...props} />
)

export const Pre = ({ children, ...props }) => {
  const code = React.Children.toArray(children).find(React.isValidElement)

  if (!code) {
    return (
      <Box as='pre' variant='styles.pre' {...props}>
        {children}
      </Box>
    )
  }

  return <CodeBlock {...props} {...code.props} />
}

export default CodeBlock
