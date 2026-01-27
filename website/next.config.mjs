import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parentDist = path.resolve(__dirname, '..', 'dist');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Allow importing from parent project's dist/ directory
      config.resolve.alias['@eq/sources'] = path.join(parentDist, 'sources');
      config.resolve.alias['@eq/tools'] = path.join(parentDist, 'tools.js');
      config.resolve.alias['@eq/base'] = path.join(parentDist, 'sources', 'base.js');
    }
    return config;
  },
  outputFileTracingRoot: path.resolve(__dirname, '..'),
};

export default nextConfig;
