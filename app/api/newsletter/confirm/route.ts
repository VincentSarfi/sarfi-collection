import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const BASE_URL = 'https://www.sarfi-collection.de'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Muss identisch zu newsletterToken() in ../route.ts sein. */
function newsletterToken(email: string): string {
  const secret = process.env.NEWSLETTER_SECRET
  if (!secret) throw new Error('NEWSLETTER_SECRET is not set')
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
}

function tokensMatch(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = (searchParams.get('email') ?? '').trim().toLowerCase()
  const token = searchParams.get('token') ?? ''

  const redirect = (ok: boolean) =>
    NextResponse.redirect(`${BASE_URL}/newsletter-bestaetigt${ok ? '' : '?error=1'}`)

  if (!EMAIL_RE.test(email) || !token) return redirect(false)

  let expected: string
  try {
    expected = newsletterToken(email)
  } catch (e) {
    console.error('[newsletter/confirm] misconfiguration:', e)
    return redirect(false)
  }

  if (!tokensMatch(token, expected)) return redirect(false)

  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID
    if (audienceId) {
      await resend.contacts.create({ email, audienceId, unsubscribed: false })
    } else {
      // Kein Audience konfiguriert – Betreiber informieren, damit keine Anmeldung verloren geht
      await resend.emails.send({
        from: 'Website <buchung@sarfi-collection.de>',
        to: ['hallo@sarfi-collection.de'],
        subject: '📰 Neue Newsletter-Anmeldung (bestätigt)',
        html: `<p>Bestätigte Newsletter-Anmeldung: <strong>${email}</strong></p>`,
      })
    }
    return redirect(true)
  } catch (err) {
    console.error('[newsletter/confirm] Unexpected error:', err)
    return redirect(false)
  }
}
