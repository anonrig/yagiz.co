import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  buildCommentThread,
  commentsLabel,
  conversationSourceUrl,
  discussionPermalink,
  discussionReplyUrl,
  formatCommentTime,
  isDiscussionId,
  isDiscussionThread,
  parseConversation,
} from './discussion.ts'

const ORIGIN_ID = '100'

const conversation = {
  originId: ORIGIN_ID,
  comments: [
    {
      id: ORIGIN_ID,
      text: 'Published a new post',
      createdAt: '2024-01-15T12:00:00.000Z',
      author: { name: 'Jane Doe', username: 'jane' },
    },
    {
      id: '200',
      text: 'Helpful write-up',
      createdAt: '2024-01-16T12:00:00.000Z',
      inReplyToId: ORIGIN_ID,
      author: { name: 'Alice', username: 'alice', avatarUrl: 'https://example.com/alice.jpg' },
    },
    {
      id: '201',
      text: 'Agreed with Alice',
      createdAt: '2024-01-16T13:00:00.000Z',
      inReplyToId: '200',
      author: { name: 'Bob', username: 'bob' },
    },
    {
      id: '202',
      text: 'Thanks for writing this',
      createdAt: '2024-01-17T12:00:00.000Z',
      inReplyToId: ORIGIN_ID,
      author: { name: 'Cara', username: 'cara' },
    },
    {
      id: '300',
      text: 'gone',
      createdAt: '2024-01-16T14:00:00.000Z',
      inReplyToId: ORIGIN_ID,
      author: { name: 'Gone', username: 'gone' },
      unavailable: true,
    },
    {
      id: '301',
      text: '   ',
      createdAt: '2024-01-16T15:00:00.000Z',
      inReplyToId: ORIGIN_ID,
      author: { name: 'Empty', username: 'empty' },
    },
  ],
}

test('isDiscussionId accepts numeric ids only', () => {
  assert.equal(isDiscussionId('2091898811153031276'), true)
  assert.equal(isDiscussionId('100'), true)
  assert.equal(isDiscussionId(''), false)
  assert.equal(isDiscussionId('abc'), false)
  assert.equal(isDiscussionId('12e3'), false)
  assert.equal(isDiscussionId('1'.repeat(21)), false)
})

test('discussion URLs stay on the public conversation', () => {
  assert.equal(
    discussionPermalink('2091898811153031276'),
    'https://x.com/yagiznizipli/status/2091898811153031276',
  )
  assert.equal(discussionPermalink('200', 'alice'), 'https://x.com/alice/status/200')
  assert.equal(
    discussionReplyUrl('2091898811153031276'),
    'https://x.com/intent/tweet?in_reply_to=2091898811153031276',
  )
})

test('conversationSourceUrl points at the public conversation', () => {
  assert.equal(
    conversationSourceUrl('2091898811153031276'),
    'https://api.fxtwitter.com/2/conversation/2091898811153031276',
  )
})

test('commentsLabel and formatCommentTime are reader-facing', () => {
  assert.equal(commentsLabel(0), 'No comments yet.')
  assert.equal(commentsLabel(1), '1 comment')
  assert.equal(commentsLabel(3), '3 comments')
  assert.equal(formatCommentTime('2024-01-16T12:00:00.000Z'), 'Jan 16, 2024')
  assert.equal(formatCommentTime('not-a-date'), 'not-a-date')
})

test('parseConversation and buildCommentThread nest eligible replies', () => {
  const entries = parseConversation(conversation)
  const thread = buildCommentThread(ORIGIN_ID, entries)

  assert.equal(thread.origin.text, 'Published a new post')
  assert.equal(thread.origin.author.username, 'jane')
  assert.equal(thread.commentCount, 3)
  assert.deepEqual(
    thread.comments.map((comment) => comment.author.name),
    ['Alice', 'Cara'],
  )
  assert.equal(thread.comments[0]?.text, 'Helpful write-up')
  assert.equal(thread.comments[0]?.replies[0]?.author.name, 'Bob')
  assert.equal(thread.comments[0]?.replies[0]?.text, 'Agreed with Alice')
  assert.equal(
    thread.comments.some((comment) => comment.text === 'gone'),
    false,
  )
})

test('parseConversation reads thread and replies from a conversation payload', () => {
  const entries = parseConversation({
    status: {
      id: ORIGIN_ID,
      text: 'Published a new post',
      created_at: 'Mon Jan 15 12:00:00 +0000 2024',
      author: { name: 'Jane Doe', screen_name: 'jane' },
    },
    thread: [
      {
        id: ORIGIN_ID,
        text: 'Published a new post',
        created_at: 'Mon Jan 15 12:00:00 +0000 2024',
        author: { name: 'Jane Doe', screen_name: 'jane' },
      },
    ],
    replies: [
      {
        id: '200',
        text: '@jane Helpful write-up',
        created_at: 'Tue Jan 16 12:00:00 +0000 2024',
        author: {
          name: 'Alice',
          screen_name: 'alice',
          avatar_url: 'https://example.com/alice.jpg',
        },
        replying_to: { status: ORIGIN_ID },
      },
    ],
  })
  const thread = buildCommentThread(ORIGIN_ID, entries)
  assert.equal(thread.commentCount, 1)
  assert.equal(thread.comments[0]?.text, 'Helpful write-up')
  assert.equal(thread.comments[0]?.author.username, 'alice')
  assert.equal(thread.comments[0]?.author.avatarUrl, 'https://example.com/alice.jpg')
})

test('parseConversation accepts a public feed list', () => {
  const entries = parseConversation({
    tweets: [
      {
        id_str: ORIGIN_ID,
        text: 'Published a new post',
        created_at: '2024-01-15T12:00:00.000Z',
        user: { name: 'Jane Doe', screen_name: 'jane' },
      },
    ],
  })
  assert.equal(entries[0]?.id, ORIGIN_ID)
  assert.equal(entries[0]?.author?.username, 'jane')
})

test('parseConversation accepts a single public status object', () => {
  const entries = parseConversation({
    id_str: ORIGIN_ID,
    text: 'Published a new post',
    created_at: '2024-01-15T12:00:00.000Z',
    user: {
      name: 'Jane Doe',
      screen_name: 'jane',
      profile_image_url_https: 'https://example.com/jane.jpg',
    },
  })

  const thread = buildCommentThread(ORIGIN_ID, entries)
  assert.equal(thread.origin.author.avatarUrl, 'https://example.com/jane.jpg')
  assert.equal(thread.commentCount, 0)
  assert.equal(thread.comments.length, 0)
})

test('parseConversation rejects unknown payloads and error objects', () => {
  assert.throws(() => parseConversation({ hello: true }), /Could not parse conversation/u)
  assert.throws(() => parseConversation({ error: 'gone' }), /gone/u)
})

test('isDiscussionThread accepts a built thread', () => {
  const thread = buildCommentThread(ORIGIN_ID, parseConversation(conversation))
  assert.equal(isDiscussionThread(thread), true)
  assert.equal(isDiscussionThread({ id: ORIGIN_ID }), false)
})
