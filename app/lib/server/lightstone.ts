export type LightstoneLookupResult = {
  status: 'not_configured'
  provider: 'lightstone'
  message: string
}

export async function lookupLightstoneProperty(): Promise<LightstoneLookupResult> {
  return {
    status: 'not_configured',
    provider: 'lightstone',
    message:
      'Lightstone enrichment is not configured. No external Lightstone API request was made.',
  }
}
