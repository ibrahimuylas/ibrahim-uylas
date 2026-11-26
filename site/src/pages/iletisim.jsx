import React from 'react'
import { Layout, Stack, Main } from '@layout'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import { Box, Heading, Text } from 'theme-ui'
import ContactForm from '../components/ContactForm'
import InstagramShowcase from '../components/InstagramShowcase'
import { contact } from '../i18n/contact'
import { getPageLanguage } from '../i18n/language'

const PageIletisim = props => {
  const language = getPageLanguage(props.location?.pathname)
  const labels = contact[language]

  return (
    <Layout {...props}>
      <Seo title={labels.title} description={labels.description} />
      <Stack effectProps={{ effect: false }}>
        <Main
          sx={{
            py: [4, 4, 5]
          }}
        >
          <Box>
            <Text
              as='p'
              sx={{
                color: `alpha`,
                fontSize: 1,
                fontWeight: `bold`,
                letterSpacing: `0.14em`,
                textTransform: `uppercase`,
                mb: 3
              }}
            >
              {labels.title}
            </Text>
            <Heading
              as='h1'
              sx={{
                color: `heading`,
                fontFamily: `'DM Serif Display', Georgia, serif`,
                fontSize: [7, 8],
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: `-0.035em`,
                whiteSpace: [`normal`, `normal`, `normal`, `nowrap`],
                mb: 4
              }}
            >
              {labels.heading}
            </Heading>
            <Text
              as='p'
              sx={{
                color: `text`,
                fontSize: 2,
                lineHeight: 1.75,
                whiteSpace: [`normal`, `normal`, `normal`, `nowrap`],
                m: 0
              }}
            >
              {labels.intro}
            </Text>
          </Box>

          <Box sx={{ mt: [4, 4, 5] }}>
            <ContactForm language={language} />
          </Box>
        </Main>
      </Stack>

      <Divider space={2} />
      <Stack effectProps={{ effect: false }}>
        <InstagramShowcase language={language} />
      </Stack>
    </Layout>
  )
}

export default PageIletisim
