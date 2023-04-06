import { allPages } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Figure from '@/ui/components/figure'
import Heading from '@/ui/components/heading'
import Markdown from '@/ui/components/markdown'

export const metadata: Metadata = {
  title: 'Press',
  description: 'Latest articles, blog posts and press releases featuring Yagiz Nizipli and his projects',
}


export default function Press() {
  const page = allPages.find(p => p.slug === 'press')

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
