import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, {
  type CharsElement,
  type LineElement,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import sentry from "@sentry/astro";
import { SENTRY_DSN } from "./constants";

import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://www.yagiz.co",
  output: "hybrid",
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: "one-dark-pro",
            keepBackground: false,
            onVisitLine(node: LineElement) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [
                  {
                    type: "text",
                    value: " ",
                  },
                ];
              }
            },
            onVisitHighlightedLine(node: LineElement) {
              node.properties.className ??= [];
              node.properties.className.push("line--highlighted");
            },
            onVisitHighlightedChars(node: CharsElement) {
              node.properties.className ??= [];
              node.properties.className.push("word--highlighted");
            },
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ],
    }),
    sitemap({
      lastmod: new Date(),
    }),
    sentry({
      dsn: SENTRY_DSN,
      autoInstrumentation: {
        requestHandler: true,
      },
      sourceMapsUploadOptions: {
        org: "yagiz-nb",
        project: "yagiz-co",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      clientInitPath: "sentry/client.ts",
      serverInitPath: "sentry/server.ts",
    }),
    spotlightjs(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
