import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { RateLimitWindow } from './rate-limit.ts'
import { RATE_LIMIT, RATE_LIMIT_WINDOW_SEC, advanceWindow, parseWindow } from './rate-limit.ts'

test('parseWindow accepts a stored counter and rejects junk', () => {
  assert.deepEqual(parseWindow({ count: 2, expires: 1000 }), { count: 2, expires: 1000 })
  assert.equal(parseWindow(null), undefined)
  assert.equal(parseWindow({ count: '2', expires: 1000 }), undefined)
  assert.equal(parseWindow(3), undefined)
})

test('advanceWindow starts a 10-minute window on the first hit', () => {
  const result = advanceWindow(undefined, 0)
  assert.equal(result.limited, false)
  assert.deepEqual(result.next, { count: 1, expires: RATE_LIMIT_WINDOW_SEC * 1000 })
  assert.equal(result.maxAge, RATE_LIMIT_WINDOW_SEC)
})

test('advanceWindow keeps the original expiry when incrementing', () => {
  const first = advanceWindow(undefined, 0)
  const second = advanceWindow(first.next, 12_000)
  assert.equal(second.limited, false)
  assert.equal(second.next.count, 2)
  assert.equal(second.next.expires, first.next.expires)
  assert.equal(second.maxAge, RATE_LIMIT_WINDOW_SEC - 12)
})

test('advanceWindow blocks the sixth request in the same window', () => {
  let current: RateLimitWindow | undefined
  let now = 0
  for (let i = 0; i < RATE_LIMIT; i += 1) {
    const result = advanceWindow(current, now)
    assert.equal(result.limited, false)
    current = result.next
    now += 1000
  }

  assert.ok(current)
  const blocked = advanceWindow(current, now)
  assert.equal(blocked.limited, true)
  assert.equal(blocked.next.count, RATE_LIMIT)
  assert.equal(blocked.next.expires, current.expires)
})

test('advanceWindow resets after the stored expiry', () => {
  const spent = { count: RATE_LIMIT, expires: 60_000 }
  const reset = advanceWindow(spent, 60_000)
  assert.equal(reset.limited, false)
  assert.equal(reset.next.count, 1)
  assert.equal(reset.next.expires, 60_000 + RATE_LIMIT_WINDOW_SEC * 1000)
})
