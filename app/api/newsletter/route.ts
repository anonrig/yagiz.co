import type { NextConfig } from "next"
import { NextResponse } from "next/server"
import { z } from 'zod'

const errorMessage = 'There was an error subscribing to the newsletter. React out to me from the contact form and I\'ll add you to the list.'
const schema = z.object({
  email: z.string().email(),
  name: z.string(),
})

export const config: NextConfig = { runtime: 'edge' }

export async function POST(request: Request) {
  const { MAILCHIMP_API_SERVER, MAILCHIMP_AUDIENCE_ID, MAILCHIMP_API_KEY } = process.env
  const body = await request.json()
  const validation = schema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({
      status: 400,
      message: 'Input validation failed. Make sure you have an email and a full name',
    })
  }

  const { email, name } = validation.data

  try {
    const response = await fetch(
      `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'authorization': `api_key ${MAILCHIMP_API_KEY}`
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: name,
          },
        })
      }
    )

    if (response.status >= 400) {
      const json = await response.json()
      return NextResponse.json({
        status: 400,
        message: json.title,
      })
    }
  } catch (error) {
    let cause
    if (error instanceof Error) {
      cause = error.message
    }
    return NextResponse.json({
      status: 400,
      message: errorMessage,
      cause,
    })
  }

  return NextResponse.json({
    message: 'Added you to the newsletter. Thank you for signing up.',
    status: 200,
  })
}
