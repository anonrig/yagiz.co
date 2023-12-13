import { getPosts } from "@/lib/content";
import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { BlogOG } from "@/components/BlogOG";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const WIDTH = 1200;
const HEIGHT = 600;

export const getStaticPaths = (async () => {
  const posts = await getPosts();

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async ({ props: { post }, url }) => {
  const svg = await satori(BlogOG({ post }), {
    fonts: [
      {
        name: "Mulish Variable",
        data: await fetch(`${url.origin}/fonts/mulish.ttf`).then((res) =>
          res.arrayBuffer()
        ),
        style: "normal",
      },
    ],
    height: HEIGHT,
    width: WIDTH,
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "content-type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
