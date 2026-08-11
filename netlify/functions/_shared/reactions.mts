import { cleanText, normalizePath, sha256 } from './comments.mts'

export const REACTION_KEYS = [
  'like',
  'funny',
  'love',
  'surprised',
  'angry',
  'sad'
] as const

export type ReactionKey = (typeof REACTION_KEYS)[number]

const VISITOR_PATTERN = /^[A-Za-z0-9_-]{20,100}$/

export const reactionVisitorHash = (value: unknown) => {
  if (typeof value !== 'string' || !VISITOR_PATTERN.test(value)) return ''
  return sha256(`article-reaction:${value}`)
}

export const reactionVotePayload = (input: Record<string, unknown>) => {
  const path = normalizePath(input.path)
  const title = cleanText(input.title, 300)
  const reaction =
    typeof input.reaction === 'string' &&
    REACTION_KEYS.includes(input.reaction as ReactionKey)
      ? (input.reaction as ReactionKey)
      : null
  const visitorHash = reactionVisitorHash(input.visitor)

  if (!path || !title || !reaction || !visitorHash) return null

  return {
    p_path: path,
    p_title: title,
    p_reaction: reaction,
    p_visitor_hash: visitorHash
  }
}
