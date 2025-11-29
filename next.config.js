/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  compiler: {
    // Fallback options if SWC has issues
  },
  env: {
    NEXT_PUBLIC_USER_SERVICE_URL: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_ROUTE_SERVICE_URL: process.env.NEXT_PUBLIC_ROUTE_SERVICE_URL || 'http://localhost:4000',
    NEXT_PUBLIC_TICKETING_SERVICE_URL: process.env.NEXT_PUBLIC_TICKETING_SERVICE_URL || 'http://localhost:3002',
    NEXT_PUBLIC_PAYMENT_SERVICE_URL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:3004',
    NEXT_PUBLIC_WALLET_SERVICE_URL: process.env.NEXT_PUBLIC_WALLET_SERVICE_URL || 'http://localhost:3003',
    NEXT_PUBLIC_TRACKING_SERVICE_URL: process.env.NEXT_PUBLIC_TRACKING_SERVICE_URL || 'http://localhost:50051',
  },
};

module.exports = nextConfig;

