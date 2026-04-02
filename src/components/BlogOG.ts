import type { CollectionEntry } from 'astro:content'
import { authorFullName, authorJobTitle, githubImage } from '@/lib/content'

type SatoriNode = {
  type: string
  props: Record<string, unknown>
}

function h(type: string, props: Record<string, unknown>, ...children: unknown[]): SatoriNode {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } }
}

export function BlogOG({ post }: { post: CollectionEntry<'blog'> }): SatoriNode {
  return h(
    'div',
    {
      tw: 'h-full w-full flex flex-col items-start px-[70px] py-[90px] bg-slate-50 justify-between text-black',
    },
    h(
      'div',
      { tw: 'text-[70px]', style: { whiteSpace: 'pre-wrap', fontFamily: 'mulish-bold' } },
      post.data.title,
    ),
    h(
      'div',
      { tw: 'flex flex-row justify-center text-[40px] items-center' },
      h('img', { src: githubImage, tw: 'rounded-full w-24 h-24', alt: authorFullName }),
      h(
        'div',
        { tw: 'flex flex-col pl-[30px]' },
        h('div', { tw: 'text-orange-500', style: { fontFamily: 'mulish-bold' } }, authorFullName),
        authorJobTitle,
      ),
    ),
  )
}
