import { NextRequest, NextResponse } from 'next/server'

// Temporary debug endpoint – remove after fixing availability
// GET /api/smoobu/debug?propertyId=2610828
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId') ?? '2610828'
  const apiKey = process.env.SMOOBU_API_KEY ?? 'NOT SET'

  const today = new Date().toISOString().split('T')[0]
  const endDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]

  const url = `https://login.smoobu.com/api/apartments/${propertyId}/availability?startDate=${today}&endDate=${endDate}`

  let rawResponse: unknown = null
  let statusCode = 0
  let errorMsg = null

  try {
    const res = await fetch(url, {
      headers: {
        'Api-Key': process.env.SMOOBU_API_KEY ?? '',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    statusCode = res.status
    rawResponse = await res.json()
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err)
  }

  return NextResponse.json({
    apiKeySet: apiKey !== 'NOT SET',
    apiKeyLength: apiKey.length,
    propertyId,
    url,
    statusCode,
    rawResponse,
    error: errorMsg,
  })
}
