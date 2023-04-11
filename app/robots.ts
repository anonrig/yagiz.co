import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*' }],
    sitemap: 'https://www.yagiz.co/sitemap.xml',
    host: 'https://www.yagiz.co',
  };
}
