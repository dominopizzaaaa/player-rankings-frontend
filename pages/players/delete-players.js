import { useState, useEffect } from "react";
import { fetchPlayers, deletePlayer } from "../../utils/api";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { useRouter } from "next/router";

const DeletePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) router.push("/");
  }, []);

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    setLoading(true);
    try {
      const playersData = await fetchPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this player?")) return;

    const result = await deletePlayer(id);
    if (result) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ❌ Delete Players
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {players.map((player) => (
              <li
                key={player.id}
                className="flex items-center justify-between bg-white shadow-md p-4 rounded border hover:shadow-lg transition"
              >
                <div className="text-gray-700 font-medium">
                  {player.name}
                  <span className="text-sm text-gray-500 ml-2">
                    (Rating: {player.rating})
                  </span>
                </div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded shadow"
                  onClick={() => handleDelete(player.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeletePlayers;
