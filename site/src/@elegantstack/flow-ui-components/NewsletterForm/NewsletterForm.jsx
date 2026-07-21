import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box, Input, Button, Message, Spinner } from 'theme-ui'
import { currentPagePath, trackEvent } from '../../../utils/analytics'

const styles = {
  msg: {
    mb: 0
  },
  button: {
    display: `block`,
    mx: `auto`
  }
}

const NewsletterForm = ({
  handleSubmit,
  canSubmit,
  submitting,
  message,
  success
}) => {
  const hasTrackedSuccess = useRef(false)

  useEffect(() => {
    if (!success || hasTrackedSuccess.current) return

    trackEvent('newsletter_signup', {
      form_name: 'post_newsletter',
      page_path: currentPagePath()
    })
    hasTrackedSuccess.current = true
  }, [success])

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <Message
          variant={success ? 'success' : 'error'}
          sx={styles.msg}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {canSubmit && (
        <>
          <Box variant='forms.row'>
            <Input
              name='email'
              type='email'
              placeholder='Email adresiniz buraya...'
              aria-label='Email adresi'
              required
            />
          </Box>
          <Button
            type='submit'
            variant={success || submitting ? 'disabled' : 'primary'}
            disabled={success || submitting}
            sx={styles.button}
          >
            Kayıt ol {submitting && <Spinner size='20' />}
          </Button>
        </>
      )}
    </form>
  )
}

export default NewsletterForm

NewsletterForm.propTypes = {
  handleSubmit: PropTypes.func,
  canSubmit: PropTypes.bool,
  submitting: PropTypes.bool,
  message: PropTypes.string,
  success: PropTypes.bool
}
