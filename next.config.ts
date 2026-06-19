import type {NextConfig} from 'next';

const devOrigins = process.env.DEV_IPS ? process.env.DEV_IPS.split(',') : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  images: {
    qualities: [75, 80, 90, 100],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
