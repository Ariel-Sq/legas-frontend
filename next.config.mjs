/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Serve the smallest workable format; AVIF is usually ~20-30% lighter
    // than WebP. The optimizer caches the result at the edge.
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 31 days (Next's default is 60s, which made
    // repeat views re-optimize and feel slow).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
      },
      {
        protocol: 'https',
        hostname: 'legas-api.vercel.app',
      },
      {
        // Vercel Blob CDN — product images are served straight from here.
        protocol: 'https',
        hostname: 'vuc1kji60ug9rvd6.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Baseline security headers. A full CSP is intentionally omitted for now:
  // the MercadoPago SDK loads from its CDN and there are inline bootstrap
  // scripts (theme/palette), so a correct CSP needs nonces — deferred. These
  // are the zero-risk wins: block framing (clickjacking), stop MIME sniffing,
  // and don't leak full URLs as referrer to third parties.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
