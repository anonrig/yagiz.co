import type { CollectionEntry } from 'astro:content'

import {
  authorFullName,
  authorJobTitle,
  githubImage,
  openGraphImage,
  twitterUsername,
  websiteDescription,
  websiteTitle,
  websiteUrl,
} from '@/lib/content'
import { countWords, readingTimeIso } from '@/lib/reading-time'
import { SERIES } from '@/lib/series'

export type JsonLd = Record<string, unknown>

export interface BreadcrumbItem {
  name: string
  path: string
}

export const schemaIds = {
  person: `${websiteUrl}/#person`,
  website: `${websiteUrl}/#website`,
  blog: `${websiteUrl}/#blog`,
  webpage: `${websiteUrl}/#webpage`,
} as const

export type WebPageType = 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage' | 'ProfilePage'

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  if (path === '/' || path === '') {
    return websiteUrl
  }
  return `${websiteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function pageCanonical(pathname: string, override?: string): string {
  if (override) {
    return override
  }
  const path = pathname.replace(/\/+$/u, '') || '/'
  return absoluteUrl(path)
}

export function imageObject(
  url: string,
  caption: string,
  dimensions: { width: number; height: number } = openGraphImage,
): JsonLd {
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    caption,
    name: caption,
    width: dimensions.width,
    height: dimensions.height,
    inLanguage: 'en-US',
  }
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function postModifiedDate(post: CollectionEntry<'blog'>): Date {
  return post.data.updated ?? post.data.date
}

export function personJsonLd(): JsonLd {
  return {
    '@type': 'Person',
    '@id': schemaIds.person,
    name: authorFullName,
    givenName: 'Yagiz',
    familyName: 'Nizipli',
    alternateName: ['anonrig', 'Yağız Nizipli'],
    url: websiteUrl,
    image: imageObject(githubImage, authorFullName, { width: 460, height: 460 }),
    jobTitle: authorJobTitle,
    description: websiteDescription,
    knowsLanguage: ['en', 'tr'],
    knowsAbout: [
      'Node.js',
      'V8',
      'JavaScript',
      'Software performance',
      'URL parsing',
      'C++',
      'Rust',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: authorJobTitle,
      occupationalCategory: '15-1252.00',
    },
    memberOf: [
      {
        '@type': 'Organization',
        name: 'Node.js Technical Steering Committee',
        url: 'https://github.com/nodejs/TSC',
      },
      {
        '@type': 'Organization',
        name: 'V8',
        url: 'https://v8.dev',
      },
      {
        '@type': 'Organization',
        name: 'Node.js Performance Team',
        url: 'https://github.com/nodejs/performance',
      },
    ],
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'GitHub',
        value: 'anonrig',
        url: 'https://github.com/anonrig',
      },
      {
        '@type': 'PropertyValue',
        name: 'X',
        value: twitterUsername,
        url: `https://x.com/${twitterUsername}`,
      },
    ],
    sameAs: ['https://github.com/anonrig', `https://x.com/${twitterUsername}`],
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': schemaIds.website,
    url: websiteUrl,
    name: websiteTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': schemaIds.person },
    author: { '@id': schemaIds.person },
    copyrightHolder: { '@id': schemaIds.person },
    potentialAction: {
      '@type': 'SubscribeAction',
      name: 'Subscribe to the newsletter',
      target: absoluteUrl('/newsletter'),
    },
  }
}

export function breadcrumbsJsonLd(pageUrl: string, items: BreadcrumbItem[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function pageBreadcrumbs(name: string, path: string): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name, path },
  ]
}

export function blogBreadcrumbs(
  post: CollectionEntry<'blog'>,
  tag: CollectionEntry<'tags'>,
): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name: `#${tag.data.title}`, path: `/tag/${tag.id}` },
    { name: post.data.title, path: `/${post.id}` },
  ]
}

export function tagBreadcrumbs(tag: CollectionEntry<'tags'>): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name: `#${tag.data.title}`, path: `/tag/${tag.id}` },
  ]
}

export function seriesBreadcrumbs(name: string, path: string): BreadcrumbItem[] {
  return pageBreadcrumbs(name, path)
}

function blogPostPreview(post: CollectionEntry<'blog'>): JsonLd {
  const url = absoluteUrl(`/${post.id}`)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    headline: post.data.title,
    url,
    datePublished: isoDate(post.data.date),
    dateModified: isoDate(postModifiedDate(post)),
    description: post.data.description,
    author: { '@id': schemaIds.person },
    image: absoluteUrl(`/${post.id}/opengraph-image.png`),
  }
}

