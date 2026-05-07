import type { Handler } from '@netlify/functions'

export const handler: Handler = async () => {
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json', {
      headers: { accept: 'application/json' },
    })

    if (!ipRes.ok) {
      return {
        statusCode: 502,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ok: false,
          error: `Failed to resolve egress IP (ipify ${ipRes.status})`,
        }),
      }
    }

    const ip = (await ipRes.json()) as { ip?: string }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        ip: ip.ip ?? null,
        note: 'Call this multiple times; Netlify egress may rotate.',
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      }),
    }
  }
}

