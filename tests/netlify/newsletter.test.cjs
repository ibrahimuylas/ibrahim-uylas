const assert = require('node:assert/strict')
const { test } = require('node:test')
const {
  createHandler,
  isValidEmail
} = require('../../netlify/functions/newsletter.js')

const env = {
  MAILCHIMP_API_KEY: 'secret-us21',
  MAILCHIMP_AUDIENCE_ID: 'audience',
  MAILCHIMP_SERVER_PREFIX: 'us21'
}
const quietLogger = { error() {} }

test('subscribes through Mailchimp without exposing configuration', async () => {
  const calls = []
  const handler = createHandler({
    env,
    logger: quietLogger,
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      return { ok: true, status: 200 }
    }
  })

  const result = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ email: ' Person@Example.com ' })
  })

  assert.equal(result.statusCode, 200)
  assert.deepEqual(JSON.parse(result.body), { ok: true })
  assert.equal(calls.length, 1)
  assert.match(calls[0].url, /^https:\/\/us21\.api\.mailchimp\.com\//)
  assert.equal(calls[0].options.method, 'PUT')
  assert.ok(calls[0].options.signal instanceof AbortSignal)
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    email_address: 'person@example.com',
    status_if_new: 'pending'
  })
  assert.doesNotMatch(result.body, /secret|audience|person@example\.com/i)
})

test('rejects invalid requests before contacting Mailchimp', async () => {
  let calls = 0
  const handler = createHandler({
    env,
    logger: quietLogger,
    fetchImpl: async () => {
      calls += 1
    }
  })

  assert.equal((await handler({ httpMethod: 'GET' })).statusCode, 405)
  assert.equal(
    (
      await handler({
        httpMethod: 'POST',
        body: JSON.stringify({ email: 'invalid' })
      })
    ).statusCode,
    400
  )
  assert.equal(calls, 0)
})

test('aborts slow Mailchimp requests and returns a sanitized error', async () => {
  const logs = []
  const handler = createHandler({
    env,
    timeoutMs: 1,
    logger: { error: message => logs.push(message) },
    fetchImpl: async (_url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const error = new Error(env.MAILCHIMP_API_KEY)
          error.name = 'AbortError'
          reject(error)
        })
      })
  })

  const result = await handler({
    httpMethod: 'POST',
    body: JSON.stringify({ email: 'person@example.com' })
  })

  assert.equal(result.statusCode, 502)
  assert.deepEqual(JSON.parse(result.body), { ok: false })
  assert.doesNotMatch(JSON.stringify(logs), /secret-us21/)
})

test('validates realistic email boundaries', () => {
  assert.equal(isValidEmail('person@example.com'), true)
  assert.equal(isValidEmail('invalid'), false)
  assert.equal(isValidEmail(`${'a'.repeat(245)}@example.com`), false)
})
