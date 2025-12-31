/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Vercel-specific optimizations
  experimental: {
    esmExternals: false,
  },
  
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Webpack configuration to fix build issues
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Fix for react-p5 and other dependencies that might cause build issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Handle audio files and other assets
    config.module.rules.push({
      test: /\.(wav|mp3|ogg)$/,
      type: 'asset/resource',
    });
    
    return config;
  },
  
  // Transpile problematic packages
  transpilePackages: ['react-p5'],
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Output configuration for static exports (if needed)
  trailingSlash: false,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;