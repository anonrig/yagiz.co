import { defineHastPlugin } from 'satteri'
import type { HastPluginDefinition } from 'satteri'

/**
 * Sätteri equivalent of rehype-autolink-headings (`behavior: 'prepend'`).
 * Astro's heading-id plugin must run first so `id` is already on the node.
 */
export function autolinkHeadingsPlugin(): HastPluginDefinition {
  return defineHastPlugin({
    name: 'autolink-headings',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, ctx) {
        const { id } = node.properties
        if (typeof id !== 'string' || id.length === 0) {
          return
        }

        ctx.prependChild(node, {
          type: 'element',
          tagName: 'a',
          properties: {
            href: `#${id}`,
            className: ['anchor'],
            ariaLabel: 'Link to this heading',
          },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['icon', 'icon-link'],
              },
              children: [],
            },
          ],
        })
      },
    },
  })
}
