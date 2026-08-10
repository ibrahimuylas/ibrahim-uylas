import type { Config } from '@netlify/functions'
import {
  getEnvironment,
  json,
  sha256,
  supabaseRpc
} from './_shared/comments.mts'

const page = (title: string, message: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>${title}</title><body style="font-family:system-ui;max-width:42rem;margin:4rem auto;padding:1rem"><h1>${title}</h1><p>${message}</p><p><a href="/">Ana sayfaya dön</a></p></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    }
  )

export default async (request: Request) => {
  if (request.method !== 'GET') return json({ ok: false }, 405)
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || ''
  const action = url.pathname.endsWith('/unsubscribe')
    ? 'unsubscribe'
    : 'verify'
  if (token.length < 32 || token.length > 100)
    return page('Geçersiz bağlantı', 'Bu bağlantı geçerli değil.', 400)

  try {
    const ok = await supabaseRpc<boolean>(
      getEnvironment(),
      action === 'verify'
        ? 'verify_comment_email_internal'
        : 'unsubscribe_comment_email_internal',
      { p_token_hash: sha256(token) }
    )
    if (!ok)
      return page(
        'Bağlantının süresi dolmuş',
        'Bu bağlantı daha önce kullanılmış veya artık geçerli değil.',
        400
      )
    return action === 'verify'
      ? page(
          'E-posta doğrulandı',
          'Yorumuna doğrudan yanıt verildiğinde haber alacaksın.'
        )
      : page(
          'Bildirimler kapatıldı',
          'Bu yorum için artık yanıt e-postası almayacaksın.'
        )
  } catch {
    return page('İşlem tamamlanamadı', 'Lütfen daha sonra tekrar dene.', 502)
  }
}

export const config: Config = {
  path: ['/api/comments/verify', '/api/comments/unsubscribe']
}
