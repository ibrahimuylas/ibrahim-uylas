import type { Config } from '@netlify/functions'
import {
  getEnvironment,
  json,
  normalizePath,
  supabaseRpc
} from './_shared/comments.mts'

export default async (request: Request) => {
  if (request.method !== 'GET') return json({ ok: false }, 405)
  const url = new URL(request.url)
  const path = normalizePath(url.searchParams.get('post'))
  const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest'
  const cursorValue = url.searchParams.get('cursor')
  const cursor =
    cursorValue && !Number.isNaN(Date.parse(cursorValue)) ? cursorValue : null
  if (!path) return json({ ok: false, error: 'Geçersiz yazı adresi.' }, 400)

  try {
    const result = await supabaseRpc(
      getEnvironment(),
      'list_comments_internal',
      {
        p_path: path,
        p_sort: sort,
        p_cursor: cursor,
        p_limit: 20
      }
    )
    return json(result)
  } catch {
    return json({ ok: false, error: 'Yorumlar şu anda yüklenemiyor.' }, 502)
  }
}

export const config: Config = { path: '/api/comments' }
