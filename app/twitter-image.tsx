import type { NextConfig } from 'next'

import og from './opengraph-image'
export const config: NextConfig = { runtime: 'edge' }
export const size = { width: 1920, height: 1080 }
export const contentType = 'image/png'
export default og
