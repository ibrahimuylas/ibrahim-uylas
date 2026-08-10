import { createHash, randomBytes } from 'node:crypto'

export type CommentEnvironment = Record<string, string | undefined>

export const getEnvironment = (): CommentEnvironment => {
  const netlify = (
    globalThis as {
      Netlify?: { env?: { get(name: string): string | undefined } }
    }
  ).Netlify
  const names = [
    'SUPABASE_URL',
    'SUPABASE_SECRET_KEY',
    'TURNSTILE_SECRET_KEY',
    'RESEND_API_KEY',
    'COMMENTS_FROM_EMAIL',
    'COMMENTS_OWNER_EMAIL',
    'COMMENTS_ADMIN_GITHUB_LOGIN',
    'SITE_URL',
    'CONTEXT',
    'DEPLOY_PRIME_URL',
    'URL'
  ]

  const environment = Object.fromEntries(
    names.map(name => [name, netlify?.env?.get(name) ?? process.env[name]])
  )

  // Email links from deploy previews must point back to that preview, while
  // production keeps the explicitly configured canonical URL.
  if (
    environment.CONTEXT === 'deploy-preview' &&
    environment.DEPLOY_PRIME_URL
  ) {
    environment.SITE_URL = environment.DEPLOY_PRIME_URL
  } else if (!environment.SITE_URL && environment.URL) {
    environment.SITE_URL = environment.URL
  }

  return environment
}

export const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  })

export const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex')

const githubAuditId = (userId: number | string) => {
  const value = sha256(`github:${userId}`).slice(0, 32).split('')
  value[12] = '5'
  value[16] = ((Number.parseInt(value[16], 16) & 0x3) | 0x8).toString(16)
  const hex = value.join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export const createToken = () => randomBytes(32).toString('base64url')

export const normalizeEmail = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : ''

export const normalizePath = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const withoutQuery = value.trim().split(/[?#]/, 1)[0]
  if (!withoutQuery.startsWith('/') || withoutQuery.length > 500) return ''
  return withoutQuery === '/' ? '/' : `${withoutQuery.replace(/\/+$/, '')}/`
}

export const isEmail = (value: string) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const cleanText = (value: unknown, max: number) =>
  typeof value === 'string'
    ? value
        .replace(/\r\n?/g, '\n')
        .trim()
        .slice(0, max + 1)
    : ''

export const isSafeInteger = (value: unknown) =>
  value === null ||
  value === undefined ||
  (Number.isSafeInteger(Number(value)) && Number(value) > 0)

const required = (env: CommentEnvironment, name: string) => {
  const value = env[name]
  if (!value) throw new Error(`Missing comments configuration: ${name}`)
  return value.replace(/\/$/, '')
}

export async function supabaseRpc<T>(
  env: CommentEnvironment,
  functionName: string,
  body: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch
): Promise<T> {
  const url = required(env, 'SUPABASE_URL')
  const secret = required(env, 'SUPABASE_SECRET_KEY')
  const response = await fetchImpl(`${url}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: secret,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000)
  })

  if (!response.ok) {
    throw new Error(`Supabase RPC ${functionName} failed (${response.status})`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export async function verifyTurnstile(
  env: CommentEnvironment,
  token: string,
  remoteIp?: string,
  fetchImpl: typeof fetch = fetch
) {
  const secret = required(env, 'TURNSTILE_SECRET_KEY')
  const form = new URLSearchParams({ secret, response: token })
  if (remoteIp) form.set('remoteip', remoteIp)

  const response = await fetchImpl(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(6000)
    }
  )

  if (!response.ok) return false
  const result = (await response.json()) as { success?: boolean }
  return result.success === true
}

export async function getAdminUser(
  request: Request,
  env: CommentEnvironment,
  fetchImpl: typeof fetch = fetch
) {
  const authorization = request.headers.get('authorization') || ''
  if (!authorization.startsWith('Bearer ')) return null

  const hostname = new URL(request.url).hostname
  if (
    authorization === 'Bearer decap-local' &&
    env.CONTEXT === 'dev' &&
    ['localhost', '127.0.0.1'].includes(hostname)
  ) {
    return {
      id: githubAuditId('local-development'),
      login: 'local-development',
      provider: 'github' as const
    }
  }

  const response = await fetchImpl('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: authorization,
      'User-Agent': 'ibrahimuylas-comments-admin',
      'X-GitHub-Api-Version': '2026-03-10'
    },
    signal: AbortSignal.timeout(6000)
  })
  if (!response.ok) return null

  const user = (await response.json()) as {
    id?: number
    login?: string
    type?: string
  }
  const allowedLogin = (
    env.COMMENTS_ADMIN_GITHUB_LOGIN || 'ibrahimuylas'
  ).toLowerCase()

  if (
    !user.id ||
    user.type !== 'User' ||
    user.login?.toLowerCase() !== allowedLogin
  ) {
    return null
  }

  return {
    id: githubAuditId(user.id),
    login: user.login,
    provider: 'github' as const
  }
}

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

type OutboxJob = {
  id: number
  kind: 'owner_new_comment' | 'verify_email' | 'direct_reply'
  recipient: string
  idempotency_key: string
  payload: {
    authorName?: string
    body?: string
    path?: string
    title?: string
    commentId?: number
    verifyToken?: string
    unsubscribeToken?: string
  }
}

const emailForJob = (job: OutboxJob, siteUrl: string) => {
  const payload = job.payload || {}
  const articleUrl = `${siteUrl}${normalizePath(payload.path)}`
  const excerpt = escapeHtml(payload.body).replaceAll('\n', '<br>')
  const heading = escapeHtml(payload.title || 'Yazı')

  if (job.kind === 'verify_email') {
    const url = `${siteUrl}/api/comments/verify?token=${encodeURIComponent(payload.verifyToken || '')}`
    return {
      subject: 'Yorum bildirimlerini doğrula',
      html: `<p>Merhaba ${escapeHtml(payload.authorName)},</p><p>Yanıt bildirimlerini açmak için e-posta adresini doğrula.</p><p><a href="${url}">E-posta adresimi doğrula</a></p>`
    }
  }

  if (job.kind === 'direct_reply') {
    const unsubscribe = `${siteUrl}/api/comments/unsubscribe?token=${encodeURIComponent(payload.unsubscribeToken || '')}`
    return {
      subject: `${heading} yazısındaki yorumuna yanıt geldi`,
      html: `<p>Yorumuna ${escapeHtml(payload.authorName)} yanıt verdi:</p><blockquote>${excerpt}</blockquote><p><a href="${articleUrl}#yorum-${payload.commentId}">Yanıtı gör</a></p><p><small><a href="${unsubscribe}">Yanıt bildirimlerini kapat</a></small></p>`
    }
  }

  const moderationUrl = `${siteUrl}/admin/#/comments-management?comment=${payload.commentId || ''}`
  return {
    subject: `Yeni yorum: ${heading}`,
    html: `<p><strong>${escapeHtml(payload.authorName)}</strong> yeni bir yorum gönderdi.</p><blockquote>${excerpt}</blockquote><p><a href="${articleUrl}#yorum-${payload.commentId}">Yorumu gör</a> · <a href="${moderationUrl}">Yorumu kaldır / yönet</a></p>`
  }
}

export async function drainEmailOutbox(
  env: CommentEnvironment,
  fetchImpl: typeof fetch = fetch,
  logger: Pick<Console, 'error'> = console
) {
  // Validate delivery configuration before claiming work. This prevents jobs
  // from being stranded in `sending` when email is intentionally disabled.
  const apiKey = required(env, 'RESEND_API_KEY')
  const siteUrl = required(env, 'SITE_URL')
  const from = env.COMMENTS_FROM_EMAIL || 'İbrahim Uylaş <ibrahim@uylas.net>'
  const jobs = await supabaseRpc<OutboxJob[]>(
    env,
    'claim_comment_email_jobs_internal',
    { p_limit: 20 },
    fetchImpl
  )

  for (const job of jobs || []) {
    let sent = false
    let providerId: string | null = null
    let errorMessage: string | null = null

    try {
      const content = emailForJob(job, siteUrl)
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': job.idempotency_key
        },
        body: JSON.stringify({ from, to: [job.recipient], ...content }),
        signal: AbortSignal.timeout(8000)
      })
      if (!response.ok)
        throw new Error(`Resend delivery failed (${response.status})`)
      const result = (await response.json()) as { id?: string }
      sent = true
      providerId = result.id || null
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : 'Email delivery failed'
      logger.error(`Comment email job ${job.id} failed`)
    }

    await supabaseRpc(
      env,
      'finish_comment_email_job_internal',
      {
        p_id: job.id,
        p_sent: sent,
        p_provider_id: providerId,
        p_error: errorMessage
      },
      fetchImpl
    )
  }

  return jobs?.length || 0
}

