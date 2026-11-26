import commentCopy from '../i18n/comments'
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
  Textarea,
  useColorMode
} from 'theme-ui'
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaPaperPlane,
  FaRegCommentDots,
  FaReply,
  FaTimes
} from 'react-icons/fa'

const initialForm = {
  name: '',
  email: '',
  comment: '',
  notifyReplies: false,
  website: ''
}

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
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': { borderColor: 'omega' }
  },
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

const secondaryActionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  minWidth: 'auto',
  minHeight: 36,
  py: 1,
  px: 2,
  color: 'heading',
  bg: 'transparent',
  border: '1px solid',
  borderColor: 'omegaLight',
  borderRadius: '999px',
  fontSize: 0,
  fontWeight: 'bold',
  transition: 'background-color 160ms ease, border-color 160ms ease',
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover': {
      color: 'heading',
      bg: 'alphaLighter',
      borderColor: 'alphaLight'
    }
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'alphaLight',
    outlineOffset: 2
  }
}

const formatDate = (value, language) =>
  new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))

const CommentForm = ({
  path,
  title,
  replyTo,
  siteKey,
  onCancel,
  onSaved,
  language
}) => {
  const labels = commentCopy[language]
  const [colorMode] = useColorMode()
  const [form, setForm] = useState(initialForm)
  const [token, setToken] = useState('')
  const [state, setState] = useState('idle')
  const [message, setMessage] = useState('')
  const turnstileRef = useRef(null)

  useEffect(() => {
    if (state !== 'saved') return undefined

    const timeout = window.setTimeout(() => {
      setState('idle')
      setMessage('')
    }, 7000)

    return () => window.clearTimeout(timeout)
  }, [state])

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
      setMessage(labels.securityRequired)
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
        throw new Error(result?.error || labels.saveError)
      setForm(initialForm)
      setState('saved')
      setMessage(form.notifyReplies ? labels.savedWithEmail : labels.saved)
      setToken('')
      turnstileRef.current?.reset()
      await onSaved()
    } catch (error) {
      setState('error')
      setMessage(
        language === 'en' ? labels.saveError : error.message || labels.saveError
      )
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
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            p: 3,
            bg: 'alphaLighter',
            borderRadius: '12px'
          }}
        >
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'alpha', lineHeight: 0 }}>
              <FaReply aria-hidden='true' />
            </Box>
            <Text as='p' sx={{ color: 'heading', m: 0 }}>
              {labels.replying(replyTo.authorName)}
            </Text>
          </Flex>
          <Button
            type='button'
            variant='mute'
            onClick={onCancel}
            sx={secondaryActionStyle}
          >
            <FaTimes aria-hidden='true' /> {labels.cancel}
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
            {labels.name}
          </Label>
          <Input
            id='comment-name'
            name='name'
            value={form.name}
            onChange={update}
            placeholder={labels.namePrompt}
            autoComplete='name'
            maxLength={80}
            required
            sx={fieldStyle}
          />
        </Box>
        <Box>
          <Label htmlFor='comment-email' sx={labelStyle}>
            {labels.email}
          </Label>
          <Input
            id='comment-email'
            name='email'
            type='email'
            value={form.email}
            onChange={update}
            placeholder={labels.emailPrompt}
            autoComplete='email'
            maxLength={254}
            required
            sx={fieldStyle}
          />
        </Box>
      </Box>

      <Box>
        <Label htmlFor='comment-body' sx={labelStyle}>
          {labels.comment}
        </Label>
        <Textarea
          id='comment-body'
          name='comment'
          value={form.comment}
          onChange={update}
          placeholder={labels.commentPrompt}
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
        {labels.notify}
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
              {labels.security}
            </Text>
          </Flex>
          {siteKey ? (
            <Box sx={{ minHeight: 65, width: '100%', minWidth: 0 }}>
              <Turnstile
                key={colorMode}
                ref={turnstileRef}
                siteKey={siteKey}
                options={{
                  language,
                  appearance: 'always',
                  size: 'flexible',
                  theme: colorMode === 'dark' ? 'dark' : 'light'
                }}
                onSuccess={setToken}
                onExpire={() => setToken('')}
                onError={() => setToken('')}
              />
            </Box>
          ) : (
            <Text as='p' role='alert' sx={{ color: 'error', m: 0 }}>
              {labels.securityUnavailable}
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
            ? labels.sending
            : replyTo
              ? labels.sendReply
              : labels.sendComment}
        </Button>
      </Box>

      {message && (
        <Message
          role={state === 'error' ? 'alert' : 'status'}
          aria-live='polite'
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            p: 3,
            color: 'heading',
            bg: 'contentBg',
            border: '1px solid',
            borderLeft: '4px solid',
            borderColor: state === 'error' ? 'error' : 'success',
            borderRadius: '8px',
            fontSize: 1,
            lineHeight: 1.55,
            textAlign: 'left',
            m: 0
          }}
        >
          <Box
            sx={{
              flex: '0 0 auto',
              color: state === 'error' ? 'error' : 'success',
              lineHeight: 0,
              mt: '3px'
            }}
          >
            {state === 'error' ? (
              <FaExclamationCircle aria-hidden='true' />
            ) : (
              <FaCheckCircle aria-hidden='true' />
            )}
          </Box>
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
          {labels.privacy}
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

const CommentCard = ({ comment, onReply, nested = false, language }) => {
  const labels = commentCopy[language]

  return (
    <Box
      id={`yorum-${comment.id}`}
      as='article'
      sx={{
        p: nested ? [2, 3] : 3,
        bg: nested ? 'omegaLighter' : 'transparent',
        '& + article': nested
          ? {
              borderTop: '1px solid',
              borderColor: 'omegaLight'
            }
          : undefined
      }}
    >
      <Flex sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Flex
          sx={{
            alignItems: 'baseline',
            flexWrap: 'wrap',
            columnGap: 2,
            rowGap: 1,
            minWidth: 0
          }}
        >
          <Text as='strong' sx={{ color: 'heading', fontSize: nested ? 1 : 2 }}>
            {comment.authorName}
          </Text>
          <Text
            as='time'
            dateTime={comment.createdAt}
            sx={{ color: 'omegaDark', fontSize: 0 }}
          >
            {formatDate(comment.createdAt, language)}
            {comment.editedAt ? ` · ${labels.edited}` : ''}
          </Text>
        </Flex>
        <Button
          type='button'
          variant='mute'
          onClick={() => onReply(comment)}
          sx={{ ...secondaryActionStyle, flex: '0 0 auto', ml: 2 }}
        >
          <FaReply aria-hidden='true' /> {labels.reply}
        </Button>
      </Flex>
      <Text
        as='p'
        sx={{
          color: 'article',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          fontSize: nested ? 1 : 2,
          lineHeight: 1.55,
          mt: 2,
          mb: 0
        }}
      >
        {comment.body}
      </Text>
    </Box>
  )
}

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  onReply: PropTypes.func.isRequired,
  nested: PropTypes.bool
}