export function blogJsonLd(posts: CollectionEntry<'blog'>[]): JsonLd {
  return {
    '@type': 'Blog',
    '@id': schemaIds.blog,
    url: websiteUrl,
    name: websiteTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': schemaIds.person },
    author: { '@id': schemaIds.person },
    blogPost: posts.map((post) => blogPostPreview(post)),
    numberOfItems: posts.length,
  }
}

export function homeJsonLd(posts: CollectionEntry<'blog'>[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      blogJsonLd(posts),
      {
        '@type': 'WebPage',
        '@id': schemaIds.webpage,
        url: websiteUrl,
        name: websiteTitle,
        description: websiteDescription,
        inLanguage: 'en-US',
        isPartOf: { '@id': schemaIds.website },
        about: { '@id': schemaIds.person },
        mainEntity: { '@id': schemaIds.blog },
        primaryImageOfPage: imageObject(`${websiteUrl}/opengraph-image.png`, websiteTitle),
        author: { '@id': schemaIds.person },
        publisher: { '@id': schemaIds.person },
      },
    ],
  }
}

export function blogPostingJsonLd(
  post: CollectionEntry<'blog'>,
  tag: CollectionEntry<'tags'>,
): JsonLd {
  const url = absoluteUrl(`/${post.id}`)
  const published = isoDate(post.data.date)
  const modified = isoDate(postModifiedDate(post))
  const words = countWords(post.body)
  const crumbs = blogBreadcrumbs(post, tag)
  const image = imageObject(absoluteUrl(`/${post.id}/opengraph-image.png`), post.data.title)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbsJsonLd(url, crumbs),
      {
        '@type': 'BlogPosting',
        '@id': `${url}#blogposting`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
          url,
          name: post.data.title,
          description: post.data.description,
          isPartOf: { '@id': schemaIds.blog },
          breadcrumb: { '@id': `${url}#breadcrumb` },
          primaryImageOfPage: image,
        },
        headline: post.data.title,
        description: post.data.description,
        url,
        image,
        thumbnailUrl: absoluteUrl(`/${post.id}/opengraph-image.png`),
        datePublished: published,
        dateModified: modified,
        inLanguage: 'en-US',
        author: { '@id': schemaIds.person },
        publisher: { '@id': schemaIds.person },
        copyrightHolder: { '@id': schemaIds.person },
        copyrightYear: post.data.date.getUTCFullYear(),
        keywords: tag.data.title,
        articleSection: tag.data.title,
        wordCount: words,
        timeRequired: readingTimeIso(post.body),
        isAccessibleForFree: true,
        isPartOf: post.data.series
          ? [{ '@id': schemaIds.blog }, { '@id': absoluteUrl(SERIES[post.data.series].path) }]
          : { '@id': schemaIds.blog },
        about: {
          '@type': 'Thing',
          name: tag.data.title,
          url: absoluteUrl(`/tag/${tag.id}`),
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['article h1', '.prose'],
        },
        ...(post.data.canonical_url ? { isBasedOn: post.data.canonical_url } : {}),
      },
    ],
  }
}

