import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 180, // Allow up to 3 min for Apps Script response
};

export default nextConfig;
