import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const ManagePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState("");
  const [forehandRubber, setForehandRubber] = useState("");
  const [backhandRubber, setBackhandRubber] = useState("");
  const [blade, setBlade] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // Fetch players list
  const fetchPlayers = () => {
    fetch("http://localhost:8000/players")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle adding a new player
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Player name is required!");
      return;
    }

    const newPlayer = {
      name,
      handedness,
      forehand_rubber: forehandRubber,
      backhand_rubber: backhandRubber,
      blade,
      age: age ? parseInt(age) : null,
      gender,
    };

    try {
      const response = await fetch("http://localhost:8000/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlayer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Player added successfully!");
      setName("");
      setHandedness("");
      setForehandRubber("");
      setBackhandRubber("");
      setBlade("");
      setAge("");
      setGender("");
      fetchPlayers(); // Refresh player list
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  // Handle deleting a player
  const handleDeletePlayer = async (playerId) => {
    if (!confirm("Are you sure you want to delete this player?")) return;

    try {
      const response = await fetch(`http://localhost:8000/players/${playerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Player deleted successfully!");
      fetchPlayers(); // Refresh player list
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Players</h2>

        {/* Add Player Form */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Player</h3>
          <form onSubmit={handleAddPlayer} className="space-y-4">
            <input
              type="text"
              placeholder="Player Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={handedness}
              onChange={(e) => setHandedness(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Handedness</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
            </select>
            <input
              type="text"
              placeholder="Forehand Rubber"
              value={forehandRubber}
              onChange={(e) => setForehandRubber(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Backhand Rubber"
              value={backhandRubber}
              onChange={(e) => setBackhandRubber(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Blade"
              value={blade}
              onChange={(e) => setBlade(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Add Player
            </button>
          </form>
        </div>

        {/* Player List */}
        <h3 className="text-xl font-bold mb-4">Existing Players</h3>
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Elo Rating</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b">
                <td className="py-2 px-4">{player.name}</td>
                <td className="py-2 px-4 text-center">{player.rating}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDeletePlayer(player.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlayers;
