import "server-only";

const PRODUCTION_PUBLIC_ORIGIN = "https://www.fairproperties.org.za";
const DEVELOPMENT_PUBLIC_ORIGIN = "http://localhost:3001";

function normalizeOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.origin;
  } catch {
    return null;
  }
}

export function getPublicSiteOrigin() {
  const explicitOrigin =
    normalizeOrigin(process.env.NEXT_PUBLIC_FPIA_PUBLIC_ORIGIN) ??
    normalizeOrigin(process.env.FPIA_PUBLIC_ORIGIN);

  if (explicitOrigin) {
    return explicitOrigin;
  }

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_PUBLIC_ORIGIN;
  }

  const previewOrigin = normalizeOrigin(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  );

  if (previewOrigin) {
    return previewOrigin;
  }

  if (process.env.NODE_ENV === "development") {
    return DEVELOPMENT_PUBLIC_ORIGIN;
  }

  return PRODUCTION_PUBLIC_ORIGIN;
}

export function buildPublicSiteUrl(pathname: string) {
  return new URL(pathname, getPublicSiteOrigin()).toString();
}
