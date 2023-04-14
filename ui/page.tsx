import { allPages } from 'contentlayer/generated'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PropsWithChildren } from 'react'

import Figure from '@/ui/components/figure'
import Heading from '@/ui/components/heading'
import Markdown from '@/ui/components/markdown'

type Props = { slug: string }

export function getPageMetadata({ slug }: Props): Metadata {
  const page = allPages.find(p => p.slug === slug)
  if (!page) { return { title: 'Not found' } }
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url: `https://www.yagiz.co/${page.slug}`
    },
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

      <Markdown code={page.body.code} />

      {children}
    </section>
  )
}
