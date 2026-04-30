// lib/geocode.ts
// Proxies through /api/geocode so User-Agent can be set server-side (browsers forbid it)

export interface GeoResult {
  latitude: number
  longitude: number
  display_name: string
}

export async function geocodeAddress(
  streetNumber: string,
  streetName: string,
  suburb: string,
  city: string,
  province: string,
  postalCode: string
): Promise<GeoResult | null> {
  const query = `${streetNumber} ${streetName}, ${suburb}, ${city}, ${province}, ${postalCode}, South Africa`

  try {
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)

    if (!res.ok) return null

    const data = await res.json()
    if (!Array.isArray(data) || !data.length) return null

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      display_name: data[0].display_name,
    }
  } catch (err) {
    console.error('[Geocode] error:', err)
    return null
  }
}