export function tagCollectionJsonLd(
  tag: CollectionEntry<'tags'>,
  posts: CollectionEntry<'blog'>[],
): JsonLd {
  const url = absoluteUrl(`/tag/${tag.id}`)
  const crumbs = tagBreadcrumbs(tag)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbsJsonLd(url, crumbs),
      {
        '@type': 'CollectionPage',
        '@id': url,
        url,
        name: `#${tag.data.title}`,
        description: tag.data.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': schemaIds.blog },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: {
          '@type': 'Thing',
          name: tag.data.title,
          url,
        },
        author: { '@id': schemaIds.person },
        publisher: { '@id': schemaIds.person },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListOrder: 'https://schema.org/ItemListOrderDescending',
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/${post.id}`),
            name: post.data.title,
            item: blogPostPreview(post),
          })),
        },
      },
    ],
  }
}

export function scholarlyArticleJsonLd(): JsonLd {
  return {
    '@type': 'ScholarlyArticle',
    '@id': 'https://doi.org/10.1002/spe.3296',
    name: 'Parsing Millions of URLs per Second',
    url: 'https://onlinelibrary.wiley.com/doi/full/10.1002/spe.3296',
    identifier: 'https://doi.org/10.1002/spe.3296',
    author: [{ '@id': schemaIds.person }, { '@type': 'Person', name: 'Daniel Lemire' }],
    datePublished: '2023-03-07',
  }
}

export function webPageJsonLd(options: {
  path: string
  title: string
  description: string
  type?: WebPageType | WebPageType[]
  hasPart?: { name: string; fragment: string }[]
  mainEntity?: JsonLd
  potentialAction?: JsonLd
}): JsonLd {
  const url = absoluteUrl(options.path)
  const crumbs = pageBreadcrumbs(options.title, options.path)
  const image = imageObject(`${websiteUrl}/opengraph-image.png`, options.title)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbsJsonLd(url, crumbs),
      {
        '@type': options.type ?? 'WebPage',
        '@id': url,
        url,
        name: options.title,
        description: options.description,
        inLanguage: 'en-US',
        isPartOf: { '@id': schemaIds.website },
        about: { '@id': schemaIds.person },
        author: { '@id': schemaIds.person },
        publisher: { '@id': schemaIds.person },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        primaryImageOfPage: image,
        ...(options.mainEntity ? { mainEntity: options.mainEntity } : {}),
        ...(options.potentialAction ? { potentialAction: options.potentialAction } : {}),
        ...(options.hasPart
          ? {
              hasPart: options.hasPart.map((part) => ({
                '@type': 'WebPageElement',
                name: part.name,
                url: `${url}#${part.fragment}`,
              })),
            }
          : {}),
      },
    ],
  }
}

export function aboutPageJsonLd(title: string, description: string): JsonLd {
  const graph = webPageJsonLd({
    path: '/about',
    title,
    description,
    type: ['ProfilePage', 'AboutPage'],
    mainEntity: { '@id': schemaIds.person },
    hasPart: [
      { name: 'Who is Yagiz Nizipli?', fragment: 'who-is-yagiz-nizipli' },
      { name: 'Memberships', fragment: 'memberships' },
      { name: 'Academic Papers', fragment: 'academic-papers' },
      { name: 'Links', fragment: 'links' },
    ],
  })

  const nodes = graph['@graph']
  if (Array.isArray(nodes)) {
    nodes.push(scholarlyArticleJsonLd())
  }
  return graph
}

export function contactPageJsonLd(title: string, description: string): JsonLd {
  return webPageJsonLd({
    path: '/contact',
    title,
    description,
    type: 'ContactPage',
    mainEntity: {
      '@type': 'ContactPoint',
      contactType: 'author',
      url: absoluteUrl('/contact'),
      availableLanguage: ['English', 'Turkish'],
    },
  })
}

export function newsletterPageJsonLd(title: string, description: string): JsonLd {
  return webPageJsonLd({
    path: '/newsletter',
    title,
    description,
    potentialAction: {
      '@type': 'SubscribeAction',
      name: 'Subscribe to the newsletter',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/newsletter'),
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
    },
  })
}

export function seriesCollectionJsonLd(
  path: string,
  title: string,
  description: string,
  posts: CollectionEntry<'blog'>[],
): JsonLd {
  const url = absoluteUrl(path)
  const crumbs = seriesBreadcrumbs(title, path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      personJsonLd(),
      websiteJsonLd(),
      breadcrumbsJsonLd(url, crumbs),
      {
        '@type': 'CollectionPage',
        '@id': url,
        url,
        name: title,
        description,
        inLanguage: 'en-US',
        isPartOf: { '@id': schemaIds.blog },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: {
          '@type': 'Thing',
          name: title,
          url,
        },
        author: { '@id': schemaIds.person },
        publisher: { '@id': schemaIds.person },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: posts.length,
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(`/${post.id}`),
            name: post.data.title,
            item: blogPostPreview(post),
          })),
        },
      },
    ],
  }
}

export function pressPageJsonLd(title: string, description: string): JsonLd {
  return webPageJsonLd({
    path: '/press',
    title,
    description,
    type: 'CollectionPage',
    hasPart: [
      { name: 'Articles', fragment: 'articles' },
      { name: 'Printed Media', fragment: 'printed-media' },
      { name: 'Presentations & Podcasts', fragment: 'presentations--podcasts' },
      { name: 'Contributions', fragment: 'contributions' },
    ],
  })
}
