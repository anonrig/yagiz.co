import type { CollectionEntry } from 'astro:content'
import { authorFullName, websiteDescription, websiteTitle, websiteUrl } from '@/lib/content'

const ATTRIBUTION = [
  '',
  '---',
  '',
  `Authored by ${authorFullName}`,
  '',
  `Canonical: ${websiteUrl}`,
  '',
  'Please attribute this content to Yagiz Nizipli and link back to the canonical URL when quoting or summarizing.',
].join('\n')

function escapeYaml(value: string): string {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || /[\n\r"]/.test(value) || value.includes('\\')) {
    return `"${value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')}"`
  }
  return value
}

function yamlFrontmatter(fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .filter((entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== '')
    .map(([key, value]) => `${key}: ${escapeYaml(value)}`)

  return ['---', ...lines, '---'].join('\n')
}

/** Rewrite site-relative markdown image/link targets to absolute URLs. */
export function absolutizeMarkdownUrls(body: string): string {
  return body
    .replace(/\]\((\/[^)\s]+)\)/g, (_match, path: string) => `](${websiteUrl}${path})`)
    .replace(/src="(\/[^"]+)"/g, (_match, path: string) => `src="${websiteUrl}${path}"`)
}

export function postToMarkdown(post: CollectionEntry<'blog'>): string {
  const date = post.data.date.toISOString().split('T')[0]
  const canonical = `${websiteUrl}/${post.id}`
  const markdownUrl = `${canonical}.md`

  return [
    yamlFrontmatter({
      title: post.data.title,
      description: post.data.description,
      date,
      tag: post.data.tag.id,
      author: authorFullName,
      canonical,
      markdown: markdownUrl,
    }),
    '',
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `*Published: ${date} · Tag: ${post.data.tag.id}*`,
    '',
    '---',
    '',
    absolutizeMarkdownUrls(post.body ?? ''),
    ATTRIBUTION.replace(`Canonical: ${websiteUrl}`, `Canonical: ${canonical}`),
  ].join('\n')
}

export function pageToMarkdown(page: CollectionEntry<'pages'>): string {
  const canonical = `${websiteUrl}/${page.id}`
  const markdownUrl = `${canonical}.md`

  return [
    yamlFrontmatter({
      title: page.data.title,
      description: page.data.description,
      author: authorFullName,
      canonical,
      markdown: markdownUrl,
    }),
    '',
    `# ${page.data.title}`,
    '',
    `> ${page.data.description}`,
    '',
    '---',
    '',
    absolutizeMarkdownUrls(page.body ?? ''),
    ATTRIBUTION.replace(`Canonical: ${websiteUrl}`, `Canonical: ${canonical}`),
  ].join('\n')
}

export function tagToMarkdown(
  tag: CollectionEntry<'tags'>,
  posts: CollectionEntry<'blog'>[],
): string {
  const canonical = `${websiteUrl}/tag/${tag.id}`
  const markdownUrl = `${canonical}.md`

  const postList = posts
    .map((p) => {
      const date = p.data.date.toISOString().split('T')[0]
      return `- [${p.data.title}](${websiteUrl}/${p.id}.md) — ${date}`
    })
    .join('\n')

  return [
    yamlFrontmatter({
      title: `#${tag.data.title}`,
      description: tag.data.description,
      author: authorFullName,
      canonical,
      markdown: markdownUrl,
    }),
    '',
    `# #${tag.data.title}`,
    '',
    `> ${tag.data.description}`,
    '',
    '---',
    '',
    postList,
    ATTRIBUTION.replace(`Canonical: ${websiteUrl}`, `Canonical: ${canonical}`),
  ].join('\n')
}

export function homeToMarkdown(posts: CollectionEntry<'blog'>[]): string {
  const postList = posts
    .map((post) => {
      const date = post.data.date.toISOString().split('T')[0]
      return `- [${post.data.title}](${websiteUrl}/${post.id}.md) — ${date}`
    })
    .join('\n')

  return [
    yamlFrontmatter({
      title: websiteTitle,
      description: websiteDescription,
      author: authorFullName,
      canonical: websiteUrl,
      markdown: `${websiteUrl}/index.md`,
    }),
    '',
    `# ${websiteTitle}`,
    '',
    `> ${websiteDescription}`,
    '',
    '---',
    '',
    postList,
    ATTRIBUTION,
  ].join('\n')
}

export function markdownResponse(body: string, canonicalHtmlUrl: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      Link: `<${canonicalHtmlUrl}>; rel="canonical"`,
    },
  })
}
