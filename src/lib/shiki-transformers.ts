import type { ShikiTransformer } from '@shikijs/types'

const TITLE_RE = /title="([^"]*)"/

type HastProps = {
  properties?: {
    style?: unknown
    class?: unknown
    className?: unknown
  }
}

function classList(properties: HastProps['properties']): string[] {
  const values = [properties?.className, properties?.class]
  const tokens: string[] = []
  for (const value of values) {
    if (Array.isArray(value)) {
      tokens.push(...value.map(String))
    } else if (typeof value === 'string' && value.length > 0) {
      tokens.push(...value.split(/\s+/))
    }
  }
  return [...new Set(tokens.filter(Boolean))]
}

function hexClass(prefix: string, value: string): string | undefined {
  const hex = value.trim().match(/^#([0-9a-f]{3,8})$/i)
  return hex ? `${prefix}-${hex[1].toLowerCase()}` : undefined
}

function isBoldWeight(value: string): boolean {
  const weight = value.toLowerCase()
  if (weight === 'bold' || weight === 'bolder') {
    return true
  }
  const numeric = Number(weight)
  return Number.isFinite(numeric) && numeric >= 600
}

export function transformerEmptyLine(): ShikiTransformer {
  return {
    name: 'empty-line',
    line(node) {
      if (node.children.length === 0) {
        node.children.push({ type: 'text', value: ' ' })
      }
    },
  }
}

export function transformerInlineStylesToClasses(): ShikiTransformer {
  return {
    name: 'inline-styles-to-classes',
    pre(node) {
      consumeInlineStyles(node)
      if (node.properties) {
        const classes = classList(node.properties)
        if (!classes.includes('astro-code')) {
          classes.unshift('astro-code')
        }
        if (!classes.includes('not-prose')) {
          classes.push('not-prose')
        }
        node.properties.className = classes
      }
    },
    span(node) {
      consumeInlineStyles(node)
    },
  }
}

function consumeInlineStyles(node: HastProps): void {
  const style = node.properties?.style
  if (typeof style !== 'string') {
    return
  }

  const extra: string[] = []
  for (const decl of style.split(';')) {
    const sep = decl.indexOf(':')
    if (sep === -1) {
      continue
    }
    const prop = decl.slice(0, sep).trim().toLowerCase()
    const value = decl.slice(sep + 1).trim()
    if (prop === 'color') {
      const token = hexClass('s', value)
      if (token) extra.push(token)
    } else if (prop === 'background-color') {
      const token = hexClass('sb', value)
      if (token) extra.push(token)
    } else if (prop === 'font-style' && value === 'italic') {
      extra.push('s-italic')
    } else if (prop === 'font-weight' && isBoldWeight(value)) {
      extra.push('s-bold')
    } else if (prop === 'overflow-x') {
      extra.push('s-overflow-x')
    }
  }

  if (node.properties) {
    node.properties.className = [...classList(node.properties), ...extra]
    delete node.properties.style
  }
}

function svgIcon(
  className: string,
  children: Array<{
    type: 'element'
    tagName: string
    properties: Record<string, string>
    children: []
  }>,
) {
  return {
    type: 'element' as const,
    tagName: 'svg',
    properties: {
      className: [className],
      xmlns: 'http://www.w3.org/2000/svg',
      width: '14',
      height: '14',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    },
    children,
  }
}

function copyButton() {
  return {
    type: 'element' as const,
    tagName: 'button',
    properties: {
      type: 'button',
      className: ['astro-code-copy'],
      'aria-label': 'Copy code',
      title: 'Copy code',
    },
    children: [
      svgIcon('astro-code-copy-icon', [
        {
          type: 'element',
          tagName: 'rect',
          properties: { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' },
          children: [],
        },
        {
          type: 'element',
          tagName: 'path',
          properties: {
            d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
          },
          children: [],
        },
      ]),
      svgIcon('astro-code-copy-check', [
        {
          type: 'element',
          tagName: 'path',
          properties: { d: 'M20 6 9 17l-5-5' },
          children: [],
        },
      ]),
    ],
  }
}

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
          properties: { className: ['astro-code-figure', 'not-prose'] },
          children: [
            {
              type: 'element',
              tagName: 'figcaption',
              properties: { className: ['astro-code-title'] },
              children: [
                {
                  type: 'element',
                  tagName: 'span',
                  properties: { className: ['astro-code-title-label'] },
                  children: [{ type: 'text', value: title }],
                },
                copyButton(),
              ],
            },
            pre,
          ],
        },
      ]
    },
  }
}
