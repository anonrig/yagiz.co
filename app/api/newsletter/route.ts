import { NextResponse } from 'next/server'

const headers = {
  'content-type': 'application/json',
  authorization: `Basic ${btoa(
    `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`,
  )}`,
}

export const runtime = 'edge'

export async function POST(request: Request) {
  const body: {
    email?: string
    name?: string
  } = await request.json()

  if (!body.email?.length || !body.name?.length) {
    return NextResponse.json({
      status: 400,
      message: 'Input validation failed. Make sure you have an email and a full name',
    })
  }

  try {
    const contactResponse = await fetch('https://api.mailjet.com/v3/REST/contact', {
      headers,
      method: 'POST',
      body: JSON.stringify({
        IsExcludedFromCampaigns: 'true',
        Name: body.name,
        Email: body.email,
      }),
    })
    const contactJson = await contactResponse.json()
    if (contactJson.ErrorMessage) {
      throw new Error(contactJson.ErrorMessage)
    }
    const contactId = contactJson.Data.at(0)?.ID

    if (!contactId) {
      return NextResponse.json({
        status: 500,
        message: 'ContactID was missing from Mailjet API',
      })
    }

    const listResponse = await fetch('https://api.mailjet.com/v3/REST/listrecipient', {
      headers,
      method: 'POST',
      body: JSON.stringify({
        ContactID: contactId,
        ListID: process.env.MAILJET_CONTACT_LIST_ID ?? '',
      }),
    })
    const listJson = await listResponse.json()
    if (listJson.ErrorMessage) {
      throw new Error(listJson.ErrorMessage)
    }
  } catch (error: any) {
    console.error(error)
    const message = error.response?.statusText ?? error.message ?? ''
    return NextResponse.json({
      status: 400,
      message,
    })
  }

  return NextResponse.json({
    message: 'Added you to the newsletter. Thank you for signing up.',
    status: 200,
  })
}
