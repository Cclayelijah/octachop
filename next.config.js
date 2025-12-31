/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minification - might be causing class transpilation issues
  
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
    
    // Skip parsing problematic modules during server-side build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('react-p5');
    }
    
    // More aggressive handling of react-p5 to prevent class transpilation issues
    config.module.rules.push({
      test: /node_modules\/react-p5/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { 
              targets: { browsers: ['> 1%'] },
              modules: false
            }],
          ],
        },
      },
    });
    
    return config;
  },
  
  // Image optimization
  images: {
    domains: [],
    unoptimized: false,
  },
  
  // Output configuration for static exports (if needed)
  trailingSlash: false,
};

module.exports = nextConfig;