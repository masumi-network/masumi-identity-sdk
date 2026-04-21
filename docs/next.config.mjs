import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Multiple lockfiles (e.g. a workspace-root package-lock.json in addition to this app's) make
  // Turbopack pick the wrong root and hang on "Compiling /[[...slug]]". Pin root to this app.
  turbopack: {
    root: __dirname,
  },
  output: 'standalone', // required for the Docker runner image
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['fumadocs-ui', 'lucide-react'],
  },
  compress: true,
  async headers() {
    return [
      // Next.js: if several rules match the same path and set the same header key, the
      // LAST one wins. Put the `/:path*` default first, then more specific paths so their
      // Cache-Control overrides no-store for static assets, API, and llms.txt.
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, s-maxage=900' },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' },
        ],
      },
    ];
  },
};

export default withMDX(config);
