import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=za`
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FPIA-PropertyInspectionPlatform/1.0 (contact@fairproperties.org.za)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Geocoding service error' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Geocoding request failed' }, { status: 502 })
  }
}
