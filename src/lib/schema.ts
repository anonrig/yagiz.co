import {
  articleOpenGraphImages,
  articleWideImage,
  authorDescription,
  authorFullName,
  authorJobTitle,
  githubAvatar,
  githubImage,
  homepageTitle,
  logoImage,
  openGraphImage,
  profileUrls,
  twitterUsername,
  websiteDescription,
  websiteTitle,
  websiteUrl,
} from './content.ts'
import { countWords, readingTimeIso } from './reading-time.ts'
import { SERIES } from './series.ts'
import type { SeriesId } from './series.ts'

/** Fields schema builders read from a blog entry. */
export interface SchemaPost {
  id: string
  body?: string
  data: {
    title: string
    description: string
    date: Date
    tag: { id: string }
    canonical_url?: string
    updated?: Date
    series?: SeriesId
  }
}

/** Fields schema builders read from a tag entry. */
export interface SchemaTag {
  id: string
  data: {
    title: string
    description: string
  }
}

export type JsonLd = Record<string, unknown>

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface CrawlableImage {
  url: string
  width: number
  height: number
  alt: string
  encodingFormat?: string
}

export const schemaIds = {
  person: `${websiteUrl}/#person`,
  organization: `${websiteUrl}/#organization`,
  website: `${websiteUrl}/#website`,
  blog: `${websiteUrl}/#blog`,
  webpage: `${websiteUrl}/#webpage`,
} as const

const parsingPaperId = 'https://doi.org/10.1002/spe.3296'
const parsingPaperUrl = 'https://onlinelibrary.wiley.com/doi/full/10.1002/spe.3296'

/** Google's article guidance: prefer images of at least 50K pixels. */
const MIN_ARTICLE_IMAGE_PIXELS = 50_000

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

export function imageMime(format: string): string {
  if (format === 'jpg' || format === 'jpeg') {
    return 'image/jpeg'
  }
  return `image/${format}`
}

export function serializeJsonLd(document: JsonLd): string {
  return JSON.stringify(document).replaceAll('<', String.raw`\u003c`)
}

export function imageObject(
  url: string,
  caption: string,
  options?: {
    width?: number
    height?: number
    encodingFormat?: string
    copyrightNotice?: string
  },
): JsonLd {
  const width = options?.width
  const height = options?.height
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    caption,
    name: caption,
    inLanguage: 'en-US',
    creditText: authorFullName,
    copyrightNotice: options?.copyrightNotice ?? authorFullName,
    creator: { '@id': schemaIds.person },
    copyrightHolder: { '@id': schemaIds.person },
    ...(width !== undefined && height !== undefined ? { width, height } : {}),
    ...(options?.encodingFormat ? { encodingFormat: options.encodingFormat } : {}),
  }
}

export function isoDateTime(date: Date): string {
  return date.toISOString()
}

export function postModifiedDate(post: SchemaPost): Date {
  return post.data.updated ?? post.data.date
}

function authorReference(): JsonLd {
  return {
    '@type': 'Person',
    '@id': schemaIds.person,
    name: authorFullName,
    url: absoluteUrl('/about'),
  }
}

function logoObject(): JsonLd {
  return {
    '@type': 'ImageObject',
    url: absoluteUrl('/apple-icon.png'),
    contentUrl: absoluteUrl('/apple-icon.png'),
    width: logoImage.width,
    height: logoImage.height,
    encodingFormat: 'image/png',
  }
}

function publisherReference(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': schemaIds.organization,
    name: websiteTitle,
    url: websiteUrl,
    logo: logoObject(),
  }
}

function subscribeAction(): JsonLd {
  return {
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
  }
}

function siteImage(): JsonLd {
  return imageObject(`${websiteUrl}/opengraph-image.png`, websiteTitle, {
    width: openGraphImage.width,
    height: openGraphImage.height,
    encodingFormat: 'image/png',
  })
}

export function personJsonLd(): JsonLd {
  return {
    ...authorReference(),
    givenName: 'Yagiz',
    familyName: 'Nizipli',
    alternateName: ['anonrig', 'yagiznizipli', 'Yağız Nizipli'],
    image: imageObject(githubImage, authorFullName, {
      width: githubAvatar.width,
      height: githubAvatar.height,
      encodingFormat: githubAvatar.encodingFormat,
    }),
    jobTitle: authorJobTitle,
    description: authorDescription,
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
    subjectOf: { '@id': parsingPaperId },
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
        url: profileUrls[1],
      },
    ],
    sameAs: [...profileUrls],
  }
}

