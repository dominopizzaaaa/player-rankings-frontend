/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during builds
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: "https://xbq-backend-72trh.ondigitalocean.app/", // Replace with your actual backend URL
  },
};

export default nextConfig;
