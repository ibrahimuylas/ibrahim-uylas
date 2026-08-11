import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Turnstile } from '@marsidev/react-turnstile'
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Label,
  Message,
  Select,
  Spinner,
  Text,
  Textarea
} from 'theme-ui'
import {
  FaCheckCircle,
  FaLock,
  FaPaperPlane,
  FaRegCommentDots,
  FaReply,
  FaTimes
} from 'react-icons/fa'

const fieldStyle = {
  width: '100%',
  minHeight: 52,
  px: 3,
  color: 'heading',
  bg: 'contentBg',
  border: '1px solid',
  borderColor: 'omegaLight',
  borderRadius: '8px',
  // iOS Safari zooms focused form controls whose computed size is below 16px.
  fontSize: '16px',
  transition: 'border-color 160ms ease, box-shadow 160ms ease',
  '&:hover': { borderColor: 'omega' },
  '&:focus': {
    borderColor: 'alpha',
    boxShadow: theme => `0 0 0 3px ${theme.colors.alphaLighter}`,
    outline: 'none'
  },
  '&::placeholder': { color: 'omegaDark', opacity: 1 }
}

const labelStyle = {
  display: 'block',
  color: 'heading',
  fontSize: 1,
  fontWeight: 'bold',
  lineHeight: 1.4,
  mb: 2
}

const formatDate = value =>
  new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))

