import { useState } from 'react'
import addToMailchimp from 'gatsby-plugin-mailchimp'

const useMailChimp = () => {
  const [result, setResult] = useState()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData(e.target)
      const email = data.get('email')
      const result = await addToMailchimp(email)
      setResult(result)
    } catch {
      setResult({
        result: 'error',
        msg: 'Kayıt şu anda tamamlanamadı. Lütfen biraz sonra tekrar deneyin.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const success = result && result.result === 'success'
  const error = result && result.result !== 'success'
  const canSubmit = !result || error
  const message = result && result.msg

  return {
    handleSubmit,
    canSubmit,
    submitting,
    message,
    success,
    error
  }
}

export default useMailChimp
