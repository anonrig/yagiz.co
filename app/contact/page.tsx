import { Metadata } from 'next'

import ContactForm from '@/ui/contact-form'
import Page, { getPageMetadata } from '@/ui/page'

export function generateMetadata(): Metadata {
  return getPageMetadata({ slug: 'contact' })
}

export default function Press() {
  return (
    <Page slug={'contact'}>
      <ContactForm />
    </Page>
  )
}
