import Image from 'next/image'

import { sortedBlogs } from '@/app/content'
import BlogRow from '@/components/blog-row'
import SubscribeButton from '@/components/subscribe'
import Container from '@/components/ui/container'
import FamilyPhoto from '@/public/family.png'
import dynamic from 'next/dynamic'

const Providers = dynamic(() => import('@/app/providers'), {
  loading: () => <div className="h-9 w-12" />,
})

export default function Home() {
  return (
    <>
      <Container className="-mt-8">
        <div className="mx-auto mb-4 flex max-w-lg flex-col items-center text-center">
          <div className="relative mb-8">
            <Image
              alt="Engineering with Yagiz"
              src={FamilyPhoto}
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="text-lg dark:text-zinc-200">
            Here's a collection of posts about my thoughts, stories, ideas and experiences as a
            human, and an engineer working with different technologies.
          </div>

          <Providers>
            <SubscribeButton
              label="Subscribe Now"
              className="mt-6 h-9 items-center justify-center rounded-md border-[1px] border-solid border-slate-200 bg-white px-[15px] text-[11px] font-extrabold uppercase tracking-wider text-orange-400 outline-none hover:border-slate-300 dark:border-neutral-600 dark:bg-white-reversed dark:hover:border-neutral-500"
            />
          </Providers>
        </div>
      </Container>

      <div className="flex grow pt-8">
        <Container size="tight" className="divide-y divide-slate-200 dark:divide-neutral-700">
          {sortedBlogs.map((blog) => (
            <BlogRow blog={blog} key={blog._id} />
          ))}
        </Container>
      </div>
    </>
  )
}
