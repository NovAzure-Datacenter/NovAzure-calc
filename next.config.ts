import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Configure CSS handling to prevent entryCSSFiles errors
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Handle CSS modules and global CSS properly
    config.module.rules.forEach((rule: any) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((oneOfRule: any) => {
          if (oneOfRule.sideEffects === false) {
            oneOfRule.sideEffects = true;
          }
        });
      }
    });
    
    return config;
  },
  // Disable static generation for problematic routes
  async generateStaticParams() {
    return [];
  },
};

export default nextConfig;
