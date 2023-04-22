import type { Blog } from 'contentlayer/generated'

import { sortedBlogs } from '@/app/content'
import Container from '@/components/ui/container'

import BlogRow from './blog-row'

export default function BlogSuggestion({ index }: { index: number }) {
  const suggestions = [
    sortedBlogs.at(index - 2),
    sortedBlogs.at(index - 1),
  ].filter(Boolean) as Blog[]

  if (suggestions.length === 0) {
    return null
  }

  return (
    <section className='mt-24 bg-[#f6f6f6] dark:bg-[#2f333c] py-12'>
      <Container size='tight'>
        <h3 className='mb-4 text-xl font-extrabold dark:text-white'>
          You might also like...
        </h3>
        <div className='divide-y divide-slate-200 dark:divide-neutral-700'>
          {suggestions.map(suggestion => (
            <BlogRow blog={suggestion} key={suggestion._id} />
          ))}
        </div>
      </Container>
    </section>
  )
}
