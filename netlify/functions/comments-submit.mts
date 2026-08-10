import type { Config, Context } from '@netlify/functions'
import {
  drainEmailOutbox,
  getEnvironment,
  json,
  publicCommentPayload,
  supabaseRpc,
  verifyTurnstile
} from './_shared/comments.mts'

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') return json({ ok: false }, 405)
  const env = getEnvironment()
  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'Geçersiz istek.' }, 400)
  }

  if (input.website) return json({ ok: true }, 202)
  const prepared = publicCommentPayload(input, env)
  if (!prepared || typeof input.turnstileToken !== 'string') {
    return json(
      { ok: false, error: 'Lütfen tüm zorunlu alanları kontrol et.' },
      400
    )
  }

  try {
    if (!(await verifyTurnstile(env, input.turnstileToken, context.ip))) {
      return json({ ok: false, error: 'Güvenlik doğrulaması başarısız.' }, 400)
    }
    const comment = await supabaseRpc<Record<string, unknown>>(
      env,
      'submit_comment_internal',
      prepared.rpc
    )
    context.waitUntil(drainEmailOutbox(env).catch(() => undefined))
    return json({ ok: true, comment }, 201)
  } catch {
    return json(
      { ok: false, error: 'Yorum kaydedilemedi. Lütfen tekrar dene.' },
      502
    )
  }
}

export const config: Config = {
  path: '/api/comments/submit',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['domain', 'ip'] }
}
