import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/proxy-api/', '/meet/'],
    },
    sitemap: 'https://moit.kr/sitemap.xml',
  };
}
