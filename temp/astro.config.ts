import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkHeadingsOptions,
} from "rehype-autolink-headings";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions
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
    imageService: "passthrough",
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
            onVisitLine(node) {
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
            onVisitHighlightedLine(node) {
              node.properties.className ??= [];
              node.properties.className.push("line--highlighted");
            },
            onVisitHighlightedChars(node) {
              node.properties.className ??= [];
              node.properties.className.push("word--highlighted");
            },
          } satisfies RehypePrettyCodeOptions,
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          } satisfies RehypeAutolinkHeadingsOptions,
        ],
      ],
    }),
    sitemap({
      lastmod: new Date(),
    }),
    // Sentry server-side is disabled temporarily
    // due to https://github.com/getsentry/sentry-javascript/issues/9777
    sentry({
      dsn: SENTRY_DSN,
      autoInstrumentation: {
        // requestHandler: true,
        requestHandler: false,
      },
      sourceMapsUploadOptions: {
        org: "yagiz-nb",
        project: "yagiz-co",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      clientInitPath: "sentry/client.ts",
      // serverInitPath: "sentry/server.ts",
    }),
    spotlightjs(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
