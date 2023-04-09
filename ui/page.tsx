import { allPages } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import Figure from '@/ui/components/figure'
import Heading from '@/ui/components/heading'
import Markdown from '@/ui/components/markdown'
import { PropsWithChildren } from 'react'

type Props = { slug: string }

export function getPageMetadata({ slug }: Props): Metadata {
  const page = allPages.find(p => p.slug === slug)
  if (!page) { return { title: 'Not found' } }
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      url: `https://yagiz.co/${page.slug}`
    }
  }
}

export default function Page({ children, slug }: PropsWithChildren<Props>) {
  const page = allPages.find(p => p.slug === slug)

  if (!page) {
    notFound()
  }

  return (
    <section>
      <header className='mb-[4.5rem] grid grid-cols-canvas text-center'>
        <Heading text={page.title} />

        {page.feature_image && (
          <Figure
            alt={page.feature_image_alt ?? page.title}
            src={page.feature_image}
            caption={page.feature_image_caption}
          />
        )}
      </header>

      <div className='grid grid-cols-canvas text-2xl [&>*]:col-main'>
        <Markdown code={page.body.code} />
      </div>

      {children}
    </section>
  )
}
