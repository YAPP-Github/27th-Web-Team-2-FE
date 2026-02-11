import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['@repo/shared'],
  async rewrites() {
    return [
      {
        source: '/proxy-api/:path*',
        destination:
          'http://sandbox-nomoney-alb-1771543847.ap-northeast-2.elb.amazonaws.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
