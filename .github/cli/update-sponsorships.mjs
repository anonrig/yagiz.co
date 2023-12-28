// Go to https://github.com/sponsors/anonrig/dashboard/your_sponsors
// Click to Export button and save it to .github/sponsorships.json

import fs from 'node:fs'
import { cancel, confirm, isCancel, spinner } from '@clack/prompts'
import open from 'open'

function get_tier(transaction, sponsor) {
  if (transaction == null && sponsor.is_yearly) {
    return 'silver-sponsor'
  }
  switch (transaction?.tier_name.split(' ')[0]) {
    case '$10':
      return 'supporter'
    case '$20':
      return 'supporter'
    case '$50':
      return 'top-supporter'
    case '$100':
      return 'silver-sponsor'
    case '$500':
      return 'gold-sponsor'
    case '$1000':
      return 'platinum-sponsor'
    default:
      return null
  }
}

export async function updateSponsorships() {
  const s = spinner()

  const should_open_github = await confirm({
    message: 'Do you want to open GitHub Sponsors dashboard?',
  })

  if (isCancel(should_open_github)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  if (should_open_github) {
    s.start('Opening GitHub Sponsors dashboard...')
    await open('https://github.com/sponsors/anonrig/dashboard/your_sponsors')
    s.stop('Github sponsors dashboard opened.')
  }

  const is_exported = await confirm({
    message: 'Did you export sponsorships from GitHub to sponsorships.json?',
  })

  if (isCancel(is_exported)) {
    cancel('Operation cancelled.')
    process.exit(0)
  }

  const raw_sponsorships = fs.readFileSync(
    new URL('../../sponsorships.json', import.meta.url),
    'utf8',
  )
  const sponsorships = JSON.parse(raw_sponsorships)
  const tiers = new Map([
    ['supporter', []], // $10 a month
    ['top-supporter', []], // $50 a month
    ['silver-sponsor', []], // $100 a month
    ['gold-sponsor', []], // $500 a month
    ['platinum-sponsor', []], // $1000 a month
  ])

  for (const sponsor of sponsorships) {
    const last_transaction = sponsor.transactions.at(-1)
    const tier = get_tier(last_transaction, sponsor)

    if (tier == null) continue

    tiers
      .get(tier)
      .push(`- [${sponsor.sponsor_profile_name}](https://github.com/${sponsor.sponsor_handle})`)
  }

  const content = `
---
title: Supporters
description: >-
  Thanks to the supporters below, I have the chance to contribute to Node.js and improve the performance of critical paths.
type: Page
---

# Thank you!

Thanks to the supporters below, I have the chance to contribute to Node.js and
improve the performance of critical paths. If you didn't sponsor me yet, you can
do it from [GitHub Sponsors](https://github.com/sponsors/anonrig).

## Platinum

${tiers.get('platinum-sponsor').join('\n')}

## Gold

${tiers.get('gold-sponsor').join('\n')}

## Silver

${tiers.get('silver-sponsor').join('\n')}

### Top Supporters

${tiers.get('top-supporter').join('\n')}

### Supporters

${tiers.get('supporter').join('\n')}

This page is updated on the first day of every month.
  `.trim()

  fs.writeFileSync(
    new URL('../../content/pages/supporters.mdx', import.meta.url),
    `${content}\n`,
    'utf8',
  )
}
