import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
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
