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
      // Specific sources first — Next applies the first matching rule; a leading `/:path*`
      // catch-all would otherwise force no-store on everything below.
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
      {
        // Dynamic HTML — don't let any CDN cache streamed HTML (ISR handles freshness itself).
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default withMDX(config);