export function organizationJsonLd(): JsonLd {
  return {
    ...publisherReference(),
    description: websiteDescription,
    founder: { '@id': schemaIds.person },
    image: siteImage(),
    sameAs: [...profileUrls],
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
    image: siteImage(),
    publisher: { '@id': schemaIds.organization },
    author: authorReference(),
    copyrightHolder: { '@id': schemaIds.person },
    audience: {
      '@type': 'Audience',
      audienceType: 'Software engineers',
    },
    potentialAction: subscribeAction(),
  }
}

function graph(...nodes: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [personJsonLd(), organizationJsonLd(), websiteJsonLd(), ...nodes],
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

export function blogBreadcrumbs(post: SchemaPost, tag: SchemaTag): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name: `#${tag.data.title}`, path: `/tag/${tag.id}` },
    { name: post.data.title, path: `/${post.id}` },
  ]
}

export function tagBreadcrumbs(tag: SchemaTag): BreadcrumbItem[] {
  return [
    { name: 'Home', path: '/' },
    { name: `#${tag.data.title}`, path: `/tag/${tag.id}` },
  ]
}

export function seriesBreadcrumbs(name: string, path: string): BreadcrumbItem[] {
  return pageBreadcrumbs(name, path)
}

function postUrl(post: SchemaPost): string {
  return absoluteUrl(`/${post.id}`)
}

function listItems(posts: SchemaPost[]): JsonLd[] {
  return posts.map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: post.data.title,
    url: postUrl(post),
    item: postUrl(post),
  }))
}

export function blogJsonLd(posts: SchemaPost[]): JsonLd {
  return {
    '@type': 'Blog',
    '@id': schemaIds.blog,
    url: websiteUrl,
    name: websiteTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    publisher: { '@id': schemaIds.organization },
    author: authorReference(),
    blogPost: posts.map((post) => postUrl(post)),
  }
}

export function homeJsonLd(posts: SchemaPost[]): JsonLd {
  return graph(blogJsonLd(posts), {
    '@type': 'WebPage',
    '@id': schemaIds.webpage,
    url: websiteUrl,
    name: homepageTitle,
    description: websiteDescription,
    inLanguage: 'en-US',
    isPartOf: { '@id': schemaIds.website },
    about: { '@id': schemaIds.person },
    mainEntity: { '@id': schemaIds.blog },
    primaryImageOfPage: siteImage(),
    author: authorReference(),
    publisher: { '@id': schemaIds.organization },
  })
}

function articleVariant(
  post: SchemaPost,
  variant: (typeof articleOpenGraphImages)[number],
  notice: string,
): JsonLd {
  return imageObject(absoluteUrl(`/${post.id}/${variant.file}`), post.data.title, {
    width: variant.width,
    height: variant.height,
    encodingFormat: 'image/png',
    copyrightNotice: notice,
  })
}

function generatedArticleImages(post: SchemaPost): [JsonLd, ...JsonLd[]] {
  const notice = `© ${post.data.date.getUTCFullYear()} ${authorFullName}`
  const [first, ...rest] = articleOpenGraphImages
  return [
    articleVariant(post, first, notice),
    ...rest.map((variant) => articleVariant(post, variant, notice)),
  ]
}

/** Heroes smaller than Google's article guidance stay visible, but are not structured images. */
export function crawlableArticleImage(hero?: CrawlableImage): CrawlableImage | undefined {
  if (hero === undefined || hero.width * hero.height < MIN_ARTICLE_IMAGE_PIXELS) {
    return undefined
  }
  return hero
}

/** Same URL JSON-LD uses for WebPage.primaryImageOfPage. */
export function articlePrimaryImageUrl(post: SchemaPost, hero?: CrawlableImage): string {
  const crawlable = crawlableArticleImage(hero)
  if (crawlable !== undefined) {
    return crawlable.url
  }
  return absoluteUrl(`/${post.id}/${articleWideImage.file}`)
}

/** Tag title, plus the series title when the post belongs to one. */
export function articleKeywords(post: SchemaPost, tag: SchemaTag): string {
  if (post.data.series === undefined) {
    return tag.data.title
  }
  return `${tag.data.title}, ${SERIES[post.data.series].title}`
}

function articleImages(post: SchemaPost, hero?: CrawlableImage): [JsonLd, ...JsonLd[]] {
  const generated = generatedArticleImages(post)
  const crawlable = crawlableArticleImage(hero)
  if (crawlable === undefined) {
    return generated
  }
  return [
    imageObject(crawlable.url, crawlable.alt, {
      width: crawlable.width,
      height: crawlable.height,
      encodingFormat: crawlable.encodingFormat,
      copyrightNotice: `© ${post.data.date.getUTCFullYear()} ${authorFullName}`,
    }),
    ...generated,
  ]
}