const CommentForm = ({ path, title, replyTo, siteKey, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    comment: '',
    notifyReplies: false,
    website: ''
  })
  const [token, setToken] = useState('')
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const turnstileRef = useRef(null)

  const update = event => {
    const { name, type, checked, value } = event.target
    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const submit = async event => {
    event.preventDefault()
    if (!token) {
      setState('error')
      setMessage('Lütfen güvenlik doğrulamasını tamamla.')
      return
    }
    setState('sending')
    setMessage('')
    try {
      const response = await fetch('/api/comments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          path,
          title,
          replyTo: replyTo?.id || null,
          turnstileToken: token
        })
      })
      const responseText = await response.text()
      let result = null
      try {
        result = responseText ? JSON.parse(responseText) : null
      } catch {
        result = null
      }
      if (!response.ok || !result?.ok)
        throw new Error(
          result?.error || 'Yorum kaydedilemedi. Lütfen tekrar dene.'
        )
      setForm(current => ({ ...current, comment: '', website: '' }))
      setState('saved')
      setMessage(
        form.notifyReplies
          ? 'Yorumun yayınlandı. Bildirimleri açmak için e-postandaki bağlantıyı doğrula.'
          : 'Yorumun yayınlandı.'
      )
      setToken('')
      turnstileRef.current?.reset()
      await onSaved()
    } catch (error) {
      setState('error')
      setMessage(error.message || 'Yorum kaydedilemedi. Lütfen tekrar dene.')
      setToken('')
      turnstileRef.current?.reset()
    }
  }

  const isSending = state === 'sending'

  return (
    <Box
      as='form'
      data-comment-form
      onSubmit={submit}
      sx={{
        display: 'grid',
        gap: 3,
        p: 0,
        bg: 'transparent',
        border: 0
      }}
    >
      {replyTo && (
        <Flex
          sx={{
            alignItems: ['flex-start', 'center'],
            justifyContent: 'space-between',
            flexDirection: ['column', 'row'],
            gap: 2,
            pb: 3,
            borderBottom: '1px solid',
            borderColor: 'omegaLight'
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'alpha', lineHeight: 0 }}>
              <FaReply aria-hidden='true' />
            </Box>
            <Text as='p' sx={{ color: 'heading', m: 0 }}>
              <strong>{replyTo.authorName}</strong> yorumuna yanıt veriyorsun.
            </Text>
          </Flex>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              py: 2,
              px: 3,
              borderRadius: '8px'
            }}
          >
            <FaTimes aria-hidden='true' /> Vazgeç
          </Button>
        </Flex>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', 'repeat(2, minmax(0, 1fr))'],
          gap: 3
        }}
      >
        <Box>
          <Label htmlFor='comment-name' sx={labelStyle}>
            Adın
          </Label>
          <Input
            id='comment-name'
            name='name'
            value={form.name}
            onChange={update}
            placeholder='Nasıl hitap edelim?'
            autoComplete='name'
            maxLength={80}
            required
            sx={fieldStyle}
          />
        </Box>
        <Box>
          <Label htmlFor='comment-email' sx={labelStyle}>
            E-posta adresin
          </Label>
          <Input
            id='comment-email'
            name='email'
            type='email'
            value={form.email}
            onChange={update}
            placeholder='sen@ornek.com'
            autoComplete='email'
            maxLength={254}
            required
            sx={fieldStyle}
          />
        </Box>
      </Box>

      <Box>
        <Label htmlFor='comment-body' sx={labelStyle}>
          Yorumun
        </Label>
        <Textarea
          id='comment-body'
          name='comment'
          value={form.comment}
          onChange={update}
          placeholder='Bu yazı hakkında ne düşünüyorsun?'
          maxLength={5000}
          rows={6}
          required
          sx={{ ...fieldStyle, minHeight: 150, py: 3, resize: 'vertical' }}
        />
      </Box>

      <Box
        aria-hidden='true'
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        <Label htmlFor='comment-website'>
          Web sitesi
          <Input
            id='comment-website'
            name='website'
            value={form.website}
            onChange={update}
            tabIndex={-1}
            autoComplete='off'
          />
        </Label>
      </Box>

      <Label
        sx={{
          alignItems: 'flex-start',
          gap: 2,
          color: 'text',
          fontSize: 1,
          lineHeight: 1.6
        }}
      >
        <Checkbox
          name='notifyReplies'
          checked={form.notifyReplies}
          onChange={update}
          sx={{ mt: '3px' }}
        />
        Yorumuma doğrudan yanıt gelirse e-posta gönder. Önce adresimi
        doğrulayacağım.
      </Label>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr', 'minmax(0, 1fr) auto'],
          alignItems: 'end',
          gap: 3,
          pt: 3,
          borderTop: '1px solid',
          borderColor: 'omegaLight'
        }}
      >
        <Box>
          <Flex sx={{ alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ color: 'alpha', lineHeight: 0 }}>
              <FaLock aria-hidden='true' />
            </Box>
            <Text
              as='p'
              sx={{ color: 'heading', fontSize: 1, fontWeight: 'bold', m: 0 }}
            >
              Güvenlik doğrulaması
            </Text>
          </Flex>
          {siteKey ? (
            <Box sx={{ minHeight: 65, width: '100%', minWidth: 0 }}>
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                options={{
                  language: 'tr',
                  appearance: 'always',
                  size: 'flexible'
                }}
                onSuccess={setToken}
                onExpire={() => setToken('')}
                onError={() => setToken('')}
              />
            </Box>
          ) : (
            <Text as='p' role='alert' sx={{ color: 'error', m: 0 }}>
              Yorum güvenliği yapılandırılmamış.
            </Text>
          )}
        </Box>
        <Button
          type='submit'
          disabled={isSending || !siteKey}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            minWidth: ['100%', 190],
            minHeight: 52,
            px: 4,
            borderRadius: '8px',
            fontSize: 2,
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            cursor: isSending ? 'wait' : 'pointer',
            '&:focus-visible': {
              outline: '3px solid',
              outlineColor: 'alphaLight',
              outlineOffset: 2
            }
          }}
        >
          {isSending ? (
            <Spinner size={18} />
          ) : (
            <FaPaperPlane aria-hidden='true' />
          )}
          {isSending
            ? 'Gönderiliyor…'
            : replyTo
              ? 'Yanıtı yayınla'
              : 'Yorumu yayınla'}
        </Button>
      </Box>

      {message && (
        <Message
          role={state === 'error' ? 'alert' : 'status'}
          aria-live='polite'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            color: state === 'error' ? 'error' : 'heading',
            bg: state === 'error' ? 'errorLight' : 'successLight',
            borderColor: state === 'error' ? 'error' : 'success',
            borderRadius: '8px',
            m: 0
          }}
        >
          {state !== 'error' && <FaCheckCircle aria-hidden='true' />}
          {message}
        </Message>
      )}

      <Flex sx={{ alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ color: 'omegaDark', lineHeight: 0, mt: '3px' }}>
          <FaLock aria-hidden='true' />
        </Box>
        <Text
          as='p'
          sx={{ color: 'omegaDark', fontSize: 0, lineHeight: 1.6, m: 0 }}
        >
          E-posta adresin yayınlanmaz. Yorumlar otomatik yayınlanır ve
          gerektiğinde yönetici tarafından gizlenebilir.
        </Text>
      </Flex>
    </Box>
  )
}

