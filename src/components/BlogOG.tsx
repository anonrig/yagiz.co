import { githubImage } from '@/lib/content'
import type { Post } from '@/types/content'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    tw?: string
  }
}

export function BlogOG({ post }: { post: Post }) {
  return (
    <div tw="h-full w-full flex flex-col items-start px-[70px] py-[90px] bg-slate-50 justify-between text-black">
      <div tw="text-[70px]" style={{ whiteSpace: 'pre-wrap' }}>
        {post.data.title}
      </div>

      <div tw="flex flex-row justify-center text-[40px] items-center">
        <img src={githubImage} tw="rounded-full w-24 h-24" alt="Yagiz Nizipli" />
        <div tw="flex flex-col pl-[30px]">
          <div tw="text-orange-500">Yagiz Nizipli</div>
          Software Engineer
        </div>
      </div>
    </div>
  )
}
