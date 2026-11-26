import React from 'react'
import { Link } from 'gatsby'
import { Button } from 'theme-ui'
import { Layout, Main, Stack } from '@layout'
import PageTitle from '@components/PageTitle'
import Seo from '@widgets/Seo'
import { copy } from '../i18n/copy'
import { getPageLanguage } from '../i18n/language'

export default function NotFound(props) {
  const language = getPageLanguage(props.location?.pathname)
  const title = language === 'en' ? 'Page not found' : 'Sayfa bulunamadı'
  const description =
    language === 'en'
      ? 'Check the address or return to the homepage.'
      : 'Adresi kontrol edebilir veya ana sayfaya dönebilirsin.'

  return (
    <Layout {...props}>
      <Seo title={title} description={description} />
      <Stack>
        <Main>
          <PageTitle header={title} subheader={description} />
          <Button variant='primary' as={Link} to={copy[language].homePath}>
            {copy[language].backHome}
          </Button>
        </Main>
      </Stack>
    </Layout>
  )
}
