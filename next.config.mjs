/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a self-contained server bundle in .next/standalone,
  // which keeps the production Docker image small.
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
