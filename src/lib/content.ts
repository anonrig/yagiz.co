export const githubImage = 'https://github.com/anonrig.png'
export const githubUrl = 'https://github.com/anonrig'
export const twitterId = '1589638196'
export const twitterUsername = 'yagiznizipli'
export const xUrl = `https://x.com/${twitterUsername}`
export const blueskyUrl = 'https://bsky.app/profile/yagiznizipli.com'
export const profileUrls = [githubUrl, xUrl, blueskyUrl] as const
export const rssUrl = 'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fwww.yagiz.co%2Frss%2F'
export const websiteTitle = `Yagiz Nizipli's blog`
export const homepageTitle = 'Yagiz Nizipli - Node.js performance and URL parsing'
export const websiteDescription =
  'Writing about software performance, Node.js, and URL parsing. Yagiz Nizipli is a V8 committer and a Node.js Technical Steering Committee member.'
// Keep in sync with the description in src/content/pages/about.mdx.
export const authorDescription =
  'Yagiz Nizipli is a V8 committer and Node.js Technical Steering Committee member. He writes about software performance, URL parsing, and Node.js internals.'
export const websiteUrl = 'https://www.yagiz.co'
export const authorFullName = 'Yagiz Nizipli'
// Baked into public/opengraph-image.png. Regenerate that file when this changes.
export const authorJobTitle = 'Principal Engineer'
// public/opengraph-image.png — measured, not the article-card size.
export const openGraphImage = {
  width: 1920,
  height: 1080,
}
export const logoImage = {
  width: 180,
  height: 180,
}
// github.com/anonrig.png redirects to a 460×460 JPEG.
export const githubAvatar = {
  width: 460,
  height: 460,
  encodingFormat: 'image/jpeg',
}

export const articleWideImage = {
  name: '16x9',
  file: 'opengraph-16x9.png',
  width: 1200,
  height: 675,
} as const

export const articleFourThreeImage = {
  name: '4x3',
  file: 'opengraph-4x3.png',
  width: 1200,
  height: 900,
} as const

export const articleSquareImage = {
  name: '1x1',
  file: 'opengraph-1x1.png',
  width: 1200,
  height: 1200,
} as const

export const articleSocialImage = {
  name: 'image',
  file: 'opengraph-image.png',
  width: 1200,
  height: 600,
} as const

/** Aspect ratios Google recommends for Article images, plus the 2:1 social card. */
export const articleOpenGraphImages = [
  articleWideImage,
  articleFourThreeImage,
  articleSquareImage,
  articleSocialImage,
] as const
