/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/ollama/:path*',
        destination: 'http://localhost:11434/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig 