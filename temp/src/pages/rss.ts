import { getPosts } from "@/lib/content";
import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { extname } from "node:path";

export const GET: APIRoute = async ({ site, url }) => {
  const posts = await getPosts();

  return rss({
    title: "Engineering with Yagiz",
    description:
      "Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.",
    site: site as URL,
    customData: `
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<generator>Astro</generator>
<language>en-us</language>
<copyright>Yagiz Nizipli - yagiz.co</copyright>
`,
    items: posts.map((post) => ({
      title: post.data.title,
      customData: `
<guid>${`/${post.slug}`}</guid>
`,
      link: `/${post.slug}`,
      description: post.data.description,
      pubDate: post.data.date,
      enclosure: {
        // TODO: can't set length to 0
        length: 1,
        type: post.data.feature_image
          ? `image/${extname(post.data.feature_image).slice(1)}`
          : "image//using-insecure-npm-defaults/opengraph-image",
        url: `${url.origin}${
          post.data.feature_image ?? `/${post.slug}/opengraph-image`
        }`,
      },
    })),
  });
};
