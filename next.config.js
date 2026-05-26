/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  httpAgentOptions: {
    keepAlive: true
  }
};

module.exports = nextConfig;
