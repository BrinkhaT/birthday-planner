/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Make BasicAuth environment variables available in Edge Middleware
  env: {
    ENABLE_BASICAUTH: process.env.ENABLE_BASICAUTH,
    BASICAUTH_USERNAME: process.env.BASICAUTH_USERNAME,
    BASICAUTH_PASSWORD: process.env.BASICAUTH_PASSWORD,
  },
};

module.exports = nextConfig;
