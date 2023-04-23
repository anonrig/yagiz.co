import { NextResponse } from 'next/server'
import Mailjet, { Contact, LibraryResponse } from 'node-mailjet';

// Replace this with `edge` when `node-mailjet` resolves axios related issues
export const runtime = 'nodejs'

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

  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY ?? '',
    apiSecret: process.env.MAILJET_SECRET_KEY ?? '',
  })

  try {
    const { response }: LibraryResponse<Contact.PostContactResponse> = await mailjet
      .post('contact', { version: 'v3' })
      .request({
        IsExcludedFromCampaigns: 'true',
        Name: body.name,
        Email: body.email,
      })

    const contactId = response.data.Data.at(0)?.ID

    if (!contactId) {
      return NextResponse.json({
        status: 500,
        message: 'ContactID was missing from Mailjet API',
      })
    }

    await mailjet
      .post('listrecipient', { version: 'v3' })
      .request({
        'ContactID': contactId,
        'ListID': process.env.MAILJET_CONTACT_LIST_ID ?? '',
      })
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
