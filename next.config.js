/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better performance on Vercel
  output: 'standalone',
  // Disable image optimization during development
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig
