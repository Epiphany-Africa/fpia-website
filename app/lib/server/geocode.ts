export interface GeoResult {
  latitude: number
  longitude: number
  display_name: string
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const REQUEST_TIMEOUT_MS = 5000

function normalizeCoordinate(value: unknown) {
  if (typeof value !== 'string') return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function geocodeAddress(
  streetNumber: string,
  streetName: string,
  suburb: string,
  city: string,
  province: string,
  postalCode: string
): Promise<GeoResult | null> {
  const queryParts = [
    `${streetNumber} ${streetName}`.trim(),
    suburb.trim(),
    city.trim(),
    province.trim(),
    postalCode.trim(),
    'South Africa',
  ].filter(Boolean)

  if (queryParts.length === 0) {
    return null
  }

  const query = encodeURIComponent(queryParts.join(', '))
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(
      `${NOMINATIM_URL}?q=${query}&format=json&limit=1&countrycodes=za`,
      {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'FPIA-FairPropertiesInspectionAuthority/1.0 (contact@fairproperties.org.za)',
          Referer: 'https://www.fairproperties.org.za/',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as Array<{
      lat?: string
      lon?: string
      display_name?: string
    }>

    if (!Array.isArray(data) || data.length === 0) {
      return null
    }

    const latitude = normalizeCoordinate(data[0]?.lat)
    const longitude = normalizeCoordinate(data[0]?.lon)
    const displayName =
      typeof data[0]?.display_name === 'string' ? data[0].display_name : ''

    if (latitude === null || longitude === null) {
      return null
    }

    return {
      latitude,
      longitude,
      display_name: displayName,
    }
  } catch (error) {
    console.error('[Geocode] Nominatim error:', error)
    return null
  } finally {
    clearTimeout(timeout)
  }
}
