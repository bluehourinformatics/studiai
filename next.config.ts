import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://e1dmh6irml.ufs.sh/**")],
  },
};

export default nextConfig;