CommentForm.propTypes = {
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  replyTo: PropTypes.shape({
    id: PropTypes.number,
    authorName: PropTypes.string
  }),
  siteKey: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onSaved: PropTypes.func.isRequired
}

const CommentCard = ({ comment, onReply, nested = false }) => (
  <Box
    id={`yorum-${comment.id}`}
    as='article'
    sx={{
      position: 'relative',
      ml: nested ? [3, 5] : 0,
      mt: nested ? 2 : 3,
      p: [3, 4],
      bg: nested ? 'omegaLighter' : 'contentBg',
      border: '1px solid',
      borderColor: 'omegaLight',
      borderRadius: '12px',
      boxShadow: nested
        ? 'none'
        : theme => `0 16px 40px -36px ${theme.colors.omegaDarker}`,
      '&::before': nested
        ? {
            content: '""',
            position: 'absolute',
            top: -10,
            left: [-14, -22],
            width: [10, 18],
            height: 28,
            borderLeft: '2px solid',
            borderBottom: '2px solid',
            borderColor: 'alphaLight',
            borderBottomLeftRadius: '8px'
          }
        : undefined
    }}
  >
    <Flex
      sx={{
        alignItems: ['flex-start', 'baseline'],
        justifyContent: 'space-between',
        flexDirection: ['column', 'row'],
        gap: 1
      }}
    >
      <Text as='strong' sx={{ color: 'heading', fontSize: 2 }}>
        {comment.authorName}
      </Text>
      <Text
        as='time'
        dateTime={comment.createdAt}
        sx={{ color: 'omegaDark', fontSize: 0 }}
      >
        {formatDate(comment.createdAt)}
      </Text>
    </Flex>
    <Text
      as='p'
      sx={{
        color: 'article',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        lineHeight: 1.75,
        my: 3
      }}
    >
      {comment.body}
    </Text>
    <Flex
      sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
    >
      <Text sx={{ color: 'omegaDark', fontSize: 0 }}>
        {comment.editedAt ? 'Düzenlendi' : ''}
      </Text>
      <Button
        type='button'
        variant='secondary'
        onClick={() => onReply(comment)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 2,
          py: 2,
          px: 3,
          borderRadius: '8px',
          fontSize: 0,
          fontWeight: 'bold'
        }}
      >
        <FaReply aria-hidden='true' /> Yanıtla
      </Button>
    </Flex>
  </Box>
)

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  onReply: PropTypes.func.isRequired,
  nested: PropTypes.bool
}

