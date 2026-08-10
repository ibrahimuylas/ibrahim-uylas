import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  FaEye,
  FaEyeSlash,
  FaExternalLinkAlt,
  FaPen,
  FaReply,
  FaSyncAlt
} from 'react-icons/fa'

const COMMENTS_ROUTE = '/comments-management'
const COMMENTS_ROOT_ID = 'comments-management-root'
const COMMENTS_NAV_ATTRIBUTE = 'data-comments-management-nav'

const styles = `
  #${COMMENTS_ROOT_ID} {
    min-height: calc(100vh - 56px);
    background: #f1f3f6;
    color: #3a3f47;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  #${COMMENTS_ROOT_ID}[hidden] { display: none; }
  #${COMMENTS_ROOT_ID} * { box-sizing: border-box; }

  .comments-management-page {
    width: min(1180px, calc(100% - 40px));
    margin: 0 auto;
    padding: 28px 0 56px;
  }

  .comments-management-card {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(68, 74, 87, .12);
  }

  .comments-management-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 22px;
    margin-bottom: 24px;
  }

  .comments-management-title {
    margin: 0 0 5px;
    color: #31363f;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
  }

  .comments-management-subtitle {
    margin: 0;
    color: #7b8290;
    font-size: 14px;
    line-height: 1.55;
  }

  .comments-management-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .comments-management-filters {
    display: inline-flex;
    padding: 3px;
    border: 1px solid #d9dce1;
    border-radius: 4px;
    background: #fff;
  }

  .comments-management-filter,
  .comments-management-button {
    appearance: none;
    border: 0;
    border-radius: 3px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    transition: background-color .15s ease, color .15s ease, border-color .15s ease;
  }

  .comments-management-filter {
    padding: 8px 12px;
    color: #7b8290;
    background: transparent;
    font-size: 13px;
  }

  .comments-management-filter:hover,
  .comments-management-filter:focus-visible,
  .comments-management-filter.is-active {
    color: #3a69c7;
    background: #edf4fc;
    outline: none;
  }

  .comments-management-count {
    color: #7b8290;
    font-size: 13px;
  }

  .comments-management-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 8px 13px;
    color: #4d5562;
    background: #fff;
    border: 1px solid #cfd3da;
    font-size: 13px;
  }

  .comments-management-button:hover,
  .comments-management-button:focus-visible {
    color: #3a69c7;
    border-color: #3a69c7;
    outline: none;
  }

  .comments-management-button.primary {
    color: #fff;
    background: #3a69c7;
    border-color: #3a69c7;
  }

  .comments-management-button.primary:hover,
  .comments-management-button.primary:focus-visible { background: #315eb4; }
  .comments-management-button:disabled { opacity: .55; cursor: wait; }

  .comments-management-list {
    display: grid;
    gap: 14px;
  }

  .comments-management-comment {
    padding: 20px 22px;
    border-left: 3px solid #3a69c7;
  }

  .comments-management-comment.is-hidden {
    border-left-color: #a7adb8;
    opacity: .78;
  }

  .comments-management-comment-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
  }

  .comments-management-author {
    margin: 0 0 4px;
    color: #31363f;
    font-size: 16px;
    font-weight: 600;
  }

  .comments-management-meta,
  .comments-management-post-link {
    color: #7b8290;
    font-size: 13px;
    line-height: 1.5;
  }

  .comments-management-post-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 5px;
    color: #3a69c7;
    text-decoration: none;
  }

  .comments-management-post-link:hover { text-decoration: underline; }

  .comments-management-status {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    min-height: 26px;
    padding: 4px 9px;
    border-radius: 12px;
    color: #2f7a4a;
    background: #e8f5ec;
    font-size: 12px;
    font-weight: 600;
  }

  .comments-management-status.is-hidden { color: #686f7b; background: #eceef1; }

  .comments-management-body {
    margin: 17px 0;
    color: #4d5562;
    font-size: 15px;
    line-height: 1.7;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .comments-management-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .comments-management-form {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid #e4e6e9;
  }

  .comments-management-form-label {
    display: block;
    margin-bottom: 8px;
    color: #31363f;
    font-size: 14px;
    font-weight: 600;
  }

  .comments-management-textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #cfd3da;
    border-radius: 3px;
    color: #3a3f47;
    background: #fff;
    font: inherit;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
  }

  .comments-management-textarea:focus {
    border-color: #3a69c7;
    box-shadow: 0 0 0 2px rgba(58, 105, 199, .16);
    outline: none;
  }

  .comments-management-form-actions { display: flex; gap: 8px; margin-top: 10px; }

  .comments-management-message {
    padding: 28px;
    color: #68707d;
    text-align: center;
  }

  .comments-management-error {
    margin-bottom: 16px;
    padding: 12px 14px;
    color: #a63636;
    background: #fff3f3;
    border: 1px solid #edc5c5;
    border-radius: 4px;
    font-size: 14px;
  }

  @media (max-width: 700px) {
    .comments-management-page { width: min(100% - 24px, 1180px); padding-top: 16px; }
    .comments-management-toolbar,
    .comments-management-controls,
    .comments-management-comment-header { align-items: stretch; flex-direction: column; }
    .comments-management-filter { flex: 1; }
    .comments-management-filters { display: flex; width: 100%; }
    .comments-management-count { padding-left: 3px; }
    .comments-management-comment { padding: 17px; }
  }
`

