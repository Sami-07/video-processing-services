/** @type {import('next').NextConfig} */
const nextConfig = {
  

  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: '**',
          },
      ],
  },
}

module.exports = nextConfig