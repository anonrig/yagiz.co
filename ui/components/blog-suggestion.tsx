import { Blog } from 'contentlayer/generated'
import BlogRow from './blog-row'
import Container from './container'

export default function BlogSuggestion({ index, blogs }: { index: number, blogs: Blog[] }) {
  const suggestions = [
    blogs.at(index - 2),
    blogs.at(index - 1),
  ].filter(Boolean) as Blog[]

  if (suggestions.length === 0) {
    return null
  }

  return (
    <section className='mt-24 bg-[#f6f6f6] dark:bg-[#2f333c] pb-[3rem] pt-[4.5rem]'>
      <Container size='tight'>
        <h3 className='mb-6 text-3xl font-extrabold tracking-wide dark:text-white'>
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
