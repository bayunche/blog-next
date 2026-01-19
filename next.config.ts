import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Docker 部署需要
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:6060/:path*', // Proxy to backend (strip /api)
      },
      {
        source: '/public/uploads/:path*',
        destination: 'http://localhost:6060/public/uploads/:path*',
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'api.dujin.org' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'docs.fuukei.org' },
      { protocol: 'https', hostname: 'kiseki.blog' },
      { protocol: 'https', hostname: '2heng.xin' },
    ],
  },
  // Ensure we can use standard CSS implementation if needed
};

export default nextConfig;
