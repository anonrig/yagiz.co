/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="../.astro/types.ts" />

declare module 'reading-time/lib/reading-time.js' {
  function readingTime(input: string): {
    text: string
  }
  // biome-ignore lint/correctness/noUndeclaredVariables: False positive
  export = readingTime
}
