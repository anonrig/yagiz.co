import fs from 'node:fs'
import mjml2html from 'mjml'
import Mailjet from 'node-mailjet'

import { cancel, confirm, group, select, spinner } from '@clack/prompts'
import { compareDesc } from 'date-fns'
import Handlebars from 'handlebars'
import { allBlogs } from '../../.contentlayer/generated/index.mjs'

const publishedBlogs = allBlogs
  .filter((b) => b.status === 'published')
  .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

const { pathname: templatePath } = new URL('../blog.mjml', import.meta.url)
const template = await fs.promises.readFile(templatePath, 'utf-8')

export async function sendEmail() {
  const { slug } = await group(
    {
      slug: () =>
        select({
          message: 'Which blog post do you want to write about?',
          options: publishedBlogs.map((blog) => ({
            label: blog.title,
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
          title: blog.title,
          description: blog.description,
          url: blog.url,
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
        Subject: `New post: ${blog.title}`,
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
