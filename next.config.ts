import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/eths",
          destination: "/?gen=Ethscriptions",
        },
        {
          source: "/ethscriptions",
          destination: "/?gen=Ethscriptions",
        },
        {
          source: "/nfts",
          destination: "/?gen=og",
        },
        {
          source: "/nft",
          destination: "/?gen=og",
        },
        {
          source: "/og",
          destination: "/?gen=og",
        },
        {
          source: "/ordinals",
          destination: "/?gen=ordinals",
        },
      ],
    };
  },
};

export default nextConfig;
