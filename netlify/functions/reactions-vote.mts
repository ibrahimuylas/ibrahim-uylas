import type { Config } from '@netlify/functions'
import { getEnvironment, json, supabaseRpc } from './_shared/comments.mts'
import { reactionVotePayload } from './_shared/reactions.mts'

export default async (request: Request) => {
  if (request.method !== 'POST') return json({ ok: false }, 405)

  let input: Record<string, unknown>
  try {
    input = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'Geçersiz istek.' }, 400)
  }

  const payload = reactionVotePayload(input)
  if (!payload) {
    return json({ ok: false, error: 'Geçersiz tepki.' }, 400)
  }

  try {
    const result = await supabaseRpc(
      getEnvironment(),
      'toggle_article_reaction_internal',
      payload
    )
    return json(result)
  } catch {
    return json({ ok: false, error: 'Tepkin kaydedilemedi.' }, 502)
  }
}

export const config: Config = {
  path: '/api/reactions/vote',
  rateLimit: {
    windowLimit: 20,
    windowSize: 3600,
    aggregateBy: ['domain', 'ip']
  }
}
