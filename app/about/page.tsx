import { allPages } from 'contentlayer/generated'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Figure from '@/ui/components/figure'
import Heading from '@/ui/components/heading'
import Markdown from '@/ui/components/markdown'

export const metadata: Metadata = {
  title: 'Who is Yagiz Nizipli?',
  description: 'Node.js core member and OpenJS Foundation Cross Project Council regular member'
}

export default function About() {
  const page = allPages.find(p => p.slug === 'about')

  if (!page) {
    notFound()
  }

  return (
    <article className='block'>
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
    </article>
  )
}
