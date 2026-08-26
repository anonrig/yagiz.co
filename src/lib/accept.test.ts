import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  isAgentOnlyPath,
  isImmutableAsset,
  markdownPath,
  preferredType,
  shouldSkipNegotiation,
} from './accept.ts'

test('preferredType defaults to the first produced type without Accept', () => {
  assert.equal(preferredType(null, ['text/html', 'text/markdown']), 'text/html')
})

test('preferredType picks markdown when it is preferred', () => {
  assert.equal(
    preferredType('text/markdown, text/html;q=0.8', ['text/html', 'text/markdown']),
    'text/markdown',
  )
})

test('preferredType returns null when every candidate is q=0', () => {
  assert.equal(
    preferredType('text/html;q=0, text/markdown;q=0', ['text/html', 'text/markdown']),
    null,
  )
})

test('preferredType treats application/pdf as unacceptable for html/markdown', () => {
  assert.equal(preferredType('application/pdf', ['text/html', 'text/markdown']), null)
})

test('preferredType honors */* as a match', () => {
  assert.equal(preferredType('*/*', ['text/html', 'text/markdown']), 'text/html')
})

test('markdownPath maps HTML paths to .md siblings', () => {
  assert.equal(markdownPath('/'), '/index.md')
  assert.equal(markdownPath('/about'), '/about.md')
  assert.equal(markdownPath('/about/'), '/about.md')
  assert.equal(markdownPath('/tag/performance'), '/tag/performance.md')
})

test('isAgentOnlyPath marks markdown and llms endpoints', () => {
  assert.equal(isAgentOnlyPath('/about.md'), true)
  assert.equal(isAgentOnlyPath('/llms.txt'), true)
  assert.equal(isAgentOnlyPath('/llms-full.txt'), true)
  assert.equal(isAgentOnlyPath('/about'), false)
})

test('shouldSkipNegotiation skips APIs, assets, and static files', () => {
  assert.equal(shouldSkipNegotiation('/api/contact'), true)
  assert.equal(shouldSkipNegotiation('/_astro/foo.css'), true)
  assert.equal(shouldSkipNegotiation('/about.md'), true)
  assert.equal(shouldSkipNegotiation('/about'), false)
})

test('isImmutableAsset covers hashed Astro assets', () => {
  assert.equal(isImmutableAsset('/_astro/family.hash.webp'), true)
  assert.equal(isImmutableAsset('/about'), false)
})
