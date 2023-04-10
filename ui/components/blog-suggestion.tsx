import { Blog } from 'contentlayer/generated'
import BlogRow from './blog-row'

export default function BlogSuggestion({ suggestions }: { suggestions: Blog[] }) {
  return (
    <section className='mt-24 bg-[#f6f6f6] dark:bg-[#2f333c] pb-[3rem] pt-[4.5rem]'>
      <div className='mx-auto w-full max-w-[calc(750px+8vw)] px-[4vw]'>
        <h3 className='mb-6 text-3xl font-extrabold tracking-wide dark:text-white'>
          You might also like...
        </h3>
        <div className='divide-y divide-slate-200 dark:divide-neutral-700'>
          {suggestions.map(suggestion => (
            <BlogRow blog={suggestion} key={suggestion._id} />
          ))}
        </div>
      </div>
    </section>
  )
}
