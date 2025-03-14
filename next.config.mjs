/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during builds
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: "https://player-rankings-backend.onrender.com", // Replace with your actual backend URL
  },
};

export default nextConfig;
