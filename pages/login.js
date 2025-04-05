import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "../utils/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await loginUser(username, password);
      router.push("/");
    } catch (error) {
      alert("Invalid login");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in-down">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Leaderboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out both;
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
