import fs from 'node:fs'
// Go to https://github.com/sponsors/anonrig/dashboard/your_sponsors
// Click to Export button and save it to .github/sponsorships.json
import sponsorships from '../sponsorships.json' assert { type: 'json' }

function get_tier(transaction) {
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

const tiers = new Map([
  ['supporter', []], // $10 a month
  ['top-supporter', []], // $50 a month
  ['silver-sponsor', []], // $100 a month
  ['gold-sponsor', []], // $500 a month
  ['platinum-sponsor', []], // $1000 a month
])

for (const sponsor of sponsorships) {
  const last_transaction = sponsor.transactions.at(-1)
  const tier = get_tier(last_transaction)

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
`.trim()

fs.writeFileSync(
  new URL('../../content/pages/supporters.mdx', import.meta.url),
  `${content}\n`,
  'utf8',
)
