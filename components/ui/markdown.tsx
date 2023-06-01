import clsx from 'clsx'
import { getMDXComponent } from 'next-contentlayer/hooks'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import { LinkHTMLAttributes, PropsWithChildren } from 'react'

function CustomLink(props: LinkHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href

  if (href?.startsWith('/')) {
    return (
      <Link href={href as any} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href?.startsWith('#')) {
    return <a {...props} />
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />
}

function RoundedImage({ alt, ...props }: ImageProps) {
  return (
    <Image
      alt={alt}
      fill
      className='rounded-lg object-contain w-full !h-[unset] !relative bg-white dark:bg-white-reversed col-wide'
      {...props}
    />
  )
}

function Blockquote(props: PropsWithChildren<unknown>) {
  return (
    <blockquote className='border-l-[5px] mb-0 border-orange-400 bg-gray-100 py-0.5 px-6 font-bold not-italic tracking-tight text-slate-600 dark:bg-[#1c1c1c] dark:text-neutral-400'>
      {props.children}
    </blockquote>
  )
}

function Table(props: PropsWithChildren<unknown>) {
  return (
    <div className='bg-[#f6f6f6] dark:bg-[#2f333c] px-2 py-4 rounded-md'>
      <table className='my-0'>{props.children}</table>
    </div>
  )
}

const components: Record<string, any> = {
  img: RoundedImage,
  a: CustomLink,
  blockquote: Blockquote,
  table: Table,
}

export default function Markdown({ code }: { code: string }) {
  const Component = getMDXComponent(code)
  return (
    <article
      className={clsx(
        'grid grid-cols-canvas [&>*]:col-main',
        'max-w-none [&_p:has(img.col-wide)]:col-wide',
        'prose prose-neutral prose-tight dark:prose-invert marker:text-black dark:marker:text-white',
        'text-base leading-7', // text
        'prose-headings:font-extrabold prose-headings:mt-6',
        'prose-h1:text-3xl', // h1
        'prose-h2:text-2xl', // h2
        'prose-h3:text-xl prose-h3:text-neutral-600 dark:prose-h3:text-neutral-300 ', // h3
        'prose-strong:font-bold', // strong
      )}
    >
      <Component components={components} />
    </article>
  )
}
