import type { CollectionEntry } from 'astro:content'
import {
  authorFullName,
  authorJobTitle,
  githubImage,
  twitterUsername,
  websiteDescription,
  websiteTitle,
  websiteUrl,
} from '@/lib/content'

export type JsonLd = Record<string, unknown>

const personId = `${websiteUrl}/#person`
const websiteId = `${websiteUrl}/#website`
const blogId = `${websiteUrl}/#blog`

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  return new URL(path.startsWith('/') ? path : `/${path}`, websiteUrl).href
}

export function personJsonLd(): JsonLd {
  return {
    '@type': 'Person',
    '@id': personId,
    name: authorFullName,
    url: websiteUrl,
    image: githubImage,
    jobTitle: authorJobTitle,
    description: websiteDescription,
    sameAs: ['https://github.com/anonrig', `https://x.com/${twitterUsername}`],
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: websiteUrl,
    name: websiteTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': personId },
    author: { '@id': personId },
  }
}

export function blogJsonLd(posts: CollectionEntry<'blog'>[]): JsonLd {
  return {
    '@type': 'Blog',
    '@id': blogId,
    url: websiteUrl,
    name: websiteTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': personId },
    author: { '@id': personId },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': absoluteUrl(`/${post.id}`),
      headline: post.data.title,
      url: absoluteUrl(`/${post.id}`),
      datePublished: post.data.date.toISOString().split('T')[0],
      description: post.data.description,
      author: { '@id': personId },
    })),
  }
}

export function homeJsonLd(posts: CollectionEntry<'blog'>[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [personJsonLd(), websiteJsonLd(), blogJsonLd(posts)],
  }
}

export function blogPostingJsonLd(
  post: CollectionEntry<'blog'>,
  tag: CollectionEntry<'tags'>,
): JsonLd {
  const url = absoluteUrl(`/${post.id}`)
  const date = post.data.date.toISOString().split('T')[0]
  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      {
        '@type': 'BlogPosting',
        '@id': url,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        headline: post.data.title,
        description: post.data.description,
        url,
        image: absoluteUrl(`/${post.id}/opengraph-image.png`),
        datePublished: date,
        dateModified: date,
        inLanguage: 'en-US',
        author: { '@id': personId },
        publisher: { '@id': personId },
        keywords: tag.data.title,
        articleSection: tag.data.title,
        wordCount: words,
        isPartOf: { '@id': blogId },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['article h1', 'article.prose'],
        },
      },
    ],
  }
}

export function tagCollectionJsonLd(
  tag: CollectionEntry<'tags'>,
  posts: CollectionEntry<'blog'>[],
): JsonLd {
  const url = absoluteUrl(`/tag/${tag.id}`)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      {
        '@type': 'CollectionPage',
        '@id': url,
        url,
        name: `#${tag.data.title}`,
        description: tag.data.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': blogId },
        about: {
          '@type': 'Thing',
          name: tag.data.title,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/${post.id}`),
            name: post.data.title,
          })),
        },
      },
    ],
  }
}

export function webPageJsonLd(options: {
  path: string
  title: string
  description: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
}): JsonLd {
  const url = absoluteUrl(options.path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      {
        '@type': options.type ?? 'WebPage',
        '@id': url,
        url,
        name: options.title,
        description: options.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        author: { '@id': personId },
        publisher: { '@id': personId },
      },
    ],
  }
}
