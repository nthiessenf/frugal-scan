import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://frugalscan.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/results', '/pro/success'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
