import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { sortedBlogs } from '@/app/content';

import Container from './container';

export default function BlogFooter({ index }: { index: number }) {
  // Newest blog post is at the 0th index
  const next = index !== 0 ? sortedBlogs.at(index - 1) : undefined
  const previous = index !== sortedBlogs.length - 1 ? sortedBlogs.at(index + 1) : undefined

  return (
    <Container size='tight' className='mt-16 flex items-center' as='footer'>
      <div className='flex flex-2 text-black dark:text-neutral-400'>
        {previous !== undefined && (
          <Link href={`/${previous.slug}`} aria-label='Previous article'>
            <ArrowLeft size={20} />
          </Link>
        )}
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-col items-center gap-y-4'>
          <h3 className='mb-4 font-extrabold tracking-wide text-slate-800 dark:text-white'>
            Published by:
          </h3>
          <Link href='/about'>
            <Image
              alt='A photo of Yagiz Nizipli'
              src='/author-image.png'
              width={50}
              height={50}
              className='rounded-full'
            />
          </Link>
        </div>
      </div>

      <div className='flex flex-2 justify-end text-black dark:text-neutral-400'>
        {next !== undefined && (
          <Link href={`/${next.slug}`} aria-label='Next article'>
            <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </Container>
  )
}
