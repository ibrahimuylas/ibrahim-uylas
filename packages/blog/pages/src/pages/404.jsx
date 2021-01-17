import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'theme-ui'
import { Stack, Main } from '@layout'
import PageTitle from '@components/PageTitle'
import Section from '@components/Section'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'

export default () => (
  <>
    <Seo title='Page Not Found' />
    <Divider />
    <Stack>
      <Main>
        <Section>
          <PageTitle
            header="Sorry, this page isn't available."
            subheader='You may have mistyped the address or the page may have moved.'
          />
        </Section>
        <Section>
          <Button variant='primary' as={Link} to='/'>
            Go to homepage
          </Button>
        </Section>
      </Main>
    </Stack>
  </>
)
