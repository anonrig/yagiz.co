import type { APIRoute } from 'astro'

const headers = {
  'content-type': 'application/json',
  authorization: `Basic ${Buffer.from(
    `${import.meta.env.MAILJET_API_KEY}:${import.meta.env.MAILJET_SECRET_KEY}`,
    'base64',
  ).toString()}`,
}

const response = ({ status, message }: { status: number; message: string }) =>
  new Response(
    JSON.stringify({
      status,
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

export const POST: APIRoute = async ({ request }) => {
  const body: {
    email?: string
    name?: string
  } = await request.json()

  if (!body.email?.length || !body.name?.length) {
    return response({
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
      return response({
        status: 500,
        message: 'ContactID was missing from Mailjet API',
      })
    }

    const listResponse = await fetch('https://api.mailjet.com/v3/REST/listrecipient', {
      headers,
      method: 'POST',
      body: JSON.stringify({
        ContactID: contactId,
        ListID: import.meta.env.MAILJET_CONTACT_LIST_ID ?? '',
      }),
    })
    const listJson = await listResponse.json()
    if (listJson.ErrorMessage) {
      throw new Error(listJson.ErrorMessage)
    }
    // biome-ignore lint/suspicious/noExplicitAny: Unnecessary validation
  } catch (error: any) {
    console.error(error)
    const message = error.response?.statusText ?? error.message ?? ''
    return response({
      status: 400,
      message,
    })
  }

  return response({
    message: 'Added you to the newsletter. Thank you for signing up.',
    status: 200,
  })
}

export const prerender = false
