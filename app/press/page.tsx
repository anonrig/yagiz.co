import type { Metadata } from 'next'

import Page, { getPageMetadata } from '@/ui/page'

export function generateMetadata(): Metadata {
  return getPageMetadata({ slug: 'press' })
}

export default function Press() {
  return (
    <Page slug='press' />
  )
}
