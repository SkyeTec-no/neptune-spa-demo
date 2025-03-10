import type { NextConfig } from "next";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants";

const nextConfig = (phase: string): NextConfig => {
  return {
    output: "export",
    basePath: phase === PHASE_PRODUCTION_BUILD ? "/base/path" : undefined,
    rewrites:
      phase === PHASE_DEVELOPMENT_SERVER
        ? async () => {
            return [
              {
                source: "/api/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
              },
            ];
          }
        : undefined,
    webpack(config) {
      // Exclude SVGs from the default file loader
      config.module.rules.push({
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      });

      return config;
    },
    experimental: {
      turbo: {
        rules: {
          "*.svg": {
            loaders: ["@svgr/webpack"],
            as: "*.js",
          },
        },
      },
    },
  };
};

export default nextConfig;
