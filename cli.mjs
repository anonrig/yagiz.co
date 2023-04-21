import fs from 'node:fs'
import path from 'node:path'

import { cancel, group, intro, outro, select, spinner, text } from '@clack/prompts'
import { format } from 'date-fns'

import { allTags } from './.contentlayer/generated/index.mjs'

intro('create a new blog post')

const folder = new URL('./content/pages', import.meta.url).pathname

const {
  title,
  slug,
  description,
  tag,
  status,
} = await group({
  title: () => text({
    message: 'What is the title of your post?',
    hint: `Recommended length less than 60 characters.`,
    validate(value) {
      if (value.length === 0) {
        return 'Value is required'
      }
    }
  }),
  slug: () => text({
    message: 'Which slug do you want to use?',
    required: true,
    validate(value) {
      if (value.length === 0) {
        return 'Value is required'
      }

      const file = path.join(folder, `${value}.mdx`)
      if (fs.existsSync(file)) {
        return 'Slug is already used'
      }

      // only allow letters, numbers and hypens
      const re = new RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$', 'g')
      if (re.exec(value) === null) {
        return 'Slug should be all lowercase and contain only letters, numbers, and hyphens'
      }
    }
  }),
  description: () => text({
    message: 'What do you want as a description?',
    defaultValue: '',
    required: false,
  }),
  tag: () => select({
    message: 'Select a tag',
    required: true,
    options: allTags.map(tag => ({
      value: `tags/${tag.slug}.mdx`,
      label: tag.title,
    })),
  }),
  status: () => select({
    message: 'Select a status',
    required: true,
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
    ]
  })
}, {
  onCancel() {
    cancel('Operation cancelled')
    process.exit(0)
  }
})

const template = `
---
title: '${title}'
description: >-
  ${description}
type: Blog
date: '${format(new Date(), 'yyyy-MM-dd')}'
tag: ${tag}
status: ${status}
minute_to_read: 1
---
`

const creating = spinner()
creating.start('Creating the document')
const documentPath = path.join(folder, `${slug}.mdx`)
await fs.promises.writeFile(documentPath, template.trim(), 'utf-8')
creating.stop()

outro(`Blog post is created at ${documentPath}`)
