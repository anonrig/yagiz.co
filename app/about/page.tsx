import type { Metadata } from 'next'

import Page, { getPageMetadata } from '@/ui/page'

export function generateMetadata(): Metadata {
  return getPageMetadata({ slug: 'about' })
}

export default function About() {
  return (
    <Page slug='about' />
  )
}
