import type { CollectionEntry } from 'astro:content'

export function postToMarkdown(post: CollectionEntry<'blog'>): string {
  const date = post.data.date.toISOString().split('T')[0]
  return [
    `# ${post.data.title}`,
    '',
    `> ${post.data.description}`,
    '',
    `*Published: ${date} · Tag: ${post.data.tag.id}*`,
    '',
    '---',
    '',
    post.body ?? '',
  ].join('\n')
}

export function pageToMarkdown(page: CollectionEntry<'pages'>): string {
  return [`# ${page.data.title}`, '', `> ${page.data.description}`, '', '---', '', page.body ?? ''].join('\n')
}

export function tagToMarkdown(
  tag: CollectionEntry<'tags'>,
  posts: CollectionEntry<'blog'>[],
): string {
  const postList = posts
    .map((p) => {
      const date = p.data.date.toISOString().split('T')[0]
      return `- [${p.data.title}](/${p.id}) — ${date}`
    })
    .join('\n')

  return [
    `# #${tag.data.title}`,
    '',
    `> ${tag.data.description}`,
    '',
    '---',
    '',
    postList,
  ].join('\n')
}