const Comments = ({ title, slug, comments, language = 'tr' }) => {
  const labels = commentCopy[language]
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
        setError(
          language === 'en'
            ? labels.loadError
            : loadError.message || labels.loadError
        )
      }
    },
    [labels, language, path, sort]
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
        language={language}
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
          alignItems: ['flex-end', 'center'],
          justifyContent: 'space-between',
          gap: 2,
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
            {labels.discussion}
          </Text>
          <Text as='p' sx={{ color: 'omegaDark', fontSize: 0, mt: 1, mb: 0 }}>
            {commentCount ? labels.count(commentCount) : labels.first}
          </Text>
        </Box>
        <Label
          htmlFor='comment-sort'
          sx={{
            alignItems: 'center',
            width: 'auto',
            gap: 2,
            color: 'omegaDark',
            fontSize: 1
          }}
        >
          <Box
            as='span'
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
            {labels.sort}
          </Box>
          <Select
            id='comment-sort'
            value={sort}
            onChange={event => setSort(event.target.value)}
            sx={{
              width: 'auto',
              minWidth: 124,
              minHeight: 44,
              color: 'heading',
              bg: 'contentBg',
              borderColor: 'omegaLight',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          >
            <option value='newest'>{labels.newest}</option>
            <option value='oldest'>{labels.oldest}</option>
          </Select>
        </Label>
      </Flex>

      {status === 'loading' && !items.length && (
        <Flex
          role='status'
          sx={{ alignItems: 'center', justifyContent: 'center', gap: 2, py: 5 }}
        >
          <Spinner size={20} /> <Text>{labels.loading}</Text>
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
            {labels.empty}
          </Text>
          <Text as='p' sx={{ color: 'omegaDark', fontSize: 1, mt: 1, mb: 0 }}>
            {labels.invite}
          </Text>
        </Flex>
      )}
      {items.map(root => (
        <Box
          key={root.id}
          data-comment-thread
          sx={{
            mt: 3,
            overflow: 'hidden',
            bg: 'contentBg',
            border: '1px solid',
            borderColor: 'omegaLight',
            borderRadius: '14px',
            boxShadow: theme => `0 16px 42px -40px ${theme.colors.omegaDarker}`
          }}
        >
          <CommentCard
            comment={root}
            onReply={setReplyTo}
            language={language}
          />
          {Boolean(root.replies?.length) && (
            <Box
              data-comment-replies
              aria-label={labels.replies(root.authorName)}
              sx={{
                mx: [2, 3],
                mb: [2, 3],
                overflow: 'hidden',
                borderLeft: '3px solid',
                borderLeftColor: 'alphaLight',
                borderRadius: '0 10px 10px 0'
              }}
            >
              {root.replies.map(reply => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onReply={setReplyTo}
                  nested
                  language={language}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}
      {cursor && (
        <Button
          type='button'
          variant='mute'
          disabled={status === 'loading'}
          onClick={() => load({ append: true, nextCursor: cursor })}
          sx={{ ...secondaryActionStyle, mt: 3 }}
        >
          {status === 'loading' ? labels.loadingMore : labels.more}
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
