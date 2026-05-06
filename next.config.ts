import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /** Align host with Supabase Site URL (apex) so OAuth redirectTo and cookies stay on one origin. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.digikonmarketing.com" }],
        destination: "https://digikonmarketing.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
