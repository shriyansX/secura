import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Handle missing Clerk environment variables during build
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  },
};

export default nextConfig;
