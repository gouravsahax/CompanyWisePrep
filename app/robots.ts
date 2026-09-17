import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile', '/analytics', '/api/'],
    },
    sitemap: 'https://companywiseprep.online/sitemap.xml',
  }
}
