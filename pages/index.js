import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Home = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/players") // Fetch from FastAPI backend
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Player Rankings</h2>
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Rating</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className="border-b">
                <td className="py-2 px-4 text-center">{index + 1}</td>
                <td className="py-2 px-4">{player.name}</td>
                <td className="py-2 px-4 text-center">{player.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