export function blogPostingJsonLd(
  post: SchemaPost,
  tag: SchemaTag,
  options?: {
    hero?: CrawlableImage
    related?: SchemaPost[]
  },
): JsonLd {
  const localUrl = postUrl(post)
  const articleUrl = post.data.canonical_url ?? localUrl
  const syndicated = Boolean(post.data.canonical_url)
  const published = isoDateTime(post.data.date)
  const modified = isoDateTime(postModifiedDate(post))
  const words = countWords(post.body)
  const crumbs = blogBreadcrumbs(post, tag)
  const images = articleImages(post, options?.hero)
  const [primaryImage] = images
  const related = (options?.related ?? [])
    .filter((item) => item.id !== post.id)
    .map((item) => postUrl(item))
  const keywords = articleKeywords(post, tag)

  return graph(
    breadcrumbsJsonLd(localUrl, crumbs),
    {
      '@type': 'WebPage',
      '@id': localUrl,
      url: localUrl,
      name: post.data.title,
      description: post.data.description,
      inLanguage: 'en-US',
      isPartOf: { '@id': schemaIds.website },
      breadcrumb: { '@id': `${localUrl}#breadcrumb` },
      mainEntity: { '@id': `${articleUrl}#blogposting` },
      primaryImageOfPage: primaryImage,
      author: authorReference(),
      publisher: { '@id': schemaIds.organization },
      ...(syndicated ? { isBasedOn: articleUrl } : {}),
      ...(related.length > 0 ? { relatedLink: related } : {}),
    },
    {
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#blogposting`,
      mainEntityOfPage: syndicated ? articleUrl : { '@id': localUrl },
      headline: post.data.title,
      description: post.data.description,
      url: articleUrl,
      image: images,
      thumbnailUrl: absoluteUrl(`/${post.id}/${articleWideImage.file}`),
      datePublished: published,
      dateModified: modified,
      inLanguage: 'en-US',
      author: authorReference(),
      publisher: publisherReference(),
      copyrightHolder: { '@id': schemaIds.person },
      copyrightYear: post.data.date.getUTCFullYear(),
      keywords,
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
      ...(syndicated ? { isBasedOn: articleUrl } : {}),
    },
  )
}

export function tagCollectionJsonLd(tag: SchemaTag, posts: SchemaPost[]): JsonLd {
  const url = absoluteUrl(`/tag/${tag.id}`)
  const crumbs = tagBreadcrumbs(tag)

  return graph(breadcrumbsJsonLd(url, crumbs), {
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
    author: authorReference(),
    publisher: { '@id': schemaIds.organization },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: listItems(posts),
    },
  })
}

export function scholarlyArticleJsonLd(): JsonLd {
  return {
    '@type': 'ScholarlyArticle',
    '@id': parsingPaperId,
    name: 'Parsing Millions of URLs per Second',
    url: parsingPaperUrl,
    identifier: parsingPaperId,
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

  return graph(breadcrumbsJsonLd(url, crumbs), {
    '@type': options.type ?? 'WebPage',
    '@id': url,
    url,
    name: options.title,
    description: options.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': schemaIds.website },
    about: { '@id': schemaIds.person },
    author: authorReference(),
    publisher: { '@id': schemaIds.organization },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    primaryImageOfPage: siteImage(),
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
  })
}

export function aboutPageJsonLd(title: string, description: string): JsonLd {
  const data = webPageJsonLd({
    path: '/about',
    title,
    description,
    type: 'ProfilePage',
    mainEntity: {
      ...authorReference(),
      description: authorDescription,
    },
    hasPart: [
      { name: 'Who is Yagiz Nizipli?', fragment: 'who-is-yagiz-nizipli' },
      { name: 'Memberships', fragment: 'memberships' },
      { name: 'Academic Papers', fragment: 'academic-papers' },
      { name: 'Links', fragment: 'links' },
    ],
  })

  const nodes = data['@graph']
  if (Array.isArray(nodes)) {
    nodes.push(scholarlyArticleJsonLd())
  }
  return data
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
    potentialAction: subscribeAction(),
  })
}

export function seriesCollectionJsonLd(
  path: string,
  title: string,
  description: string,
  posts: SchemaPost[],
): JsonLd {
  const url = absoluteUrl(path)
  const crumbs = seriesBreadcrumbs(title, path)

  return graph(breadcrumbsJsonLd(url, crumbs), {
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
    author: authorReference(),
    publisher: { '@id': schemaIds.organization },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: listItems(posts),
    },
  })
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
