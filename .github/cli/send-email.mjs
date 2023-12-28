import fs from 'node:fs'
import path from 'node:path'
import mjml2html from 'mjml'
import Mailjet from 'node-mailjet'

import { cancel, confirm, group, select, spinner } from '@clack/prompts'
import Handlebars from 'handlebars'
import { read } from 'to-vfile'
import { matter } from 'vfile-matter'

const allBlogs = await (async () => {
  const dir = path.resolve('./src/content/blog')
  const filenames = fs.readdirSync(dir)
  return Promise.all(
    filenames.map(async (f) => {
      const slug = path.basename(f, path.extname(f))
      const file = await read(path.join(dir, f))
      matter(file)

      return { slug, data: file.data.matter }
    }),
  )
})()

const publishedBlogs = allBlogs
  .filter((b) => b.data.status === 'published')
  .sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date))

const templatePath = path.resolve('./.github/blog.mjml')
const template = await fs.promises.readFile(templatePath, 'utf-8')

export async function sendEmail() {
  const { slug } = await group(
    {
      slug: () =>
        select({
          message: 'Which blog post do you want to write about?',
          options: publishedBlogs.map((blog) => ({
            label: blog.data.title,
            value: blog.slug,
          })),
        }),
    },
    {
      onCancel() {
        cancel('Operation cancelled')
        process.exit(0)
      },
    },
  )

  const blog = allBlogs.find((b) => b.slug === slug)
  const { errors, html } = mjml2html(template, {
    validationLevel: 'strict',
    preprocessors: [
      (raw) => {
        const handle = Handlebars.compile(raw)
        return handle({
          heading: 'Engineering with Yagiz',
          imageUrl: 'https://www.yagiz.co/family.png',
          title: blog.data.title,
          description: blog.data.description,
          url: `https://www.yagiz.co/${blog.slug}`,
        })
      },
    ],
  })

  if (errors.length > 0) {
    cancel(errors.at(0).message)
    console.error(errors)
    process.exit(0)
  }

  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY ?? '',
    apiSecret: process.env.MAILJET_SECRET_KEY ?? '',
  })

  const { body: listBody } = await mailjet
    .get('contactslist', { version: 'v3' })
    .id(process.env.MAILJET_CONTACT_LIST_ID ?? '')
    .request()

  /** @type {import('node-mailjet').ContactList} */
  const list = listBody.Data.at(0)

  if (!list) {
    cancel('List is missing from Mailjet API response')
    process.exit(0)
  }

  const listEmail = `${list.Address}@lists.mailjet.com`
  const shouldContinue = await confirm({
    message: `You are going to send this email to ${list.SubscriberCount} people. Are you sure?`,
  })

  if (!shouldContinue) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  const mailSpinner = spinner()
  mailSpinner.start('Sending email through Mailjet')

  // @see https://dev.mailjet.com/email/reference/send-emails#v3_1_post_send
  const { body } = await mailjet.post('send', { version: 'v3.1' }).request({
    SandboxMode: false,
    AdvanceErrorHandling: true,
    Messages: [
      {
        From: {
          Email: 'newsletter@yagiz.co',
          Name: 'Engineering with Yagiz',
        },
        To: [
          {
            Email: listEmail,
          },
        ],
        Bcc: [
          {
            Email: 'yagiz@nizipli.com',
            Name: 'Yagiz Nizipli',
          },
        ],
        Subject: `New post: ${blog.data.title}`,
        HTMLPart: html,
        TrackOpens: 'enabled',
        TrackClicks: 'enabled',
        CustomCampaign: `blog-${blog.slug}`,
      },
    ],
  })

  mailSpinner.stop('Email sent')

  if (body.Messages.at(0)?.Status !== 'success') {
    cancel(body)
    console.error(body)
  }
}