const injectStyles = () => {
  if (document.getElementById('comments-management-styles')) return
  const style = document.createElement('style')
  style.id = 'comments-management-styles'
  style.textContent = styles
  document.head.appendChild(style)
}

const isCommentsRoute = () =>
  window.location.hash.replace(/^#/, '').startsWith(COMMENTS_ROUTE)

const getDecapToken = () => {
  try {
    const user = JSON.parse(window.localStorage.getItem('decap-cms-user'))
    if (typeof user?.token === 'string') return user.token
    if (user && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      return 'decap-local'
    }
    return ''
  } catch {
    return ''
  }
}

const parseResponse = async response => {
  const text = await response.text()
  let result

  try {
    result = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Sunucudan geçerli bir yanıt alınamadı.')
  }

  if (!response.ok || !result?.ok) {
    throw new Error(result?.error || 'İşlem tamamlanamadı.')
  }

  return result
}

const CommentForm = ({ busy, label, onCancel, onSubmit, setValue, value }) => (
  <form className='comments-management-form' onSubmit={onSubmit}>
    <label className='comments-management-form-label' htmlFor='comment-management-body'>
      {label}
    </label>
    <textarea
      id='comment-management-body'
      className='comments-management-textarea'
      value={value}
      onChange={event => setValue(event.target.value)}
      maxLength={5000}
      required
    />
    <div className='comments-management-form-actions'>
      <button className='comments-management-button primary' type='submit' disabled={busy}>
        Kaydet
      </button>
      <button className='comments-management-button' type='button' onClick={onCancel} disabled={busy}>
        Vazgeç
      </button>
    </div>
  </form>
)

const CommentsManagement = () => {
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [editBody, setEditBody] = useState('')
  const [replying, setReplying] = useState(null)
  const [replyBody, setReplyBody] = useState('')

  const request = useCallback(async (method = 'GET', body) => {
    const token = getDecapToken()
    if (!token) {
      throw new Error('Decap CMS GitHub oturumu bulunamadı. Admin paneline yeniden giriş yap.')
    }

    const response = await fetch('/api/comments/admin', {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    })

    return parseResponse(response)
  }, [])

  const focusRequestedComment = useCallback(items => {
    const query = window.location.hash.split('?', 2)[1]
    const id = query ? new URLSearchParams(query).get('comment') : null
    if (!id || !items.some(comment => String(comment.id) === id)) return

    window.setTimeout(() => {
      document.getElementById(`managed-comment-${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }, 50)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await request()
      const items = result.comments || []
      setComments(items)
      focusRequestedComment(items)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [focusRequestedComment, request])

  useEffect(() => {
    load()
  }, [load])

  const visibleComments = useMemo(
    () => comments.filter(comment => filter === 'all' || comment.status === filter),
    [comments, filter]
  )

  const moderate = async (comment, action, body = '') => {
    setActionId(comment.id)
    setError('')
    try {
      await request('PATCH', { id: comment.id, action, body })
      setEditing(null)
      setEditBody('')
      await load()
    } catch (actionError) {
      setError(actionError.message)
    } finally {
      setActionId(null)
    }
  }

  const reply = async event => {
    event.preventDefault()
    if (!replying || !replyBody.trim()) return

    setActionId(replying.id)
    setError('')
    try {
      await request('POST', {
        action: 'reply',
        path: replying.path,
        title: replying.title,
        comment: replyBody.trim(),
        replyTo: replying.id
      })
      setReplying(null)
      setReplyBody('')
      await load()
    } catch (replyError) {
      setError(replyError.message)
    } finally {
      setActionId(null)
    }
  }

  return (
    <main className='comments-management-page'>
      <section className='comments-management-card comments-management-toolbar'>
        <div>
          <h1 className='comments-management-title'>Comments</h1>
          <p className='comments-management-subtitle'>Yorumları yanıtla, düzenle veya görünürlüklerini değiştir.</p>
        </div>
        <button className='comments-management-button' type='button' onClick={load} disabled={loading}>
          <FaSyncAlt aria-hidden='true' size={12} /> Yenile
        </button>
      </section>

      <div className='comments-management-controls'>
        <div className='comments-management-filters' aria-label='Yorum filtresi'>
          {[
            ['all', 'Tümü'],
            ['published', 'Yayında'],
            ['hidden', 'Gizli']
          ].map(([value, label]) => (
            <button
              key={value}
              className={`comments-management-filter${filter === value ? ' is-active' : ''}`}
              type='button'
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className='comments-management-count'>{visibleComments.length} yorum</span>
      </div>

      {error && <div className='comments-management-error' role='alert'>{error}</div>}

      {loading && (
        <div className='comments-management-card comments-management-message' role='status'>
          Yorumlar yükleniyor…
        </div>
      )}

      {!loading && visibleComments.length === 0 && !error && (
        <div className='comments-management-card comments-management-message'>
          Bu filtrede henüz yorum yok.
        </div>
      )}

      {!loading && visibleComments.length > 0 && (
        <section className='comments-management-list' aria-label='Yorumlar'>
          {visibleComments.map(comment => {
            const isHidden = comment.status === 'hidden'
            const isBusy = actionId === comment.id
            const isEditing = editing?.id === comment.id
            const isReplying = replying?.id === comment.id

            return (
              <article
                key={comment.id}
                id={`managed-comment-${comment.id}`}
                className={`comments-management-card comments-management-comment${isHidden ? ' is-hidden' : ''}`}
              >
                <header className='comments-management-comment-header'>
                  <div>
                    <h2 className='comments-management-author'>{comment.author_name}</h2>
                    <div className='comments-management-meta'>
                      {comment.email} · {new Date(comment.created_at).toLocaleString('tr-TR')}
                    </div>
                    <a className='comments-management-post-link' href={comment.path} target='_blank' rel='noreferrer'>
                      {comment.title} <FaExternalLinkAlt aria-hidden='true' size={10} />
                    </a>
                  </div>
                  <span className={`comments-management-status${isHidden ? ' is-hidden' : ''}`}>
                    {isHidden ? 'Gizli' : 'Yayında'}
                  </span>
                </header>

                <p className='comments-management-body'>{comment.body}</p>

                <div className='comments-management-actions'>
                  <button
                    className='comments-management-button'
                    type='button'
                    disabled={isBusy}
                    onClick={() => moderate(comment, isHidden ? 'restore' : 'hide')}
                  >
                    {isHidden ? <FaEye aria-hidden='true' size={13} /> : <FaEyeSlash aria-hidden='true' size={13} />}
                    {isHidden ? 'Yeniden yayınla' : 'Gizle'}
                  </button>
                  <button
                    className='comments-management-button'
                    type='button'
                    disabled={isBusy}
                    onClick={() => {
                      setReplying(null)
                      setEditing(comment)
                      setEditBody(comment.body)
                    }}
                  >
                    <FaPen aria-hidden='true' size={11} /> Düzenle
                  </button>
                  <button
                    className='comments-management-button'
                    type='button'
                    disabled={isBusy}
                    onClick={() => {
                      setEditing(null)
                      setReplying(comment)
                      setReplyBody('')
                    }}
                  >
                    <FaReply aria-hidden='true' size={12} /> Yanıtla
                  </button>
                </div>

                {isEditing && (
                  <CommentForm
                    busy={isBusy}
                    label='Yorumu düzenle'
                    value={editBody}
                    setValue={setEditBody}
                    onCancel={() => setEditing(null)}
                    onSubmit={event => {
                      event.preventDefault()
                      if (editBody.trim()) moderate(comment, 'edit', editBody.trim())
                    }}
                  />
                )}

                {isReplying && (
                  <CommentForm
                    busy={isBusy}
                    label='Herkese açık yanıt'
                    value={replyBody}
                    setValue={setReplyBody}
                    onCancel={() => setReplying(null)}
                    onSubmit={reply}
                  />
                )}
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

let hiddenMain = null
let mounted = false

const updateNav = header => {
  const navList = header?.querySelector('nav ul')
  if (!navList) return

  let item = navList.querySelector(`[${COMMENTS_NAV_ATTRIBUTE}]`)
  if (!item) {
    const sourceItem = navList.querySelector('li:has(a)')
    if (!sourceItem) return

    item = sourceItem.cloneNode(true)
    item.setAttribute(COMMENTS_NAV_ATTRIBUTE, 'true')
    const link = item.querySelector('a')
    link.setAttribute('href', `#${COMMENTS_ROUTE}`)
    link.removeAttribute('aria-current')
    link.querySelector('svg')?.setAttribute('aria-hidden', 'true')

    const label = [...link.childNodes].find(
      node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
    )
    if (label) label.textContent = 'Comments'
    else link.append(document.createTextNode('Comments'))

    navList.appendChild(item)
  }

  const link = item.querySelector('a')
  link?.classList.toggle('header-link-active', isCommentsRoute())
}

const updateRoute = () => {
  const header = document.querySelector('#nc-root header')
  if (!header) return

  updateNav(header)
  const active = isCommentsRoute()
  const root = document.getElementById(COMMENTS_ROOT_ID)

  if (!root) return
  root.hidden = !active

  if (active) {
    const notFoundHeading = [...document.querySelectorAll('h2')].find(
      heading => heading.textContent.trim() === 'Not Found'
    )
    let routeContainer = notFoundHeading
    while (routeContainer && routeContainer.parentElement !== header.parentElement) {
      routeContainer = routeContainer.parentElement
    }
    hiddenMain = routeContainer || null
    if (hiddenMain) hiddenMain.style.display = 'none'
    if (!mounted) {
      ReactDOM.render(<CommentsManagement />, root)
      mounted = true
    }
  } else if (hiddenMain) {
    hiddenMain.style.removeProperty('display')
    hiddenMain = null
  }
}

const initialize = () => {
  injectStyles()
  if (!document.getElementById(COMMENTS_ROOT_ID)) {
    const root = document.createElement('div')
    root.id = COMMENTS_ROOT_ID
    root.hidden = true
    document.body.appendChild(root)
  }

  const observer = new MutationObserver(updateRoute)
  observer.observe(document.getElementById('nc-root'), { childList: true, subtree: true })
  window.addEventListener('hashchange', updateRoute)
  updateRoute()
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true })
  } else {
    initialize()
  }
}
