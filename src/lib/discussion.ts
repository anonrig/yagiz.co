import { twitterUsername } from './content.ts'

const DISCUSSION_ID = /^\d{1,20}$/u

export interface DiscussionAuthor {
  readonly name: string
  readonly username: string
  readonly avatarUrl?: string
}

export interface DiscussionEntry {
  readonly id: string
  readonly text: string
  readonly createdAt: string
  readonly author: DiscussionAuthor
}

export interface DiscussionComment extends DiscussionEntry {
  readonly replies: readonly DiscussionComment[]
}

interface MutableComment extends DiscussionEntry {
  replies: MutableComment[]
}

export interface DiscussionThread {
  readonly id: string
  readonly origin: DiscussionEntry
  readonly comments: readonly DiscussionComment[]
  readonly commentCount: number
}

interface ParsedEntry {
  readonly id: string
  readonly text: string
  readonly createdAt: string
  readonly inReplyToId?: string
  readonly author?: DiscussionAuthor
  readonly unavailable?: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }
  return ''
}

function parseAuthor(value: unknown): DiscussionAuthor | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const name = asString(value.name)
  const username = asString(value.username) || asString(value.screen_name)
  if (name.length === 0 || username.length === 0) {
    return undefined
  }

  const avatarUrl =
    asString(value.avatarUrl) ||
    asString(value.avatar_url) ||
    asString(value.profile_image_url_https) ||
    asString(value.profile_image_url)

  return avatarUrl.length > 0 ? { name, username, avatarUrl } : { name, username }
}

function parseEntry(value: unknown): ParsedEntry | undefined {
  if (!isRecord(value)) {
    return undefined
  }

  const id = asString(value.id) || asString(value.id_str)
  if (id.length === 0) {
    return undefined
  }

  const text = asString(value.text) || asString(value.full_text)
  const createdAt = asString(value.createdAt) || asString(value.created_at)
  const inReplyToId =
    asString(value.inReplyToId) ||
    asString(value.in_reply_to_status_id_str) ||
    asString(value.replying_to_status) ||
    (isRecord(value.replying_to) ? asString(value.replying_to.status) : '')
  const unavailable = value.unavailable === true || value.tombstone !== undefined

  return {
    id,
    text,
    createdAt,
    author: parseAuthor(value.author) ?? parseAuthor(value.user),
    unavailable,
    ...(inReplyToId.length > 0 ? { inReplyToId } : {}),
  }
}

function appendUnknownList(target: unknown[], value: unknown): void {
  if (!Array.isArray(value)) {
    return
  }
  for (const item of value) {
    target.push(item)
  }
}

function uniqueEntries(values: readonly unknown[]): ParsedEntry[] {
  const seen = new Set<string>()
  const entries: ParsedEntry[] = []
  for (const value of values) {
    const entry = parseEntry(value)
    if (entry === undefined || seen.has(entry.id)) {
      continue
    }
    seen.add(entry.id)
    entries.push(entry)
  }
  return entries
}

function isEligible(entry: ParsedEntry): entry is ParsedEntry & { author: DiscussionAuthor } {
  return (
    !entry.unavailable &&
    entry.text.trim().length > 0 &&
    entry.author !== undefined &&
    entry.author.name.length > 0 &&
    entry.author.username.length > 0
  )
}

function toEntry(entry: ParsedEntry & { author: DiscussionAuthor }): DiscussionEntry {
  return {
    id: entry.id,
    text: entry.text,
    createdAt: entry.createdAt,
    author: entry.author,
  }
}

function compareComments(left: DiscussionEntry, right: DiscussionEntry): number {
  const leftTime = Date.parse(left.createdAt)
  const rightTime = Date.parse(right.createdAt)
  if (!Number.isNaN(leftTime) && !Number.isNaN(rightTime) && leftTime !== rightTime) {
    return leftTime - rightTime
  }
  if (left.id < right.id) {
    return -1
  }
  if (left.id > right.id) {
    return 1
  }
  return 0
}

function sortTree(nodes: readonly MutableComment[]): DiscussionComment[] {
  return nodes.toSorted(compareComments).map((node) => ({
    id: node.id,
    text: node.text,
    createdAt: node.createdAt,
    author: node.author,
    replies: sortTree(node.replies),
  }))
}

function countComments(nodes: readonly DiscussionComment[]): number {
  let total = 0
  for (const node of nodes) {
    total += 1 + countComments(node.replies)
  }
  return total
}

export function isDiscussionId(value: string): boolean {
  return DISCUSSION_ID.test(value)
}

export function discussionPermalink(id: string, username = twitterUsername): string {
  return `https://x.com/${username}/status/${id}`
}

export function discussionReplyUrl(id: string): string {
  return `https://x.com/intent/tweet?in_reply_to=${encodeURIComponent(id)}`
}

