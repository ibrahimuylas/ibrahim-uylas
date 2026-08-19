import React, { useState } from 'react'
import {
  Box,
  Button,
  Input,
  Label,
  Message,
  Select,
  Spinner,
  Text,
  Textarea
} from 'theme-ui'
import { FaPaperPlane } from 'react-icons/fa'
import { currentPagePath, trackEvent } from '../utils/analytics'

const FORM_NAME = 'iletisim'

const fieldStyle = {
  width: `100%`,
  minHeight: 52,
  px: 3,
  color: `heading`,
  bg: `omegaLighter`,
  border: `1px solid`,
  borderColor: `omegaLight`,
  borderRadius: `8px`,
  fontSize: 2,
  transition: `border-color 160ms ease, box-shadow 160ms ease`,
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': {
      borderColor: `omega`
    }
  },
  '&:focus': {
    borderColor: `alpha`,
    boxShadow: theme => `0 0 0 3px ${theme.colors.alphaLighter}`,
    outline: `none`
  },
  '&::placeholder': {
    color: `omegaDark`,
    opacity: 1
  }
}

const labelStyle = {
  display: `block`,
  color: `heading`,
  fontSize: 1,
  fontWeight: `bold`,
  lineHeight: 1.4,
  mb: 2
}

const clearValidationMessage = event => {
  event.currentTarget.setCustomValidity('')
}

const setRequiredValidationMessage = message => event => {
  event.currentTarget.setCustomValidity(message)
}

const setEmailValidationMessage = event => {
  const field = event.currentTarget
  const message = field.validity.valueMissing
    ? 'Lütfen e-posta adresini yaz.'
    : 'Lütfen geçerli bir e-posta adresi yaz.'

  field.setCustomValidity(message)
}

const setMessageValidationMessage = event => {
  const field = event.currentTarget
  const message = field.validity.valueMissing
    ? 'Lütfen mesajını yaz.'
    : 'Mesajın en az 10 karakter olmalı.'

  field.setCustomValidity(message)
}

const validateMessageLength = event => {
  const field = event.currentTarget
  const message =
    field.value.length > 0 && field.value.length < field.minLength
      ? 'Mesajın en az 10 karakter olmalı.'
      : ''

  field.setCustomValidity(message)
}

const ContactForm = () => {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async event => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('submitting')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
      })

      if (!response.ok) {
        throw new Error(`Form submission failed with ${response.status}`)
      }

      form.reset()
      setStatus('success')
      trackEvent('contact_form_submit', {
        form_name: FORM_NAME,
        source_path: currentPagePath()
      })
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
      action='/iletisim/'
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
        borderRadius: `12px`,
        boxShadow: theme => `0 20px 55px -42px ${theme.colors.omegaDarker}`
      }}
    >
      <input type='hidden' name='form-name' value={FORM_NAME} />
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
        <Label htmlFor='contact-bot-field'>
          Bu alanı boş bırak
          <Input
            id='contact-bot-field'
            name='bot-field'
            tabIndex='-1'
            autoComplete='off'
          />
        </Label>
      </Box>

      <Box
        sx={{
          display: `grid`,
          gridTemplateColumns: [`1fr`, `repeat(2, minmax(0, 1fr))`],
          gap: 3
        }}
      >
        <Box>
          <Label htmlFor='contact-name' sx={labelStyle}>
            Adın
          </Label>
          <Input
            id='contact-name'
            name='name'
            type='text'
            placeholder='Nasıl hitap edeyim?'
            autoComplete='name'
            required
            onInvalid={setRequiredValidationMessage('Lütfen adını yaz.')}
            onInput={clearValidationMessage}
            sx={fieldStyle}
          />
        </Box>
        <Box>
          <Label htmlFor='contact-email' sx={labelStyle}>
            E-posta adresin
          </Label>
          <Input
            id='contact-email'
            name='email'
            type='email'
            placeholder='sen@ornek.com'
            autoComplete='email'
            required
            onInvalid={setEmailValidationMessage}
            onInput={clearValidationMessage}
            sx={fieldStyle}
          />
        </Box>
      </Box>

      <Box>
        <Label htmlFor='contact-subject' sx={labelStyle}>
          Ne hakkında yazıyorsun?
        </Label>
        <Select
          id='contact-subject'
          name='subject'
          defaultValue=''
          required
          onInvalid={setRequiredValidationMessage('Lütfen bir konu seç.')}
          onInput={clearValidationMessage}
          sx={fieldStyle}
        >
          <option value='' disabled>
            Bir konu seç
          </option>
          <option value='Rota veya kamp sorusu'>Rota veya kamp sorusu</option>
          <option value='Ekipman önerisi'>Ekipman önerisi</option>
          <option value='İş birliği'>İş birliği</option>
          <option value='Site hakkında'>Site hakkında</option>
          <option value='Sadece merhaba'>Sadece merhaba</option>
          <option value='Diğer'>Diğer</option>
        </Select>
      </Box>

      <Box>
        <Label htmlFor='contact-message' sx={labelStyle}>
          Mesajın
        </Label>
        <Textarea
          id='contact-message'
          name='message'
          placeholder='Aklındakini anlat, mümkün olduğunca kısa sürede dönüş yapayım.'
          rows={7}
          minLength={10}
          required
          onInvalid={setMessageValidationMessage}
          onInput={validateMessageLength}
          sx={{
            ...fieldStyle,
            minHeight: 160,
            py: 3,
            resize: `vertical`
          }}
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
          sx={{
            maxWidth: `28rem`,
            color: `omegaDark`,
            fontSize: 1,
            lineHeight: 1.6,
            m: 0
          }}
        >
          Bilgilerini yalnızca sana dönüş yapmak için kullanırım.
        </Text>
        <Button
          type='submit'
          disabled={isSubmitting}
          sx={{
            variant: `buttons.primary`,
            display: `inline-flex`,
            alignItems: `center`,
            justifyContent: `center`,
            gap: 2,
            minWidth: [`100%`, 176],
            minHeight: 52,
            px: 4,
            borderRadius: `8px`,
            fontSize: 2,
            fontWeight: `bold`,
            whiteSpace: `nowrap`,
            cursor: isSubmitting ? `wait` : `pointer`,
            '&:focus-visible': {
              outline: `3px solid`,
              outlineColor: `alphaLight`,
              outlineOffset: 2
            }
          }}
        >
          {isSubmitting ? (
            <>
              Gönderiliyor <Spinner size='18' />
            </>
          ) : (
            <>
              Mesajı gönder <FaPaperPlane aria-hidden='true' />
            </>
          )}
        </Button>
      </Box>

      <Box aria-live='polite'>
        {status === 'success' && (
          <Message variant='success' sx={{ m: 0 }}>
            Mesajın ulaştı. Teşekkür ederim; en kısa sürede dönüş yapacağım.
          </Message>
        )}
        {status === 'error' && (
          <Message variant='error' sx={{ m: 0 }}>
            Mesaj gönderilemedi. Lütfen tekrar dene veya doğrudan
            ibrahim@uylas.net&apos;e e-posta gönder.
          </Message>
        )}
      </Box>
    </Box>
  )
}

export default ContactForm
