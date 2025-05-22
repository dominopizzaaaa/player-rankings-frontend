import { useEffect, useState } from "react";
import { fetchPlayers, createTournament } from "../../utils/api";

const CreateTournamentForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [tournamentType, setTournamentType] = useState("group_then_knockout"); // new
  const [numGroups, setNumGroups] = useState(0);
  const [playersPerGroupAdvancing, setPlayersPerGroupAdvancing] = useState(1);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState({});

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchPlayers();
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.error("Expected array of players, got:", data);
        }
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    };
    loadPlayers();
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

    let num_groups = 0;
    let players_per_group_advancing = 0;

    if (tournamentType === "group_only") {
      num_groups = 0;
      players_per_group_advancing = 0;
    } else if (tournamentType === "group_then_knockout") {
      num_groups = parseInt(numGroups);
      players_per_group_advancing = playersPerGroupAdvancing;
    } else if (tournamentType === "knockout") {
      num_groups = 0;
      players_per_group_advancing = 0;
    }

    const tournamentData = {
      name,
      date,
      num_groups,
      players_per_group_advancing,
      player_ids: selectedPlayerIDs,
      type: tournamentType,
    };

    try {
      const data = await createTournament(tournamentData);
      alert("✅ Tournament created successfully!");
      if (onCreated) onCreated();

      // Reset form
      setName("");
      setDate("");
      setTournamentType("group_then_knockout");
      setNumGroups(0);
      setPlayersPerGroupAdvancing(1);
      setSelectedPlayers({});

      window.location.reload();
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

        {/* Tournament Type */}
        <div>
          <label className="block font-semibold mb-1">Tournament Type</label>
          <select
            value={tournamentType}
            onChange={(e) => setTournamentType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="group_then_knockout">Group Stage → Knockout</option>
            <option value="group_only">Group Stage Only</option>
            <option value="knockout">Knockout Only</option>
          </select>
        </div>

        {/* Number of Groups */}
        {tournamentType !== "knockout" && (
          <div>
            <label className="block font-semibold mb-1" htmlFor="num-groups">
              Number of Groups {tournamentType === "group_only" && "(fixed to 1)"}
            </label>
            <input
              id="num-groups"
              className="w-full p-2 border rounded"
              type="number"
              value={tournamentType === "group_only" ? 1 : numGroups}
              onChange={(e) =>
                tournamentType !== "group_only"
                  ? setNumGroups(parseInt(e.target.value))
                  : null
              }
              disabled={tournamentType === "group_only"}
              required
            />
          </div>
        )}

        {/* Number of Players Advancing */}
        {tournamentType === "group_then_knockout" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Number of players advancing per group
            </label>
            <input
              type="number"
              value={playersPerGroupAdvancing}
              onChange={(e) => setPlayersPerGroupAdvancing(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

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
