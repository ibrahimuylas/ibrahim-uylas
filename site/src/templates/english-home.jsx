import React from 'react'
import { Heading, Text } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import Seo from '@widgets/Seo'
import LocaleLink from '../i18n/LocaleLink'

export default function EnglishHome(props) {
  return (
    <Layout {...props}>
      <Seo title='Home' />
      <Stack>
        <Main>
          <Heading as='h1'>Camping and hiking with İbrahim Uylaş</Heading>
          <Text as='p'>
            Personal stories from the trail, camping guides and advice on
            choosing your gear.
          </Text>
          <Heading as='h2'>From the blog</Heading>
          <ul>
            <li>
              <LocaleLink to='/outdoor-ne-demek/' language='en'>
                What Does “Outdoor” Mean?
              </LocaleLink>
            </li>
            <li>
              <LocaleLink to='/category/kampcilik/' language='en'>
                Camping guide
              </LocaleLink>
            </li>
          </ul>
        </Main>
      </Stack>
    </Layout>
  )
}
