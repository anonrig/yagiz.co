import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const linkedRoot = path.join(repoRoot, 'node_modules/@yagiz/astro-check')
const isolatedRoot = path.join(repoRoot, 'tools/astro-check')

function firstExisting(candidates) {
  return candidates.find((candidate) => existsSync(candidate))
}

function findPnpmCheckEntry() {
  const pnpmDir = path.join(repoRoot, 'node_modules/.pnpm')
  if (!existsSync(pnpmDir)) {
    return
  }
  const match = readdirSync(pnpmDir).find(
    (name) => name.startsWith('@astrojs+check@') && name.includes('typescript@6.'),
  )
  if (!match) {
    return
  }
  return path.join(pnpmDir, match, 'node_modules/@astrojs/check/bin/astro-check.js')
}

const entry = firstExisting(
  [
    path.join(linkedRoot, 'node_modules/@astrojs/check/bin/astro-check.js'),
    path.join(isolatedRoot, 'node_modules/@astrojs/check/bin/astro-check.js'),
    findPnpmCheckEntry(),
  ].filter(Boolean),
)

if (!entry) {
  console.error('Isolated astro-check (TypeScript 6) is not installed. Run pnpm install and retry.')
  process.exit(1)
}

const child = spawn(process.execPath, [entry, '--root', repoRoot, ...process.argv.slice(2)], {
  stdio: 'inherit',
})

child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})
