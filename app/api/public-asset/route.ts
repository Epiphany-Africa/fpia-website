import { NextResponse } from 'next/server'

const ALLOWED_REMOTE_HOSTS = new Set(['lpgvjyxwouttbvpgivtu.supabase.co'])

function getRequestedAssetUrl(src: string, requestUrl: string) {
  if (!src) return null

  if (src.startsWith('/')) {
    return new URL(src, requestUrl)
  }

  try {
    return new URL(src)
  } catch {
    return null
  }
}

function isAllowedAssetUrl(url: URL, requestUrl: string) {
  const requestOrigin = new URL(requestUrl).origin

  if (url.origin === requestOrigin) {
    return true
  }

  if (url.protocol !== 'https:') {
    return false
  }

  if (!ALLOWED_REMOTE_HOSTS.has(url.hostname)) {
    return false
  }

  return url.pathname.startsWith('/storage/v1/object/public/')
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const src = requestUrl.searchParams.get('src')?.trim() ?? ''
  const assetUrl = getRequestedAssetUrl(src, request.url)

  if (!assetUrl || !isAllowedAssetUrl(assetUrl, request.url)) {
    return NextResponse.json({ error: 'Unsupported asset URL.' }, { status: 400 })
  }

  try {
    const upstream = await fetch(assetUrl, {
      headers: {
        Accept: 'image/*,*/*;q=0.8',
      },
      cache: 'force-cache',
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Asset could not be loaded.' }, { status: 404 })
    }

    const contentType =
      upstream.headers.get('content-type') ?? 'application/octet-stream'

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Asset fetch failed.' }, { status: 502 })
  }
}
