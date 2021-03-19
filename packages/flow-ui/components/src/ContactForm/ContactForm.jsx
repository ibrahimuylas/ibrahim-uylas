import React from 'react'
import PropTypes from 'prop-types'
import { Box, Label, Input, Textarea, Button, Message, Spinner } from 'theme-ui'

const ContactForm = ({ handleSubmit, submitting, success }) => (
  <form onSubmit={handleSubmit}>
    {success && (
      <Message variant='success'>
        Thank you for contacting us. We'll get back to you soon!
      </Message>
    )}
    <Box variant='forms.row'>
      <Box variant='forms.column'>
        <Label htmlFor='contact-form-name'>Name</Label>
        <Input type='text' id='contact-form-name' name='name' required />
      </Box>
      <Box variant='forms.column'>
        <Label htmlFor='contact-form-company'>Company Name</Label>
        <Input type='text' id='contact-form-company' name='company' />
      </Box>
    </Box>
    <Box variant='forms.row'>
      <Box variant='forms.column'>
        <Label htmlFor='contact-form-email'>Email</Label>
        <Input
          type='email'
          placeholder='email@example.com'
          id='contact-form-email'
          name='email'
          required
        />
      </Box>
      <Box variant='forms.column'>
        <Label htmlFor='contact-form-phone'>Phone Number</Label>
        <Input
          type='tel'
          placeholder='(xxx) xxx-xxxx'
          id='contact-form-phone'
          name='phone'
        />
      </Box>
    </Box>
    <Box variant='forms.row'>
      <Label htmlFor='contact-form-subject'>Subject</Label>
      <Input type='text' id='contact-form-subject' name='subject' required />
    </Box>
    <Box variant='forms.row'>
      <Label htmlFor='contact-form-message'>Your Message</Label>
      <Textarea name='message' id='contact-form-message' />
    </Box>
    <Button
      variant={success || submitting ? 'disabled' : 'primary'}
      disabled={success || submitting}
      type='submit'
      required
    >
      Submit {submitting && <Spinner size='20' />}
    </Button>
  </form>
)

export default ContactForm

ContactForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  success: PropTypes.bool
}
