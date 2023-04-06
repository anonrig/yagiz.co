const navigation_height = '80px'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-mulish)'],
      },
      fontSize: {
        'base': '1.1rem',
        'lg': '1.2rem',
        'xl': '1.4rem',
        '2xl': '1.7rem',
        '4xl': '2.3rem',
      },
      flex: {
        '2': '2'
      },
      height: {
        'navigation-bar': navigation_height,
        'mobile-overlay': `calc(100vh - ${navigation_height})`,
      },
      spacing: {
        'navigation-bar': navigation_height,
      },
      lineHeight: {
        'lg': '1.4',
        'xl': '1.6',
        '2xl': '1.8',
      },
      gridTemplateColumns: {
        'canvas': '[full-start] minmax(4vw,auto) [wide-start] minmax(auto,140px) [main-start] min(640px,calc(100% - 8vw)) [main-end] minmax(auto,140px) [wide-end] minmax(4vw,auto) [full-end]',
      },
      gridColumn: {
        'main': 'main-start/main-end',
        'wide': 'wide-start/wide-end'
      },
      transitionProperty: {
        'margin': 'margin',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
