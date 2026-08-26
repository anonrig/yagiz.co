import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  escapeHtml,
  isEmail,
  isHoneypot,
  jsonResponse,
  oneLine,
  readJsonObject,
  readString,
  validateMessage,
  validateName,
  validateSubject,
} from './form-api.ts'

test('escapeHtml encodes markup used in contact mail', () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert(1)">&'"'"`),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;&quot;&#39;&quot;',
  )
})

test('oneLine strips header-injection characters from subjects', () => {
  assert.equal(oneLine('Hello\r\nBcc: evil@example.com'), 'Hello Bcc: evil@example.com')
})

test('isEmail accepts and rejects obvious addresses', () => {
  assert.equal(isEmail('yagiz@nizipli.com'), true)
  assert.equal(isEmail('not-an-email'), false)
  assert.equal(isEmail('a@b'), false)
  assert.equal(isEmail('foo@bar..com'), false)
  assert.equal(isEmail(''), false)
})

test('field validators match the public form minimums', () => {
  assert.equal(validateName('Ya'), true)
  assert.equal(validateName('Y'), false)
  assert.equal(validateSubject('Hello'), true)
  assert.equal(validateSubject('Hey'), false)
  assert.equal(validateMessage('x'.repeat(20)), true)
  assert.equal(validateMessage('too short'), false)
})

test('isHoneypot treats any filled company field as a bot', () => {
  assert.equal(isHoneypot('https://spam.example'), true)
  assert.equal(isHoneypot(''), false)
})

test('readJsonObject rejects invalid and non-object bodies', async () => {
  assert.equal(await readJsonObject(new Request('https://yagiz.co', { method: 'POST' })), null)
  assert.equal(
    await readJsonObject(
      new Request('https://yagiz.co', {
        method: 'POST',
        body: '[]',
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
    null,
  )

  const object = await readJsonObject(
    new Request('https://yagiz.co', {
      method: 'POST',
      body: JSON.stringify({ email: ' a@b.co ' }),
      headers: { 'Content-Type': 'application/json' },
    }),
  )
  assert.ok(object)
  assert.equal(readString(object, 'email'), 'a@b.co')
  assert.equal(readString(object, 'missing'), '')
})

test('jsonResponse is JSON and uncached', async () => {
  const response = jsonResponse(429, 'Too many requests. Please try again later.')
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.deepEqual(await response.json(), {
    status: 429,
    message: 'Too many requests. Please try again later.',
  })
})
