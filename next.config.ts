import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.html": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8002/api/:path*",
      },
    ];
  },
};

export default nextConfig;
