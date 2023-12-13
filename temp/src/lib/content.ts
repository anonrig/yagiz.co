import { getCollection, getEntry } from "astro:content";
import readingTime from "reading-time";
import { compareDesc } from "date-fns";

export const githubImage = "https:/github.com/anonrig.png";
export const twitterUrl = "https://twitter.com/yagiznizipli";
export const rssUrl =
  "https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fwww.yagiz.co%2Frss%2F";

export const getPosts = async () => {
  const posts = (
    await Promise.all(
      (
        await getCollection("blog")
      )
        .filter((post) => post.data.status === "published")
        .map(async (post) => {
          return {
            ...post,
            data: {
              ...post.data,
              tag: await getEntry(post.data.tag),
              url: `/${post.slug}`,
              structuredData: ({ origin }: { origin: string }) => ({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: post.data.title,
                datePublished: post.data.date,
                dateModified: post.data.date,
                description: post.data.description,
                url: `${origin}/${post.slug}`,
                author: {
                  "@type": "Person",
                  name: "Yagiz Nizipli",
                },
              }),
              minute_to_read: readingTime(post.body).text,
            },
          };
        })
    )
  ).sort((a, b) => compareDesc(a.data.date, b.data.date));

  return posts;
};

export const getTags = async () => {
  const tags = (await getCollection("tags"))
    .map((tag) => {
      return {
        ...tag,
        data: {
          ...tag.data,
          url: `/tag/${tag.slug}`,
        },
      };
    })
    .sort((a, b) => a.data.title.localeCompare(b.data.title));

  return tags;
};

export const getPages = async () => {
  const pages = await getCollection("pages");

  return pages.map((page) => {
    return {
      ...page,
      data: {
        ...page.data,
        url: `/tag/${page.slug}`,
      },
    };
  });
};
