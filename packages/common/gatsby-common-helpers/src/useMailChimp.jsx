import { useState } from 'react'

const successMessage =
  'Kaydınız alındı. Lütfen e-posta kutunuzdaki onay bağlantısını kontrol edin.'
const requestTimeoutMs = 10000

const useMailChimp = () => {
  const [result, setResult] = useState()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(
      () => controller.abort(),
      requestTimeoutMs
    )

    try {
      const data = new FormData(e.target)
      const email = data.get('email')
      const response = await fetch('/.netlify/functions/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
        signal: controller.signal
      })

      if (!response.ok) throw new Error('Newsletter subscription failed')

      setResult({
        result: 'success',
        msg: successMessage
      })
    } catch {
      setResult({
        result: 'error',
        msg: 'Kayıt şu anda tamamlanamadı. Lütfen biraz sonra tekrar deneyin.'
      })
    } finally {
      window.clearTimeout(timeout)
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
