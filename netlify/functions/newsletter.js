const crypto = require('node:crypto')
const DEFAULT_TIMEOUT_MS = 8000

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

const createHandler =
  ({
    fetchImpl = globalThis.fetch,
    env = process.env,
    logger = console,
    setTimeoutImpl = setTimeout,
    clearTimeoutImpl = clearTimeout,
    timeoutMs = DEFAULT_TIMEOUT_MS
  } = {}) =>
  async event => {
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

    const apiKey = env.MAILCHIMP_API_KEY
    const audienceId = env.MAILCHIMP_AUDIENCE_ID
    const serverPrefix = env.MAILCHIMP_SERVER_PREFIX || apiKey?.split('-').pop()

    if (
      !apiKey ||
      !audienceId ||
      !serverPrefix ||
      typeof fetchImpl !== 'function'
    ) {
      logger.error('Newsletter service is missing Mailchimp configuration')
      return jsonResponse(500, { ok: false })
    }

    const subscriberHash = crypto.createHash('md5').update(email).digest('hex')
    const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`

    const controller = new AbortController()
    const timeout = setTimeoutImpl(() => controller.abort(), timeoutMs)

    try {
      const response = await fetchImpl(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${Buffer.from(`netlify:${apiKey}`).toString(
            'base64'
          )}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'pending'
        })
      })

      if (!response.ok) {
        logger.error(`Mailchimp newsletter request failed (${response.status})`)
        return jsonResponse(502, { ok: false })
      }

      return jsonResponse(200, { ok: true })
    } catch (error) {
      logger.error(
        error?.name === 'AbortError'
          ? 'Mailchimp newsletter request timed out'
          : 'Mailchimp newsletter request could not be completed'
      )
      return jsonResponse(502, { ok: false })
    } finally {
      clearTimeoutImpl(timeout)
    }
  }

exports.createHandler = createHandler
exports.handler = createHandler()
exports.isValidEmail = isValidEmail
