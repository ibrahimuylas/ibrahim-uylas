import type { Config } from '@netlify/functions'
import { drainEmailOutbox, getEnvironment } from './_shared/comments.mts'

export default async () => {
  try {
    const processed = await drainEmailOutbox(getEnvironment())
    return Response.json({ ok: true, processed })
  } catch {
    return Response.json({ ok: false }, { status: 502 })
  }
}

export const config: Config = { schedule: '*/15 * * * *' }
