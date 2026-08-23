const TITLE_RE = /title="([^"]*)"/

/**
 * Lift `title="…"` off the fence meta string (so `{1,3}` / `/word/` transformers
 * do not see it) and wrap the highlighted block in a titled figure.
 */
export function transformerMetaTitle() {
  return {
    name: 'meta-title',
    preprocess(_code: string, options: { meta?: { __raw?: string; title?: string } }) {
      const meta = options.meta
      const raw = meta?.__raw
      if (!meta || !raw) {
        return
      }

      const match = TITLE_RE.exec(raw)
      if (!match) {
        return
      }

      meta.title = match[1]
      meta.__raw = raw.replace(match[0], '').replace(/\s+/g, ' ').trim()
    },
    root(
      this: { options: { meta?: { title?: unknown } } },
      hast: { children: Array<{ type: string }> },
    ) {
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
