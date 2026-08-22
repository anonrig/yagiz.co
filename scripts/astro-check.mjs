import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgsAsCheckConfig } from '@astrojs/check'

const args = parseArgsAsCheckConfig(process.argv.slice(2))
const workspaceRoot = path.resolve(args.root ?? process.cwd())
const require = createRequire(import.meta.url)
const typescriptPath = require.resolve('typescript6')
const requireFromCheck = createRequire(require.resolve('@astrojs/check'))
const { AstroCheck } = await import(
  pathToFileURL(requireFromCheck.resolve('@astrojs/language-server')).href
)

console.info(`Getting diagnostics for Astro files in ${workspaceRoot}...`)

const checker = new AstroCheck(workspaceRoot, typescriptPath, args.tsconfig)
const minimumSeverity = args.minimumSeverity || 'hint'
const result = await checker.lint({
  logErrors: {
    level: minimumSeverity,
  },
})

const parts = [`Result (${result.fileChecked} file${result.fileChecked === 1 ? '' : 's'}):`]
if (['error', 'warning', 'hint'].includes(minimumSeverity)) {
  parts.push(`${result.errors} ${result.errors === 1 ? 'error' : 'errors'}`)
}
if (['warning', 'hint'].includes(minimumSeverity)) {
  parts.push(`${result.warnings} ${result.warnings === 1 ? 'warning' : 'warnings'}`)
}
if (minimumSeverity === 'hint') {
  parts.push(`${result.hints} ${result.hints === 1 ? 'hint' : 'hints'}`)
}
console.info(parts.join('\n- '))

const failed =
  args.minimumFailingSeverity === 'hint'
    ? result.errors + result.warnings + result.hints > 0
    : args.minimumFailingSeverity === 'warning'
      ? result.errors + result.warnings > 0
      : result.errors > 0

process.exit(failed ? 1 : 0)
