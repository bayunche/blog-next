import type { NextConfig } from "next";

const resolveHostname = (rawUrl?: string): string | null => {
  if (!rawUrl) return null;
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
};

const imageBedHostname = resolveHostname(
  process.env.CHEVERETO_URL || process.env.NEXT_PUBLIC_IMAGE_BED_URL
);

const defaultRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: 'https', hostname: 'picsum.photos' },
  { protocol: 'https', hostname: 'api.dujin.org' },
  { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
  { protocol: 'https', hostname: 'docs.fuukei.org' },
  { protocol: 'https', hostname: 'kiseki.blog' },
  { protocol: 'https', hostname: '2heng.xin' },
];

const imageBedPatterns = imageBedHostname
  ? [
      { protocol: 'https' as const, hostname: imageBedHostname },
      { protocol: 'http' as const, hostname: imageBedHostname },
    ]
  : [];

const remotePatterns = [...defaultRemotePatterns, ...imageBedPatterns].filter(
  (item, index, arr) =>
    arr.findIndex((x) => x.hostname === item.hostname && x.protocol === item.protocol) === index
);

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Docker 部署需要
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:6060'}/:path*`, // Proxy to backend (strip /api)
      },
      {
        source: '/public/uploads/:path*',
        destination: `${process.env.API_URL || 'http://localhost:6060'}/public/uploads/:path*`,
      }
    ];
  },
  images: {
    remotePatterns,
  },
  // Ensure we can use standard CSS implementation if needed
};

export default nextConfig;
