import type { ShikiTransformer } from '@shikijs/types'

const TITLE_RE = /title="([^"]*)"/

export function transformerMetaTitle(): ShikiTransformer {
  return {
    name: 'meta-title',
    preprocess(_code, options) {
      const meta = options.meta
      if (!meta?.__raw) {
        return
      }

      let raw = meta.__raw
      const match = TITLE_RE.exec(raw)
      if (match) {
        meta.title = match[1]
        raw = raw.replace(match[0], '')
      }

      meta.__raw = raw
        .replace(/\{([^}]+)\}/g, (_, inner: string) => `{${inner.replace(/\s+/g, '')}}`)
        .replace(/\s+/g, ' ')
        .trim()
    },
    root(hast) {
      const title = this.options.meta?.title
      if (typeof title !== 'string') {
        return
      }

      const [pre] = hast.children
      if (pre?.type !== 'element') {
        return
      }

      hast.children = [
        {
          type: 'element',
          tagName: 'figure',
          properties: { className: ['astro-code-figure'] },
          children: [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { className: ['astro-code-title'] },
              children: [{ type: 'text', value: title }],
            },
            pre,
          ],
        },
      ]
    },
  }
}
