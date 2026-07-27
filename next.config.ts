import path from "node:path";
import { fileURLToPath } from "node:url";

import createBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

import "./src/env.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(projectRoot, "public");

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const config: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        hostname: "img.clerk.com",
        protocol: "https",
      },
      {
        hostname: "iskksotubtjejqlblkyf.supabase.co",
        protocol: "https",
      },
      {
        hostname: "vxpityfkkkoyujulayck.supabase.co",
        protocol: "https",
      },
      {
        hostname: "picsum.photos",
        protocol: "https",
      },
    ],
  },
  reactCompiler: true,
  reactStrictMode: true,
  typescript: {
    // Next.js 16's build-time TS worker is not compatible with TS 7 yet.
    // We run `yarn typecheck` separately before `next build`.
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      public: publicDir,
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      public: publicDir,
    };
    return webpackConfig;
  },
};

export default withBundleAnalyzer(config);
