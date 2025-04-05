import { useEffect, useState } from "react";
import Link from "next/link";
import CustomNavbar from "../components/Navbar";
import { fetchPlayers } from "../utils/api";

const Home = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchPlayers();
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => b.rating - a.rating);
          setPlayers(sorted);
        } else {
          console.error("Expected array but got:", data);
        }
      } catch (err) {
        console.error("Error loading players:", err);
      }
    };
  
    loadPlayers();
  }, []);
  

  const getRowClass = (index) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 animate-fade-in";
      case 1:
        return "bg-gray-100 animate-fade-in";
      case 2:
        return "bg-orange-100 animate-fade-in";
      default:
        return "animate-fade-in";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🏆 Player Leaderboard
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border border-gray-300 rounded shadow">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Player ID</th>
                <th className="py-3 px-4">Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={`${getRowClass(index)} border-t border-gray-200 transition-all duration-300`}
                >
                  <td className="py-2 px-4 font-bold">{index + 1}</td>
                  <td className="py-2 px-4">
                    <Link href={`/players/${player.id}`}>
                      <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                        {player.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4">{player.id}</td>
                  <td className="py-2 px-4">{player.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
