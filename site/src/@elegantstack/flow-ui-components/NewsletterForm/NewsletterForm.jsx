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
  success,
  compact
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
    <Box
      as='form'
      onSubmit={handleSubmit}
      sx={
        compact
          ? {
              display: `grid`,
              gridTemplateColumns: [`1fr`, `minmax(0, 1fr) auto`],
              alignItems: `start`,
              gap: 2,
              width: `100%`
            }
          : undefined
      }
    >
      {message && (
        <Message
          variant={success ? 'success' : 'error'}
          sx={{
            ...styles.msg,
            gridColumn: compact ? `1 / -1` : undefined,
            fontSize: compact ? 1 : undefined
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {canSubmit && (
        <>
          <Box variant={compact ? undefined : 'forms.row'} sx={{ minWidth: 0 }}>
            <Input
              name='email'
              type='email'
              placeholder='Email adresiniz buraya...'
              aria-label='Email adresi'
              required
              sx={
                compact
                  ? {
                      minHeight: 44,
                      fontSize: `16px`,
                      bg: `contentBg`
                    }
                  : undefined
              }
            />
          </Box>
          <Button
            type='submit'
            variant={success || submitting ? 'disabled' : 'primary'}
            disabled={success || submitting}
            sx={
              compact
                ? {
                    minWidth: [`100%`, `7.5rem`],
                    minHeight: 44,
                    px: 3,
                    whiteSpace: `nowrap`
                  }
                : styles.button
            }
          >
            Kayıt ol {submitting && <Spinner size='20' />}
          </Button>
        </>
      )}
    </Box>
  )
}

export default NewsletterForm

NewsletterForm.propTypes = {
  handleSubmit: PropTypes.func,
  canSubmit: PropTypes.bool,
  submitting: PropTypes.bool,
  message: PropTypes.string,
  success: PropTypes.bool,
  compact: PropTypes.bool
}

NewsletterForm.defaultProps = {
  compact: false
}
