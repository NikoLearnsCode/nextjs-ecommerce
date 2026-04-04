import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Next 16: endast värden i denna lista får användas som `quality` på <Image /> (default är [75]).
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
