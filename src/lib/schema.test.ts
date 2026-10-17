import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  articleOpenGraphImages,
  authorDescription,
  blueskyUrl,
  githubAvatar,
  homepageTitle,
  logoImage,
  openGraphImage,
  websiteDescription,
  websiteUrl,
} from './content.ts'
import {
  aboutPageJsonLd,
  blogPostingJsonLd,
  breadcrumbsJsonLd,
  homeJsonLd,
  isoDateTime,
  schemaIds,
  tagCollectionJsonLd,
} from './schema.ts'
import type { SchemaPost, SchemaTag } from './schema.ts'
import { loadSitemapExtras } from './sitemap-dates.ts'

async function pngSize(relativePath: string): Promise<{ width: number; height: number }> {
  const file = fileURLToPath(new URL(relativePath, import.meta.url))
  const bytes = await readFile(file)
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
}

function blogPost(overrides: Partial<SchemaPost['data']> = {}, id = 'example-post'): SchemaPost {
  return {
    id,
    body: 'word '.repeat(400),
    data: {
      ...overrides,
      title: overrides.title ?? 'Example post',
      description: overrides.description ?? 'An example description',
      date: overrides.date ?? new Date('2024-05-02T00:00:00.000Z'),
      tag: overrides.tag ?? { id: 'performance' },
    },
  }
}

const performanceTag: SchemaTag = {
  id: 'performance',
  data: { title: 'Performance', description: 'Notes on speed.' },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    assert.fail(label)
  }
  return value
}

function graphNodes(document: { '@graph'?: unknown }): Record<string, unknown>[] {
  const nodes = document['@graph']
  if (!Array.isArray(nodes)) {
    assert.fail('@graph')
  }
  return nodes.map((node) => record(node, '@graph node'))
}

function findNode(nodes: Record<string, unknown>[], type: string): Record<string, unknown> {
  const node = nodes.find((item) => item['@type'] === type)
  if (node === undefined) {
    assert.fail(`missing ${type}`)
  }
  return node
}

function imageFields(value: unknown): { url: string; width: number; height: number } {
  const image = record(value, 'image')
  const { url, width, height } = image
  if (typeof url !== 'string' || typeof width !== 'number' || typeof height !== 'number') {
    assert.fail('image fields')
  }
  return { url, width, height }
}

test('declared image sizes match the shipped files', async () => {
  assert.deepEqual(await pngSize('../../public/opengraph-image.png'), openGraphImage)
  assert.deepEqual(await pngSize('../../public/apple-icon.png'), logoImage)
  assert.ok(homepageTitle.length <= 60)
  assert.ok(websiteDescription.length <= 160)
})

test('about page copy stays aligned with the author description', async () => {
  const source = await readFile(
    fileURLToPath(new URL('../content/pages/about.mdx', import.meta.url)),
    'utf8',
  )
  assert.ok(source.replaceAll(/\s+/gu, ' ').includes(authorDescription))
})

test('article JSON-LD follows Google article guidance', () => {
  const post = blogPost({
    series: 'url-parsing',
    updated: new Date('2024-06-01T00:00:00.000Z'),
  })
  const related = blogPost({}, 'related-post')
  const hero = {
    url: `${websiteUrl}/_astro/hero.png`,
    width: 1600,
    height: 900,
    alt: 'Benchmark chart',
    encodingFormat: 'image/png',
  }
  const nodes = graphNodes(
    blogPostingJsonLd(post, performanceTag, { hero, related: [related, post] }),
  )
  const article = findNode(nodes, 'BlogPosting')
  const images = article.image
  if (!Array.isArray(images)) {
    assert.fail('article images')
  }
  assert.equal(images.length, articleOpenGraphImages.length + 1)
  const first = imageFields(images[0])
  assert.equal(first.url, hero.url)
  assert.equal(first.width, 1600)
  assert.equal(first.height, 900)
  assert.deepEqual(
    images.slice(1).map((image) => imageFields(image)),
    articleOpenGraphImages.map((variant) => ({
      url: `${websiteUrl}/${post.id}/${variant.file}`,
      width: variant.width,
      height: variant.height,
    })),
  )
  assert.equal(article.datePublished, isoDateTime(post.data.date))
  assert.equal(article.dateModified, '2024-06-01T00:00:00.000Z')
  if (typeof article.datePublished !== 'string') {
    assert.fail('datePublished')
  }
  assert.match(article.datePublished, /T\d{2}:\d{2}:\d{2}/u)
  const author = record(article.author, 'author')
  assert.equal(author.name, 'Yagiz Nizipli')
  assert.equal(author.url, `${websiteUrl}/about`)
  const publisher = record(article.publisher, 'publisher')
  assert.equal(publisher['@type'], 'Organization')
  const logo = record(publisher.logo, 'logo')
  assert.equal(logo.width, logoImage.width)
  assert.equal(logo.url, `${websiteUrl}/apple-icon.png`)
  assert.deepEqual(article.isPartOf, [
    { '@id': schemaIds.blog },
    { '@id': `${websiteUrl}/url-parsing` },
  ])
  const page = findNode(nodes, 'WebPage')
  assert.deepEqual(page.relatedLink, [`${websiteUrl}/related-post`])
  assert.equal(JSON.stringify(nodes).includes('BlogPosting'), true)
})

