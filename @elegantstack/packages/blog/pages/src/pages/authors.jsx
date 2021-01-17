import React from 'react'
import { Stack, Main } from '@layout'
import PageTitle from '@components/PageTitle'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import AuthorExpanded from '@widgets/AuthorExpanded'
import { useBlogAuthors } from '@helpers-blog'

export default () => {
  const authors = useBlogAuthors()

  return (
    <>
      <Seo title='Our Team' />
      <Divider />
      <Stack effectProps={{ effect: 'fadeInDown' }}>
        <PageTitle
          header='Team Members'
          subheader='FlexiBlog theme comes with a pre-made contact form component. You can integrate this form with serverless services such as Formspree, Getform, FormKeep and others to receive form submissions via email.'
        />
      </Stack>
      <Stack>
        <Main>
          {authors.map((author) => (
            <>
              <Divider />
              <AuthorExpanded author={author} withLink />
            </>
          ))}
        </Main>
      </Stack>
    </>
  )
}
