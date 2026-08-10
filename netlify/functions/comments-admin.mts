import type { Config, Context } from '@netlify/functions'
import {
  drainEmailOutbox,
  getAdminUser,
  getEnvironment,
  json,
  publicCommentPayload,
  supabaseRpc
} from './_shared/comments.mts'

export default async (request: Request, context: Context) => {
  const env = getEnvironment()
  const user = await getAdminUser(request, env)
  if (!user?.id) return json({ ok: false, error: 'Yetkisiz.' }, 401)

  try {
    if (request.method === 'GET') {
      const comments = await supabaseRpc(env, 'list_comments_admin_internal', {
        p_limit: 200
      })
      return json({ ok: true, comments })
    }

    if (request.method !== 'PATCH' && request.method !== 'POST') {
      return json({ ok: false }, 405)
    }
    const input = (await request.json()) as Record<string, unknown>

    if (input.action === 'reply') {
      const prepared = publicCommentPayload(
        {
          ...input,
          name: input.name || 'İbrahim Uylaş',
          email: input.email || env.COMMENTS_OWNER_EMAIL || 'ibrahim@uylas.net',
          notifyReplies: false
        },
        env,
        { admin: true, adminUserId: user.id }
      )
      if (!prepared)
        return json({ ok: false, error: 'Yanıt alanlarını kontrol et.' }, 400)
      const comment = await supabaseRpc(
        env,
        'submit_comment_internal',
        prepared.rpc
      )
      context.waitUntil(drainEmailOutbox(env).catch(() => undefined))
      return json({ ok: true, comment }, 201)
    }

    const id = Number(input.id)
    const action = String(input.action || '')
    if (
      !Number.isSafeInteger(id) ||
      !['hide', 'restore', 'edit'].includes(action)
    ) {
      return json({ ok: false, error: 'Geçersiz yönetim işlemi.' }, 400)
    }
    const ok = await supabaseRpc<boolean>(env, 'moderate_comment_internal', {
      p_comment_id: id,
      p_action: action,
      p_body: typeof input.body === 'string' ? input.body : '',
      p_admin_user_id: user.id
    })
    return json({ ok })
  } catch {
    return json({ ok: false, error: 'Yönetim işlemi tamamlanamadı.' }, 502)
  }
}

export const config: Config = { path: '/api/comments/admin' }