export const publicCommentPayload = (
  input: Record<string, unknown>,
  env: CommentEnvironment,
  options: { admin?: boolean; adminUserId?: string } = {}
) => {
  const path = normalizePath(input.path)
  const title = cleanText(input.title, 300)
  const authorName = cleanText(input.name, 80)
  const email = normalizeEmail(input.email)
  const body = cleanText(input.comment, 5000)
  const replyTo = input.replyTo ? Number(input.replyTo) : null
  const notifyReplies = input.notifyReplies === true
  if (
    !path ||
    !title ||
    !authorName ||
    !body ||
    body.length > 5000 ||
    authorName.length > 80 ||
    title.length > 300 ||
    !isEmail(email) ||
    !isSafeInteger(replyTo)
  ) {
    return null
  }

  const verifyToken = createToken()
  const unsubscribeToken = createToken()
  const emailPayload = {
    authorName,
    body,
    path,
    title,
    replyTo,
    verifyToken,
    unsubscribeToken
  }

  return {
    rpc: {
      p_path: path,
      p_title: title,
      p_author_name: authorName,
      p_email: email,
      p_email_hash: sha256(email),
      p_body: body,
      p_reply_to_id: replyTo,
      p_notify_replies: notifyReplies,
      p_verification_token_hash: sha256(verifyToken),
      p_verification_expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),
      p_unsubscribe_token_hash: sha256(unsubscribeToken),
      p_owner_email: env.COMMENTS_OWNER_EMAIL || 'ibrahim@uylas.net',
      p_email_payload: emailPayload,
      p_is_admin: options.admin === true,
      p_admin_user_id: options.adminUserId || null
    }
  }
}
