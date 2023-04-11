import type { MetadataRoute } from "next";

import { websiteDomain } from "@/app/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*' }],
    sitemap: `${websiteDomain}/sitemap.xml`,
    host: websiteDomain,
  };
}
