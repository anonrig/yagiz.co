import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { websiteUrl } from './content.ts'

function stripSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

function frontmatterField(source: string, name: string): string | undefined {
  const block = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!block) {
    return undefined
  }
  const match = block[1].match(new RegExp(`^${name}:\\s*['"]?([^\\n'"]+)`, 'm'))
  return match?.[1]?.trim()
}

export function loadSitemapLastmods(): Map<string, string> {
  const blogDir = join(dirname(fileURLToPath(import.meta.url)), '../content/blog')
  const lastmods = new Map<string, string>()
  const latestByTag = new Map<string, Date>()
  let latestPost: Date | undefined

  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.mdx') && !file.endsWith('.md')) {
      continue
    }
    const source = readFileSync(join(blogDir, file), 'utf8')
    if (frontmatterField(source, 'status') !== 'published') {
      continue
    }
    const dateValue = frontmatterField(source, 'date')
    if (!dateValue) {
      continue
    }
    const date = new Date(`${dateValue}T00:00:00.000Z`)
    if (Number.isNaN(date.getTime())) {
      continue
    }
    const updatedValue = frontmatterField(source, 'updated')
    const updated = updatedValue ? new Date(`${updatedValue}T00:00:00.000Z`) : undefined
    const modified =
      updated && !Number.isNaN(updated.getTime()) && updated > date ? updated : date
    const id = file.replace(/\.mdx?$/, '')
    lastmods.set(stripSlash(`${websiteUrl}/${id}`), modified.toISOString())
    if (!latestPost || modified > latestPost) {
      latestPost = modified
    }
    const series = frontmatterField(source, 'series')
    if (series) {
      const current = latestByTag.get(`series:${series}`)
      if (!current || modified > current) {
        latestByTag.set(`series:${series}`, modified)
      }
    }
    const tag = frontmatterField(source, 'tag')
    if (tag) {
      const current = latestByTag.get(tag)
      if (!current || modified > current) {
        latestByTag.set(tag, modified)
      }
    }
  }

  if (latestPost) {
    lastmods.set(stripSlash(websiteUrl), latestPost.toISOString())
  }
  for (const [key, date] of latestByTag) {
    if (key.startsWith('series:')) {
      lastmods.set(stripSlash(`${websiteUrl}/${key.slice('series:'.length)}`), date.toISOString())
      continue
    }
    lastmods.set(stripSlash(`${websiteUrl}/tag/${key}`), date.toISOString())
  }

  return lastmods
}
