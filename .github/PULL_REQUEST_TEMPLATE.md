---
type: # feature | fix | dependency-upgrade | content | chore
intent:
app-source-changed: # true | false
constraints: # e.g. typescript@6, markdown-processor: unified
verify:
  - node --run lint
  - node --run build
preview:
---

## Summary

-

## Non-goals

-

## Test plan

- [ ] `node --run lint`
- [ ] `node --run build`
- [ ] If markdown / Worker / sitemap can change:
  - [ ] `GET /llms.txt` → `200 text/plain`
  - [ ] `GET /llms-full.txt` → `200 text/plain` (full post dump)
  - [ ] `GET /{page}.md` → YAML frontmatter + `X-Robots-Tag: noindex`
  - [ ] `Accept: text/markdown` on an HTML URL → `Content-Type: text/markdown` + `Vary: Accept`
  - [ ] HTML response has `Link: rel="alternate"; type="text/markdown"`
  - [ ] `Accept: application/pdf` → `406`
  - [ ] sitemap lists HTML only (no `.md` / `llms*.txt`)
