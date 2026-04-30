// lib/lightstone.ts
// Lightstone / Standard Insurance Home Valuator integration
// Status: MOCK — add LIGHTSTONE_API_KEY to .env.local when received from SIL

export interface LightstoneProperty {
  latitude: number
  longitude: number
  estimated_value: number | null
  erf_size_sqm: number | null
  build_year: number | null
  property_type: string | null
  last_sale_price: number | null
  last_sale_date: string | null
}

const LIGHTSTONE_API_KEY = process.env.LIGHTSTONE_API_KEY ?? ''
const LIGHTSTONE_BASE_URL = process.env.LIGHTSTONE_BASE_URL ?? 'https://api.lightstone.co.za/v1'

export async function getPropertyData(
  address: string,
  suburb: string,
  postalCode: string
): Promise<LightstoneProperty | null> {

  // MOCK MODE — remove this block once API key is received from SIL
  if (!LIGHTSTONE_API_KEY) {
    console.warn('[Lightstone] No API key — returning mock data')
    return {
      latitude: -25.7479,
      longitude: 28.2293,
      estimated_value: 1850000,
      erf_size_sqm: 650,
      build_year: 2003,
      property_type: 'Residential',
      last_sale_price: 1620000,
      last_sale_date: '2021-08-14',
    }
  }
  // END MOCK

  try {
    const res = await fetch(`${LIGHTSTONE_BASE_URL}/property/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LIGHTSTONE_API_KEY}`,
      },
      body: JSON.stringify({ address, suburb, postal_code: postalCode }),
    })

    if (!res.ok) return null
    const data = await res.json()

    return {
      latitude: data.gps?.lat ?? null,
      longitude: data.gps?.lng ?? null,
      estimated_value: data.valuation?.estimated_value ?? null,
      erf_size_sqm: data.property?.erf_size ?? null,
      build_year: data.property?.build_year ?? null,
      property_type: data.property?.type ?? null,
      last_sale_price: data.sales_history?.[0]?.price ?? null,
      last_sale_date: data.sales_history?.[0]?.date ?? null,
    }
  } catch (err) {
    console.error('[Lightstone] API error:', err)
    return null
  }
}
