import { allBlogs, allTags, Blog, Tag } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export const websiteDomain = 'https://www.yagiz.co'

export const sortedBlogs: Blog[] = allBlogs
  .filter(b => b.status === 'published')
  .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

export const sortedTags: Tag[] = allTags
  .sort((a, b) => a.title.localeCompare(b.title))
