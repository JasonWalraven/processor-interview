/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'app', 'lib', 'utils'],
  },
  // Next.js 15 specific configurations
  experimental: {
    optimizeCss: true,
    esmExternals: true,
  }
}

module.exports = nextConfig
