/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during builds
  },
  env: {
    // NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
    NEXT_PUBLIC_BACKEND_URL: "http://127.0.0.1:8000"
  },
};

export default nextConfig;
