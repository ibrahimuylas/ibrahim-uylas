import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import PageTitle from '@components/PageTitle'
import Seo from '@widgets/Seo'

export default function EnglishNotFound(props) {
  return (
    <Layout {...props}>
      <Seo title='Page not found' />
      <Stack>
        <Main>
          <PageTitle
            header='Page not found'
            subheader='Check the address or return to the homepage.'
          />
          <Button variant='primary' as={Link} to='/en/'>
            Back to homepage
          </Button>
        </Main>
      </Stack>
    </Layout>
  )
}
