/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignores ESLint errors during builds
  },
  env: {
    // NEXT_PUBLIC_BACKEND_URL: "https://player-rankings-backend.onrender.com"
    NEXT_PUBLIC_BACKEND_URL: "http://127.0.0.1:8000"
  },
};

export default nextConfig;
