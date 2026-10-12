import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next does not walk up into the home directory.
  turbopack: { root: __dirname },
  images: {
    // Placeholder editorial photography is served from Unsplash.
    // Swap `src/lib/assets.ts` entries for local `/assets/*` files and this
    // block can be removed entirely.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
