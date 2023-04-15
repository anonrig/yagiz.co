import { Metadata } from 'next'

import ContactForm from '@/ui/contact-form'
import Page, { getPageMetadata } from '@/ui/page'

export const metadata: Metadata = getPageMetadata({ slug: 'contact' })

export default function Press() {
  return (
    <Page slug={'contact'}>
      <ContactForm className='mt-6' />
    </Page>
  )
}
