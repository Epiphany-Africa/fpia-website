import type { NextConfig } from "next";

const adminOrigin =
  process.env.NEXT_PUBLIC_FPIA_ADMIN_ORIGIN ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://admin.fairproperties.org.za");

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lpgvjyxwouttbvpgivtu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${adminOrigin}/app`,
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: `${adminOrigin}/:path*`,
      },
    ];
  },
};

export default nextConfig;
