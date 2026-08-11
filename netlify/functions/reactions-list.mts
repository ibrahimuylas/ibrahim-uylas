import type { Config } from '@netlify/functions'
import {
  getEnvironment,
  json,
  normalizePath,
  supabaseRpc
} from './_shared/comments.mts'
import { reactionVisitorHash } from './_shared/reactions.mts'

export default async (request: Request) => {
  if (request.method !== 'GET') return json({ ok: false }, 405)

  const url = new URL(request.url)
  const path = normalizePath(url.searchParams.get('post'))
  if (!path) return json({ ok: false, error: 'Geçersiz yazı adresi.' }, 400)

  const visitorHash = reactionVisitorHash(
    request.headers.get('x-reaction-visitor')
  )

  try {
    const result = await supabaseRpc(
      getEnvironment(),
      'list_article_reactions_internal',
      { p_path: path, p_visitor_hash: visitorHash || null }
    )
    return json(result)
  } catch {
    return json({ ok: false, error: 'Tepkiler şu anda yüklenemiyor.' }, 502)
  }
}

export const config: Config = { path: '/api/reactions' }
