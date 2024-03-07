import readingTime from 'reading-time'
import { getCollection, getEntry } from 'astro:content'

export const githubImage = 'https://github.com/anonrig.png'
export const twitterUrl = 'https://twitter.com/yagiznizipli'
export const rssUrl = 'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fwww.yagiz.co%2Frss%2F'
export const DEFAULT_TITLE = 'Engineering with Yagiz'
export const DEFAULT_DESCRIPTION =
  "Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies."

export const getPosts = async () => {
  const rawPosts = await getCollection('blog', (post) => post.data.status === 'published')
  const posts = await Promise.all(
    rawPosts.map(async (post) => {
      return {
        ...post,
        data: {
          ...post.data,
          tag: await getEntry(post.data.tag),
          url: `/${post.slug}`,
          structuredData: ({ origin }: { origin: string }) => ({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.data.title,
            datePublished: post.data.date,
            dateModified: post.data.date,
            description: post.data.description,
            url: `${origin}/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Yagiz Nizipli',
            },
          }),
          minute_to_read: readingTime(post.body).text,
        },
      }
    }),
  )
  return posts.sort((a, b) => +b.data.date - +a.data.date)
}

export async function getTags() {
  const tags = await getCollection('tags')

  return tags
    .map((tag) => {
      return {
        ...tag,
        data: {
          ...tag.data,
          url: `/tag/${tag.slug}`,
        },
      }
    })
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
}
