import type { Metadata } from 'next'

import Page, { getPageMetadata } from '@/components/page'

export const metadata: Metadata = getPageMetadata({ slug: 'press' })

export default function Press() {
  return (<Page slug='press' />)
}
