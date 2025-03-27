import { useEffect, useState } from "react";
import { createTournament } from "../utils/api";

const CreateTournamentForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [numGroups, setNumGroups] = useState(0);
  const [knockoutSize, setKnockoutSize] = useState(0);
  const [groupingMode, setGroupingMode] = useState("ranked");
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.error("Expected array of players, got:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch players:", err));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedPlayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedPlayerIDs = Object.keys(selectedPlayers)
      .filter((id) => selectedPlayers[id])
      .map((id) => parseInt(id));

    const tournamentData = {
      name,
      date,
      num_groups: parseInt(numGroups),
      knockout_size: parseInt(knockoutSize),
      grouping_mode: groupingMode,
      player_ids: selectedPlayerIDs,
    };

    try {
      const data = await createTournament(tournamentData);
      console.log("Tournament created!", data);
      if (onCreated) onCreated(); // Notify parent
    } catch (err) {
      console.error("Error creating tournament:", err);
      alert("Failed to create tournament: " + err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">Create New Tournament</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tournament Name */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="tournament-name">
            Tournament Name
          </label>
          <input
            id="tournament-name"
            className="w-full p-2 border rounded"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
  
        {/* Date */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="tournament-date">
            Tournament Date
          </label>
          <input
            id="tournament-date"
            className="w-full p-2 border rounded"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
  
        {/* Number of Groups */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="num-groups">
            Number of Groups
          </label>
          <input
            id="num-groups"
            className="w-full p-2 border rounded"
            type="number"
            value={numGroups}
            onChange={(e) => setNumGroups(e.target.value)}
          />
        </div>
  
        {/* Knockout Size */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="knockout-size">
            Knockout Size (e.g. 4, 8, 16)
          </label>
          <input
            id="knockout-size"
            className="w-full p-2 border rounded"
            type="number"
            value={knockoutSize}
            onChange={(e) => setKnockoutSize(e.target.value)}
          />
        </div>
  
        {/* Grouping Mode */}
        <div>
          <label className="block font-semibold mb-1" htmlFor="grouping-mode">
            Grouping Mode
          </label>
          <select
            id="grouping-mode"
            className="w-full p-2 border rounded"
            value={groupingMode}
            onChange={(e) => setGroupingMode(e.target.value)}
          >
            <option value="ranked">Ranking-based Grouping</option>
            <option value="random">Random Grouping</option>
          </select>
        </div>
  
        {/* Player Selection */}
        <div>
          <label className="block font-semibold mb-1">Select Players:</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
            {players.map((player) => (
              <label key={player.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPlayers[player.id] || false}
                  onChange={() => handleCheckboxChange(player.id)}
                />
                {player.name} (ID: {player.id})
              </label>
            ))}
          </div>
        </div>
  
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Create Tournament
        </button>
      </form>
    </div>
  );
  
};

export default CreateTournamentForm;
