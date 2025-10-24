/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.dog.ceo",
      },
      {
        protocol: "https",
        hostname: "dog.ceo",
      },
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
