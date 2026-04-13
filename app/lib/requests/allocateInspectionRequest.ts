export type SupabaseLike = {
  from(table: string): {
    select(columns: string): {
      eq(column: string, value: unknown): Promise<{
        data: Record<string, unknown>[] | null
        error: { message: string } | null
      }>
    }
  }
}

export type AllocatedInspector = {
  id: string
  full_name: string
  inspector_code: string | null
  company_name: string | null
  auth_user_id: string | null
  phone: string | null
  distanceKm: number | null
  withinRadius: boolean
}

type GeocodedPoint = {
  latitude: number
  longitude: number
}

function toNumber(value: unknown) {
  return typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim().length > 0
    ? Number(value)
    : Number.NaN
}

function normalizeInspector(row: Record<string, unknown>) {
  const latitude = toNumber(row.service_latitude)
  const longitude = toNumber(row.service_longitude)
  const serviceRadiusKm = toNumber(row.service_radius_km)

  return {
    id: String(row.id ?? ''),
    full_name: typeof row.full_name === 'string' ? row.full_name : 'FPIA Inspector',
    inspector_code: typeof row.inspector_code === 'string' ? row.inspector_code : null,
    company_name: typeof row.company_name === 'string' ? row.company_name : null,
    auth_user_id: typeof row.auth_user_id === 'string' ? row.auth_user_id : null,
    phone: typeof row.phone === 'string' ? row.phone : null,
    is_active: row.is_active !== false,
    accepting_requests: row.accepting_requests !== false,
    service_latitude: Number.isFinite(latitude) ? latitude : null,
    service_longitude: Number.isFinite(longitude) ? longitude : null,
    service_radius_km: Number.isFinite(serviceRadiusKm) ? serviceRadiusKm : 20,
  }
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function calculateDistanceKm(a: GeocodedPoint, b: GeocodedPoint) {
  const earthRadiusKm = 6371
  const deltaLat = toRadians(b.latitude - a.latitude)
  const deltaLon = toRadians(b.longitude - a.longitude)
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

async function geocodeAddress(args: {
  propertyAddress: string
  suburb?: string | null
  city?: string | null
  province?: string | null
  postalCode?: string | null
}) {
  const query = [
    args.propertyAddress,
    args.suburb,
    args.city,
    args.province,
    args.postalCode,
    'South Africa',
  ]
    .filter(Boolean)
    .join(', ')

  if (!query) return null

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'jsonv2')
    url.searchParams.set('limit', '1')

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FPIA Dispatch/1.0 (ops@fairproperties.org.za)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const payload = (await response.json()) as Array<{ lat?: string; lon?: string }>
    const first = payload[0]
    const latitude = toNumber(first?.lat)
    const longitude = toNumber(first?.lon)

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null

    return { latitude, longitude } satisfies GeocodedPoint
  } catch {
    return null
  }
}

export async function allocateInspectionRequest(args: {
  supabase: SupabaseLike
  propertyAddress: string
  suburb?: string | null
  city?: string | null
  province?: string | null
  postalCode?: string | null
}) {
  const { data, error } = await args.supabase.from('inspectors').select('*').eq('is_active', true)

  if (error) {
    throw new Error(`Could not load inspectors: ${error.message}`)
  }

  const inspectors = (data ?? [])
    .map((row) => normalizeInspector(row))
    .filter((row) => row.id && row.is_active && row.accepting_requests)

  const geocodedPoint = await geocodeAddress(args)

  const rankedInspectors = inspectors
    .map((row) => {
      const hasCoordinates =
        row.service_latitude !== null && row.service_longitude !== null && geocodedPoint !== null

      const distanceKm = hasCoordinates
        ? calculateDistanceKm(geocodedPoint, {
            latitude: row.service_latitude as number,
            longitude: row.service_longitude as number,
          })
        : null

      const radiusKm = row.service_radius_km ?? 20

      return {
        ...row,
        distanceKm,
        withinRadius: distanceKm !== null ? distanceKm <= radiusKm : false,
      }
    })
    .sort((left, right) => {
      if (left.withinRadius !== right.withinRadius) {
        return left.withinRadius ? -1 : 1
      }

      if (left.distanceKm === null && right.distanceKm === null) return 0
      if (left.distanceKm === null) return 1
      if (right.distanceKm === null) return -1
      return left.distanceKm - right.distanceKm
    })

  const assignedInspector = rankedInspectors[0] ?? null
  const assignmentExpiresAt = assignedInspector
    ? new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
    : null

  return {
    lookupCoordinates: geocodedPoint,
    inspectorCount: inspectors.length,
    assignedInspector:
      assignedInspector &&
      ({
        id: assignedInspector.id,
        full_name: assignedInspector.full_name,
        inspector_code: assignedInspector.inspector_code,
        company_name: assignedInspector.company_name,
        auth_user_id: assignedInspector.auth_user_id,
        phone: assignedInspector.phone,
        distanceKm: assignedInspector.distanceKm,
        withinRadius: assignedInspector.withinRadius,
      } satisfies AllocatedInspector),
    allocationStatus: assignedInspector
      ? 'awaiting_inspector_acceptance'
      : 'pending_manual_assignment',
    assignmentExpiresAt,
  }
}
