import type { CollectionEntry } from 'astro:content'
import { authorFullName, authorJobTitle, githubImage } from '@/lib/content'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    tw?: string
  }
}

export function BlogOG({ post }: { post: CollectionEntry<'blog'> }) {
  return (
    <div tw="h-full w-full flex flex-col items-start px-[70px] py-[90px] bg-slate-50 justify-between text-black">
      <div tw="text-[70px]" style={{ whiteSpace: 'pre-wrap', fontFamily: 'mulish-bold' }}>
        {post.data.title}
      </div>

      <div tw="flex flex-row justify-center text-[40px] items-center">
        <img src={githubImage} tw="rounded-full w-24 h-24" alt={authorFullName} />
        <div tw="flex flex-col pl-[30px]">
          <div tw="text-orange-500" style={{ fontFamily: 'mulish-bold' }}>
            {authorFullName}
          </div>
          {authorJobTitle}
        </div>
      </div>
    </div>
  )
}