export function conversationSourceUrl(id: string): string {
  return `https://api.fxtwitter.com/2/conversation/${encodeURIComponent(id)}`
}

function originFallbackUrl(id: string): string {
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replaceAll(/0+|\./gu, '')
  return `https://cdn.syndication.twimg.com/tweet-result?id=${encodeURIComponent(id)}&lang=en&token=${token}`
}

function stripLeadingMention(text: string): string {
  return text.replace(/^@\w+\s+/u, '')
}

export function commentsLabel(count: number): string {
  if (count === 0) {
    return 'No comments yet.'
  }
  if (count === 1) {
    return '1 comment'
  }
  return `${count} comments`
}

export function formatCommentTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function parseConversation(payload: unknown): ParsedEntry[] {
  if (isRecord(payload) && typeof payload.error === 'string') {
    throw new Error(payload.error)
  }

  if (Array.isArray(payload)) {
    return uniqueEntries(payload)
  }

  const list = isRecord(payload)
    ? Array.isArray(payload.comments)
      ? payload.comments
      : Array.isArray(payload.tweets)
        ? payload.tweets
        : undefined
    : undefined
  if (list !== undefined) {
    return uniqueEntries(list)
  }

  if (
    isRecord(payload) &&
    (Array.isArray(payload.thread) || Array.isArray(payload.replies) || isRecord(payload.status))
  ) {
    const items: unknown[] = []
    if (isRecord(payload.status)) {
      items.push(payload.status)
    }
    appendUnknownList(items, payload.thread)
    appendUnknownList(items, payload.replies)
    return uniqueEntries(items)
  }

  const single = parseEntry(payload)
  if (single !== undefined) {
    return [single]
  }

  throw new Error('Could not parse conversation')
}

export function buildCommentThread(
  originId: string,
  entries: readonly ParsedEntry[],
): DiscussionThread {
  const originParsed = entries.find((entry) => entry.id === originId)
  const origin =
    originParsed !== undefined && isEligible(originParsed)
      ? toEntry(originParsed)
      : {
          id: originId,
          text: '',
          createdAt: '',
          author: { name: '', username: '' },
        }

  const replyEntries: (ParsedEntry & { author: DiscussionAuthor })[] = []
  for (const entry of entries) {
    if (entry.id === originId || !isEligible(entry)) {
      continue
    }
    replyEntries.push({
      id: entry.id,
      text: stripLeadingMention(entry.text),
      createdAt: entry.createdAt,
      author: entry.author,
      inReplyToId: entry.inReplyToId,
      unavailable: entry.unavailable,
    })
  }

  const nodes = new Map<string, MutableComment>(
    replyEntries.map((entry) => [
      entry.id,
      {
        ...toEntry(entry),
        replies: [],
      },
    ]),
  )

  const roots: MutableComment[] = []
  for (const entry of replyEntries) {
    const node = nodes.get(entry.id)
    if (node === undefined) {
      continue
    }
    const parent = entry.inReplyToId === undefined ? undefined : nodes.get(entry.inReplyToId)
    if (parent === undefined || entry.inReplyToId === originId) {
      roots.push(node)
    } else {
      parent.replies.push(node)
    }
  }

  const comments = sortTree(roots)
  return {
    id: originId,
    origin,
    comments,
    commentCount: countComments(comments),
  }
}

export async function loadDiscussion(
  id: string,
  fetchImpl: typeof globalThis.fetch = globalThis.fetch,
): Promise<DiscussionThread> {
  if (!isDiscussionId(id)) {
    throw new Error('Invalid discussion id.')
  }

  const headers = {
    accept: 'application/json',
    'user-agent': 'Mozilla/5.0',
  }

  try {
    return await readDiscussion(id, conversationSourceUrl(id), fetchImpl, headers)
  } catch (error) {
    try {
      return await readDiscussion(id, originFallbackUrl(id), fetchImpl, headers)
    } catch {
      throw error instanceof Error ? error : new Error('Could not load conversation')
    }
  }
}

async function readDiscussion(
  id: string,
  url: string,
  fetchImpl: typeof globalThis.fetch,
  headers: HeadersInit,
): Promise<DiscussionThread> {
  const response = await fetchImpl(url, { headers })
  if (!response.ok) {
    throw new Error(`Could not load conversation (${String(response.status)})`)
  }
  const payload: unknown = await response.json()
  return buildCommentThread(id, parseConversation(payload))
}

export function isDiscussionThread(value: unknown): value is DiscussionThread {
  if (!isRecord(value) || !isRecord(value.origin) || !Array.isArray(value.comments)) {
    return false
  }
  if (asString(value.id).length === 0 || asString(value.origin.id).length === 0) {
    return false
  }
  return typeof value.commentCount === 'number' && Number.isFinite(value.commentCount)
}
