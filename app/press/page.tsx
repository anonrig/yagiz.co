import type { Metadata } from 'next'

import Page, { getPageMetadata } from '@/components/page'

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

export const metadata: Metadata = getPageMetadata({ slug: 'press' })

export default function Press() {
  return (<Page slug='press' />)
}
