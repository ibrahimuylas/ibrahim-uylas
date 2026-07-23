import React from 'react'
import { Layout, Stack, Main } from '@layout'
import PageTitle from '@components/PageTitle'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import { Link, Text } from 'theme-ui'
import NewsletterExpanded from '@widgets/NewsletterExpanded'

const PageIletisim = props => (
  <Layout {...props}>
    <Seo title='İletişim' />
    <Divider />
    <Stack>
      <Main>
        <PageTitle header='Bana Ulaşmanın Yolları' />
        <Text>
          Diyelim ki bir şey sormak istedin, belki de aklına bir şey takıdı, bir
          merhaba da demek istemiş olabilirsin veya tamamen alakasız şeylerden
          sohbet etmek istemiş de olabilirsin. Hiç önemli değil, ara beni..
          <br />
          Ha eğer numaram yoksa da
          <ul>
            <li>
              <Link
                href='mailto:ibrahim@uylas.net?subject=Mail from Our Site'
                target='_blank'
                rel='noreferrer'
              >
                ibrahim@uylas.net
              </Link>
              'e mail at
            </li>
            olmazsa
            <li>
              instagram üzerinden{' '}
              <Link
                href='https://www.instagram.com/uylasonwheels/'
                target='_blank'
                rel='noreferrer'
              >
                @uylasonwheels
              </Link>
              'a mesaj yaz
            </li>
          </ul>
        </Text>
        <Text>
          Tüm bunlara rağmen sana cevap vermiyorsam ya internetim yoktur ya da
          bu hayata veda etmişimdir. Umarım internetim yoktur :)
        </Text>
        <Divider />
        <NewsletterExpanded />
      </Main>
    </Stack>
  </Layout>
)

export default PageIletisim
