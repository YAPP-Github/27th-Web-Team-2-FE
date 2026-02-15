import type { NextConfig } from 'next';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not defined. ' +
      'Set it in .env.development for local dev or in Vercel environment variables for deployment.',
  );
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ['@repo/shared'],
  async rewrites() {
    return [
      {
        source: '/proxy-api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
