/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    rewrites: async () => {
        return [
          {
            source: '/api/:path*',
            destination:'http://127.0.0.1:5000/:path*',
          },
        ]
      },
}

module.exports = nextConfig
