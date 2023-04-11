import type { Metadata } from 'next'

import Page, { getPageMetadata } from '@/ui/page'

export const metadata: Metadata = getPageMetadata({ slug: 'about' })

export default function About() {
  return (<Page slug='about' />)
}
