const navigation_height = '80px'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        'white-reversed': '#282c35',
      },
      fontFamily: {
        sans: ['var(--font-mulish)'],
      },
      flex: {
        2: '2',
      },
      height: {
        'navigation-bar': navigation_height,
        'mobile-overlay': `calc(100vh - ${navigation_height})`,
      },
      spacing: {
        'navigation-bar': navigation_height,
      },
      gridTemplateColumns: {
        canvas:
          '[full-start] minmax(4vw,auto) [wide-start] minmax(auto,140px) [main-start] min(640px,calc(100% - 8vw)) [main-end] minmax(auto,140px) [wide-end] minmax(4vw,auto) [full-end]',
      },
      gridColumn: {
        main: 'main-start/main-end',
        wide: 'wide-start/wide-end',
      },
      transitionProperty: {
        margin: 'margin',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('@tailwindcss/typography')],
}
