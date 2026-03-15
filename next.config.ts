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

const collectConfiguredUrls = (...rawValues: Array<string | undefined>): string[] =>
  rawValues
    .flatMap((value) => String(value || "").split(/[,\s]+/))
    .map((value) => value.trim())
    .filter(Boolean);

const imageBedHostnames = Array.from(
  new Set(
    collectConfiguredUrls(
      process.env.IMAGE_BED_PUBLIC_URL,
      process.env.NEXT_PUBLIC_IMAGE_BED_URL,
      process.env.PICUI_PUBLIC_URL,
      process.env.CHEVERETO_URL,
      process.env.IMAGE_BED_TYPE === "picui" ? "https://free.picui.cn" : undefined,
    )
      .map((value) => resolveHostname(value))
      .filter((value): value is string => Boolean(value))
  )
);

const defaultRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: 'https', hostname: 'picsum.photos' },
  { protocol: 'https', hostname: 'api.dujin.org' },
  { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
  { protocol: 'https', hostname: 'docs.fuukei.org' },
  { protocol: 'https', hostname: 'kiseki.blog' },
  { protocol: 'https', hostname: '2heng.xin' },
];

const imageBedPatterns = imageBedHostnames.flatMap((hostname) => [
  { protocol: 'https' as const, hostname },
  { protocol: 'http' as const, hostname },
]);

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
