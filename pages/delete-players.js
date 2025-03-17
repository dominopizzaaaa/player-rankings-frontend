import { useState, useEffect } from "react";
import { fetchPlayers, deletePlayer } from "../utils/api"; // ✅ Import correctly
import CustomNavbar from "../components/Navbar"; // ✅ Import Navbar

const DeletePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch players from API
  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    setLoading(true);
    try {
      const playersData = await fetchPlayers(); // ✅ Call fetchPlayers from API
      setPlayers(playersData);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
    setLoading(false);
  };

  // Delete player function (Uses API function from `api.js`)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this player?")) return;

    const result = await deletePlayer(id); // ✅ Use imported function
    if (result) {
      setPlayers(players.filter((player) => player.id !== id)); // ✅ Update UI
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-4">
        <h2>Delete Players</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-group">
            {players.map((player) => (
              <li key={player.id} className="list-group-item d-flex justify-content-between align-items-center">
                {player.name} (Rating: {player.rating})
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(player.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeletePlayers;