test('tiny heroes do not replace the generated article images', () => {
  const nodes = graphNodes(
    blogPostingJsonLd(blogPost(), performanceTag, {
      hero: {
        url: `${websiteUrl}/_astro/tiny.png`,
        width: 100,
        height: 100,
        alt: 'Tiny',
      },
    }),
  )
  const article = findNode(nodes, 'BlogPosting')
  const images = article.image
  if (!Array.isArray(images)) {
    assert.fail('article images')
  }
  assert.equal(images.length, articleOpenGraphImages.length)
  assert.equal(imageFields(images[0]).url, `${websiteUrl}/example-post/opengraph-16x9.png`)
})

test('syndicated posts point the article at the canonical URL', () => {
  const canonical = 'https://example.com/original'
  const nodes = graphNodes(
    blogPostingJsonLd(blogPost({ canonical_url: canonical }), performanceTag),
  )
  const article = findNode(nodes, 'BlogPosting')
  const page = findNode(nodes, 'WebPage')
  assert.equal(article.url, canonical)
  assert.equal(article['@id'], `${canonical}#blogposting`)
  assert.equal(article.isBasedOn, canonical)
  assert.equal(page.url, `${websiteUrl}/example-post`)
  assert.equal(page.isBasedOn, canonical)
  assert.equal(page['@id'], `${websiteUrl}/example-post`)
})

test('listing pages do not emit BlogPosting entities', () => {
  const posts = [blogPost({}, 'one'), blogPost({}, 'two')]
  const home = JSON.stringify(homeJsonLd(posts))
  const tagPage = JSON.stringify(tagCollectionJsonLd(performanceTag, posts))
  assert.equal(home.includes('BlogPosting'), false)
  assert.equal(tagPage.includes('BlogPosting'), false)
  assert.equal(home.includes(`${websiteUrl}/one`), true)
  const nodes = graphNodes(homeJsonLd(posts))
  const page = findNode(nodes, 'WebPage')
  const image = imageFields(page.primaryImageOfPage)
  assert.equal(page.name, homepageTitle)
  assert.equal(image.width, openGraphImage.width)
  assert.equal(image.height, openGraphImage.height)
  const person = findNode(nodes, 'Person')
  assert.equal(person.url, `${websiteUrl}/about`)
  if (!Array.isArray(person.sameAs)) {
    assert.fail('sameAs')
  }
  assert.equal(person.sameAs.includes(blueskyUrl), true)
  const portrait = record(person.image, 'portrait')
  assert.equal(portrait.width, githubAvatar.width)
  assert.equal(portrait.height, githubAvatar.height)
  assert.equal(portrait.encodingFormat, githubAvatar.encodingFormat)
})

test('profile page main entity is the person', () => {
  const nodes = graphNodes(aboutPageJsonLd('About Yagiz Nizipli', authorDescription))
  const profile = nodes.find(
    (node) => node['@type'] === 'ProfilePage' || node['@type'] === 'WebPage',
  )
  if (profile === undefined) {
    assert.fail('missing profile')
  }
  assert.equal(profile['@type'], 'ProfilePage')
  const mainEntity = record(profile.mainEntity, 'mainEntity')
  assert.equal(mainEntity['@id'], schemaIds.person)
  assert.equal(mainEntity.name, 'Yagiz Nizipli')
  assert.equal(
    nodes.some((node) => node['@id'] === 'https://doi.org/10.1002/spe.3296'),
    true,
  )
})

test('breadcrumb items are absolute URLs', () => {
  const crumbs = breadcrumbsJsonLd(`${websiteUrl}/about`, [
    { name: 'Home', path: '/' },
    { name: 'About Yagiz Nizipli', path: '/about' },
  ])
  const items = crumbs.itemListElement
  if (!Array.isArray(items)) {
    assert.fail('breadcrumb items')
  }
  assert.deepEqual(
    items.map((item) => record(item, 'crumb').item),
    [websiteUrl, `${websiteUrl}/about`],
  )
  assert.equal(crumbs['@id'], `${websiteUrl}/about#breadcrumb`)
})

test('sitemap extras attach article images and stable lastmod dates', () => {
  const extras = loadSitemapExtras()
  const postUrl = `${websiteUrl}/announcing-ada-url-parser-v2-0`
  assert.equal(extras.lastmods.get(postUrl), '2023-03-30T00:00:00.000Z')
  const images = extras.images.get(postUrl)
  if (images === undefined) {
    assert.fail('article sitemap images')
  }
  assert.deepEqual(
    images.map((image) => image.url),
    articleOpenGraphImages.map((variant) => `${postUrl}/${variant.file}`),
  )
  assert.equal(images[0].title, 'Announcing Ada URL parser v2.0')
  assert.deepEqual(extras.images.get(websiteUrl), [
    { url: `${websiteUrl}/opengraph-image.png`, title: "Yagiz Nizipli's blog" },
  ])
  const homeLastmod = extras.lastmods.get(websiteUrl)
  if (typeof homeLastmod !== 'string') {
    assert.fail('home lastmod')
  }
  assert.match(homeLastmod, /^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/u)
  assert.equal(extras.lastmods.has(`${websiteUrl}/llms.txt`), false)
})
