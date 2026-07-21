const crypto = require('node:crypto')

const jsonResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  },
  body: JSON.stringify(body)
})

const isValidEmail = email =>
  typeof email === 'string' &&
  email.length <= 254 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

exports.handler = async event => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { ok: false })
  }

  let email

  try {
    const payload = JSON.parse(event.body || '{}')
    email = payload.email && payload.email.trim().toLowerCase()
  } catch {
    return jsonResponse(400, { ok: false })
  }

  if (!isValidEmail(email)) {
    return jsonResponse(400, { ok: false })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix =
    process.env.MAILCHIMP_SERVER_PREFIX || apiKey?.split('-').pop()

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('Newsletter service is missing Mailchimp configuration')
    return jsonResponse(500, { ok: false })
  }

  const subscriberHash = crypto.createHash('md5').update(email).digest('hex')
  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${Buffer.from(`netlify:${apiKey}`).toString(
          'base64'
        )}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'pending'
      })
    })

    if (!response.ok) {
      console.error(`Mailchimp newsletter request failed (${response.status})`)
      return jsonResponse(502, { ok: false })
    }

    return jsonResponse(200, { ok: true })
  } catch {
    console.error('Mailchimp newsletter request could not be completed')
    return jsonResponse(502, { ok: false })
  }
}
