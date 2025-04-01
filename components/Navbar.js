import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false); // ⬅️ track client-side render

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold whitespace-nowrap">
          🏓 Elo Rankings
        </Link>

        {/* Links container */}
        {mounted && (
          <div className="flex overflow-x-auto whitespace-nowrap gap-6 text-sm font-medium ml-8">
            <Link href="/" className="hover:text-yellow-300">
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/matches/add-matches" className="hover:text-yellow-300">
                  Matches
                </Link>
                <Link href="/tournaments" className="hover:text-yellow-300">
                  Tournaments
                </Link>
                <Link href="/players/add-players" className="hover:text-yellow-300">
                  Add Player
                </Link>
                <Link href="/players/delete-players" className="hover:text-yellow-300">
                  Delete Players
                </Link>
                <Link href="/matches/delete-matches" className="hover:text-yellow-300">
                  Delete Matches
                </Link>
                <Link href="/players/edit-players" className="hover:text-yellow-300">
                  Edit Players
                </Link>
                <Link href="/matches/edit-matches" className="hover:text-yellow-300">
                  Edit Matches
                </Link>
                <Link href="/matches/head-to-head" className="hover:text-yellow-300">
                  Head to Head
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-yellow-300">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
