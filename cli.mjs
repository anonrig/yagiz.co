import { cancel, isCancel, select } from '@clack/prompts'

import { createBlog } from './.github/cli/create-blog.mjs'
import { sendEmail } from './.github/cli/send-email.mjs'

const intention = await select({
  message: 'What do you want to do?',
  options: [
    { label: 'Create a blog post', value: 'blog' },
    { label: 'Send an email', value: 'email' },
    { label: 'Update sponsorships', value: 'sponsorship' },
  ],
})

if (isCancel(intention)) {
  cancel('Operation cancelled')
  process.exit(0)
}

switch (intention) {
  case 'email':
    await sendEmail()
    break
  case 'blog':
    await createBlog()
    break
}
