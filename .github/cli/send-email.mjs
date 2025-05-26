import fs from 'node:fs'
import path from 'node:path'
import mjml2html from 'mjml'
import Mailjet from 'node-mailjet'

import { cancel, confirm, group, select, spinner } from '@clack/prompts'
import { compareDesc } from 'date-fns'
import Handlebars from 'handlebars'
import { readSync } from 'to-vfile'
import { matter } from 'vfile-matter'

const blogPath = path.resolve('./src/content/blog')
const publishedBlogs = fs
  .readdirSync(blogPath)
  .map((file) => {
    const slug = path.basename(file, path.extname(file))
    const contents = readSync(path.join(blogPath, file))
    matter(contents)
    return { slug, data: contents.data.matter }
  })
  .filter((b) => b.data.status === 'published')
  .sort((a, b) => compareDesc(b.data.date, a.data.date))

const templatePath = path.resolve('./.github/blog.mjml')
const template = await fs.promises.readFile(templatePath, 'utf-8')

export async function sendEmail() {
  const { id } = await group(
    {
      id: () =>
        select({
          message: 'Which blog post do you want to write about?',
          options: publishedBlogs.map((blog) => ({
            label: blog.data.title,
            value: blog.id,
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

  const blog = publishedBlogs.find((b) => b.id === id)
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
          url: `https://www.yagiz.co/${blog.id}`,
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
        CustomCampaign: `blog-${blog.id}`,
      },
    ],
  })

  mailSpinner.stop('Email sent')

  if (body.Messages.at(0)?.Status !== 'success') {
    cancel(body)
    console.error(body)
  }
}
