import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [75, 85, 90],
    formats: ['image/webp'],
    // PDF exports are 1600px wide: larger candidates only upscale the same pixels.
    deviceSizes: [384, 640, 768, 1024, 1280, 1600],
    imageSizes: [96, 160, 256, 320],
  },
};
export default config;
