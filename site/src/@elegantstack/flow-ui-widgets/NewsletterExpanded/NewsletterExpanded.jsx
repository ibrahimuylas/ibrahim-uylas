import React from 'react'
import { css } from 'theme-ui'
import { Card, Text, Heading, Box } from 'theme-ui'
import NewsletterForm from '@components/NewsletterForm'
import useMailChimp from '@helpers/useMailChimp'
import { FaRegPaperPlane, FaWind } from 'react-icons/fa'
import { copy } from '../../../i18n/copy'

const styles = {
  card: {
    position: `relative`
  },
  wrapper: {
    maxWidth: 500,
    textAlign: `center`,
    mx: `auto`,
    py: 3
  },
  icons: {
    display: [`none`, null, `block`],
    position: `absolute`,
    top: [null, null, `1rem`, `-3rem`],
    left: [null, null, `1rem`, `5rem`],
    svg: {
      display: `block`
    }
  },
  plane: {
    fontSize: [null, null, `6rem`, `9rem`],
    color: `beta`
  },
  wind: {
    fontSize: [null, null, `5rem`, `7rem`],
    color: `omegaLight`,
    transform: `rotate(120deg)`,
    mt: `0.5rem`,
    ml: `-3rem`
  },
  form: {
    maxWidth: 300,
    mx: `auto`,
    mt: 4
  }
}

const NewsletterExpanded = ({ simple = false, language = 'tr' }) => {
  const labels = copy[language].newsletter
  const { handleSubmit, canSubmit, submitting, message, success } =
    useMailChimp()

  return (
    <Card variant='paper' sx={styles.card}>
      <Box sx={styles.wrapper}>
        {!simple && (
          <Box sx={styles.icons}>
            <FaRegPaperPlane css={css(styles.plane)} />
            <FaWind css={css(styles.wind)} />
          </Box>
        )}
        <Heading variant='h2'>{labels.title}</Heading>
        <Text variant='p'>{labels.description}</Text>
        <Box sx={styles.form}>
          <NewsletterForm
            language={language}
            {...{
              handleSubmit,
              canSubmit,
              submitting,
              message,
              success
            }}
          />
        </Box>
      </Box>
    </Card>
  )
}

export default NewsletterExpanded
