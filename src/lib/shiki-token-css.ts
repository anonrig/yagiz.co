const HEX_RE = /#([0-9a-f]{3,8})\b/gi

export function collectThemeHex(theme: unknown): string[] {
  const found = new Set<string>()

  const walk = (value: unknown): void => {
    if (typeof value === 'string') {
      for (const match of value.matchAll(HEX_RE)) {
        found.add(match[1].toLowerCase())
      }
      return
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item)
      return
    }
    if (value && typeof value === 'object') {
      for (const item of Object.values(value)) walk(item)
    }
  }

  walk(theme)
  return [...found].sort()
}

export function shikiTokenCss(theme: unknown): string {
  return collectThemeHex(theme)
    .flatMap((hex) => [
      `pre .s-${hex} { color: #${hex}; }`,
      `pre .sb-${hex} { background-color: #${hex}; }`,
    ])
    .join('\n')
}
