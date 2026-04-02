import type { CollectionEntry } from 'astro:content'
import { authorFullName, authorJobTitle, githubImage } from '@/lib/content'

export function BlogOG({ post }: { post: CollectionEntry<'blog'> }) {
  return {
    type: 'div',
    props: {
      tw: 'h-full w-full flex flex-col items-start px-[70px] py-[90px] bg-slate-50 justify-between text-black',
      children: [
        {
          type: 'div',
          props: {
            tw: 'text-[70px]',
            style: { whiteSpace: 'pre-wrap', fontFamily: 'mulish-bold' },
            children: post.data.title,
          },
        },
        {
          type: 'div',
          props: {
            tw: 'flex flex-row justify-center text-[40px] items-center',
            children: [
              {
                type: 'img',
                props: { src: githubImage, tw: 'rounded-full w-24 h-24', alt: authorFullName },
              },
              {
                type: 'div',
                props: {
                  tw: 'flex flex-col pl-[30px]',
                  children: [
                    {
                      type: 'div',
                      props: {
                        tw: 'text-orange-500',
                        style: { fontFamily: 'mulish-bold' },
                        children: authorFullName,
                      },
                    },
                    authorJobTitle,
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  }
}
