import { Blog } from 'contentlayer/generated'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Container from './container';

export default function BlogFooter({ index, blogs }: { index: number; blogs: Blog[] }) {
  // Newest blog post is at the 0th index
  const next = index !== 0 ? blogs.at(index - 1) : undefined
  const previous = index !== blogs.length - 1 ? blogs.at(index + 1) : undefined

  return (
    <Container size='tight' className='mt-16 flex items-center' as='footer'>
      <div className='flex flex-2'>
        {previous !== undefined && (
          <Link href={`/${previous.slug}`} aria-label='Previous article'>
            <ArrowLeft size={20} />
          </Link>
        )}
      </div>

      <div className='flex flex-col'>
        <div className='flex flex-col items-center gap-y-4'>
          <h3 className='mb-4 text-2xl font-extrabold tracking-wide text-slate-800'>
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

      <div className='flex flex-2 justify-end'>
        {next !== undefined && (
          <Link href={`/${next.slug}`} aria-label='Next article'>
            <ArrowRight size={20} />
          </Link>
        )}
      </div>
    </Container>
  )
}