const Comments = ({ title, slug, comments }) => {
  const path = slug?.startsWith('/')
    ? slug
    : typeof window !== 'undefined'
      ? window.location.pathname
      : '/'
  const [sort, setSort] = useState('newest')
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [replyTo, setReplyTo] = useState(null)

  const load = useCallback(
    async ({ append = false, nextCursor = null } = {}) => {
      setStatus('loading')
      setError('')
      try {
        const query = new URLSearchParams({ post: path, sort })
        if (nextCursor) query.set('cursor', nextCursor)
        const response = await fetch(`/api/comments?${query}`)
        const responseText = await response.text()
        const result = responseText ? JSON.parse(responseText) : null
        if (!response.ok || result?.ok === false)
          throw new Error(result?.error || 'Yorumlar yüklenemedi.')
        setItems(current =>
          append ? [...current, ...(result?.items || [])] : result?.items || []
        )
        setCursor(result?.nextCursor || null)
        setStatus('ready')
      } catch (loadError) {
        setStatus('error')
        setError(loadError.message || 'Yorumlar şu anda yüklenemiyor.')
      }
    },
    [path, sort]
  )

  useEffect(() => {
    load()
  }, [load])

  const commentCount = items.reduce(
    (total, item) => total + 1 + (item.replies?.length || 0),
    0
  )

  return (
    <Box data-native-comments>
      <CommentForm
        path={path}
        title={title || 'Yazı'}
        replyTo={replyTo}
        siteKey={comments.turnstileSiteKey}
        onCancel={() => setReplyTo(null)}
        onSaved={async () => {
          setReplyTo(null)
          await load()
        }}
      />

      <Flex
        sx={{
          alignItems: ['flex-start', 'center'],
          justifyContent: 'space-between',
          flexDirection: ['column', 'row'],
          gap: 3,
          mt: [4, 5],
          pt: [4, 5],
          borderTop: '1px solid',
          borderColor: 'omegaLight'
        }}
      >
        <Box>
          <Text
            as='p'
            sx={{ color: 'heading', fontSize: 2, fontWeight: 'bold', m: 0 }}
          >
            Konuşmalar
          </Text>
          <Text as='p' sx={{ color: 'omegaDark', fontSize: 0, mt: 1, mb: 0 }}>
            {commentCount
              ? `${commentCount} yorum`
              : 'Sohbeti sen başlatabilirsin.'}
          </Text>
        </Box>
        <Label
          htmlFor='comment-sort'
          sx={{
            alignItems: 'center',
            width: ['100%', 'auto'],
            gap: 2,
            color: 'omegaDark',
            fontSize: 1
          }}
        >
          Sıralama
          <Select
            id='comment-sort'
            value={sort}
            onChange={event => setSort(event.target.value)}
            sx={{
              width: ['100%', 'auto'],
              minWidth: 130,
              minHeight: 44,
              color: 'heading',
              bg: 'contentBg',
              borderColor: 'omegaLight',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value='newest'>En yeni</option>
            <option value='oldest'>En eski</option>
          </Select>
        </Label>
      </Flex>

      {status === 'loading' && !items.length && (
        <Flex
          role='status'
          sx={{ alignItems: 'center', justifyContent: 'center', gap: 2, py: 5 }}
        >
          <Spinner size={20} /> <Text>Yorumlar yükleniyor…</Text>
        </Flex>
      )}
      {error && (
        <Message role='alert' sx={{ mt: 3, borderRadius: '8px' }}>
          {error}
        </Message>
      )}
      {status === 'ready' && !items.length && (
        <Flex
          sx={{
            alignItems: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            py: [4, 5]
          }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              color: 'alpha',
              bg: 'alphaLighter',
              borderRadius: '50%',
              mb: 3
            }}
          >
            <FaRegCommentDots size={21} aria-hidden='true' />
          </Flex>
          <Text as='p' sx={{ color: 'heading', fontWeight: 'bold', m: 0 }}>
            Henüz yorum yok
          </Text>
          <Text as='p' sx={{ color: 'omegaDark', fontSize: 1, mt: 1, mb: 0 }}>
            Bu yazı hakkındaki ilk düşünceyi sen paylaşabilirsin.
          </Text>
        </Flex>
      )}
      {items.map(root => (
        <Box key={root.id}>
          <CommentCard comment={root} onReply={setReplyTo} />
          {(root.replies || []).map(reply => (
            <CommentCard
              key={reply.id}
              comment={reply}
              onReply={setReplyTo}
              nested
            />
          ))}
        </Box>
      ))}
      {cursor && (
        <Button
          type='button'
          variant='secondary'
          disabled={status === 'loading'}
          onClick={() => load({ append: true, nextCursor: cursor })}
          sx={{ mt: 3, borderRadius: '8px' }}
        >
          {status === 'loading' ? 'Yükleniyor…' : 'Daha fazla yorum göster'}
        </Button>
      )}
    </Box>
  )
}

Comments.propTypes = {
  title: PropTypes.string,
  slug: PropTypes.string,
  comments: PropTypes.shape({ turnstileSiteKey: PropTypes.string }).isRequired
}

export default Comments
