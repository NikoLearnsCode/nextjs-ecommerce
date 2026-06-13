import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
