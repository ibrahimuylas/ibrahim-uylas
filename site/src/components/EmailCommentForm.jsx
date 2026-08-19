import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Input,
  Label,
  Message,
  Spinner,
  Text,
  Textarea
} from 'theme-ui'

const FORM_NAME = 'blog-comment'

const fieldStyle = {
  width: `100%`,
  minHeight: 50,
  px: 3,
  color: `heading`,
  bg: `contentBg`,
  border: `1px solid`,
  borderColor: `omegaLight`,
  borderRadius: `8px`,
  fontSize: 1,
  transition: `border-color 160ms ease, box-shadow 160ms ease`,
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': { borderColor: `omega` }
  },
  '&:focus': {
    borderColor: `alpha`,
    boxShadow: theme => `0 0 0 3px ${theme.colors.alphaLighter}`,
    outline: `none`
  },
  '&::placeholder': { color: `omegaDark`, opacity: 1 }
}

const labelStyle = {
  display: `block`,
  color: `heading`,
  fontSize: 1,
  fontWeight: `bold`,
  lineHeight: 1.4,
  mb: 2
}

const EmailCommentForm = ({ title, slug }) => {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('submitting')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })

      if (!response.ok) throw new Error(`Comment submission failed`)

      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <Box
      as='form'
      name={FORM_NAME}
      method='POST'
      action='/'
      data-netlify='true'
      data-netlify-honeypot='bot-field'
      onSubmit={handleSubmit}
      sx={{
        display: `grid`,
        gap: 3,
        p: [3, 4],
        bg: `contentBg`,
        border: `1px solid`,
        borderColor: `omegaLight`,
        borderRadius: `12px`
      }}
    >
      <input type='hidden' name='form-name' value={FORM_NAME} />
      <input type='hidden' name='page' value={slug || ''} />
      <input type='hidden' name='article' value={title || ''} />
      <Box
        aria-hidden='true'
        sx={{
          position: `absolute`,
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: `hidden`,
          clip: `rect(0, 0, 0, 0)`,
          whiteSpace: `nowrap`,
          border: 0
        }}
      >
        <Label htmlFor='blog-comment-bot-field'>Bu alanı boş bırak</Label>
        <Input
          id='blog-comment-bot-field'
          name='bot-field'
          tabIndex='-1'
          autoComplete='off'
        />
      </Box>

      <Box
        sx={{
          display: `grid`,
          gridTemplateColumns: [`1fr`, `repeat(2, minmax(0, 1fr))`],
          gap: 3
        }}
      >
        <Box>
          <Label htmlFor='blog-comment-name' sx={labelStyle}>
            Adın
          </Label>
          <Input
            id='blog-comment-name'
            name='name'
            placeholder='Nasıl hitap edeyim?'
            autoComplete='name'
            required
            sx={fieldStyle}
          />
        </Box>
        <Box>
          <Label htmlFor='blog-comment-email' sx={labelStyle}>
            E-posta adresin
          </Label>
          <Input
            id='blog-comment-email'
            name='email'
            type='email'
            placeholder='sen@ornek.com'
            autoComplete='email'
            required
            sx={fieldStyle}
          />
        </Box>
      </Box>

      <Box>
        <Label htmlFor='blog-comment-message' sx={labelStyle}>
          Yorumun
        </Label>
        <Textarea
          id='blog-comment-message'
          name='message'
          placeholder='Bu yazı hakkında ne düşünüyorsun?'
          rows={5}
          minLength={10}
          required
          sx={{ ...fieldStyle, minHeight: 130, py: 3, resize: `vertical` }}
        />
      </Box>

      <Box
        sx={{
          display: `flex`,
          flexDirection: [`column`, `row`],
          alignItems: [`stretch`, `center`],
          justifyContent: `space-between`,
          gap: 3
        }}
      >
        <Text
          as='p'
          sx={{ color: `omegaDark`, fontSize: 0, lineHeight: 1.6, m: 0 }}
        >
          E-posta adresin yalnızca sana dönüş yapmak için kullanılır. Yorumlar
          önce incelenir, sonra yayınlanır.
        </Text>
        <Button
          type='submit'
          disabled={isSubmitting}
          sx={{
            variant: `buttons.primary`,
            minHeight: 48,
            px: 4,
            borderRadius: `999px`,
            fontSize: 1,
            fontWeight: `bold`,
            cursor: isSubmitting ? `wait` : `pointer`
          }}
        >
          {isSubmitting ? (
            <>
              Gönderiliyor <Spinner size='16' />
            </>
          ) : (
            `Yorumu gönder`
          )}
        </Button>
      </Box>

      <Box aria-live='polite'>
        {status === 'success' && (
          <Message variant='success' sx={{ m: 0 }}>
            Yorumun ulaştı. İnceledikten sonra yayınlayacağım.
          </Message>
        )}
        {status === 'error' && (
          <Message variant='error' sx={{ m: 0 }}>
            Yorum gönderilemedi. Lütfen tekrar dene.
          </Message>
        )}
      </Box>
    </Box>
  )
}

EmailCommentForm.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string
}

export default EmailCommentForm
