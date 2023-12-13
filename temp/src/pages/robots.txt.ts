import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  return new Response(
    `User-Agent: *

Host: ${site?.origin}
Sitemap: ${site?.origin}/sitemap-index.xml`,
    { status: 200 }
  );
};
