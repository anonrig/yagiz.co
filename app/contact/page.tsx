import { Metadata } from 'next'

import ContactForm from '@/components/contact-form'
import Page, { getPageMetadata } from '@/components/page'

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

export const metadata: Metadata = getPageMetadata({ slug: 'contact' })

export default function Press() {
  return (
    <Page slug={'contact'}>
      <ContactForm className="mt-6" />
    </Page>
  )
}
