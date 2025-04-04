import { useEffect, useState } from "react";
import { createCustomTournament, fetchPlayers } from "../../utils/api";

const CreateCustomTournamentForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [groups, setGroups] = useState([{ group_number: 0, player_ids: [] }]);
  const [knockoutSize, setKnockoutSize] = useState(16);
  const [knockoutMatches, setKnockoutMatches] = useState([]);
  const [players, setPlayers] = useState([]);

  // 🧠 Generate KO matches based on size
  const generateDefaultKoMatches = (size) => {
    return Array.from({ length: size / 2 }, () => ({
      player1_id: "",
      player2_id: "",
    }));
  };

  // 📦 Load players & generate KO matches
  useEffect(() => {
    const load = async () => {
      const fetched = await fetchPlayers();
      setPlayers(fetched);
    };
    load();
    setKnockoutMatches(generateDefaultKoMatches(knockoutSize));
  }, []);

  const handleGroupChange = (index, playerId) => {
    setGroups((prev) => {
      const updated = [...prev];
      const group = updated[index];
      if (group.player_ids.includes(playerId)) {
        group.player_ids = group.player_ids.filter((id) => id !== playerId);
      } else {
        group.player_ids.push(playerId);
      }
      return updated;
    });
  };

  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      { group_number: prev.length, player_ids: [] },
    ]);
  };

  const handleKnockoutSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setKnockoutSize(size);
    setKnockoutMatches(generateDefaultKoMatches(size));
  };

  const handleKoPlayerChange = (index, playerKey, value) => {
    setKnockoutMatches((prev) => {
      const updated = [...prev];
      updated[index][playerKey] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transformedMatches = knockoutMatches.map((m) => ({
      player1_id: m.player1_id === "" || m.player1_id === "-1" ? null : parseInt(m.player1_id),
      player2_id: m.player2_id === "" || m.player2_id === "-1" ? null : parseInt(m.player2_id),
    }));

    const payload = {
      name,
      date,
      knockout_size: knockoutSize,
      customized_groups: groups,
      customized_knockout: transformedMatches,
    };

    try {
      await createCustomTournament(payload);
      alert("✅ Custom tournament created!");
      if (onCreated) onCreated();
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to create custom tournament:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Custom Tournament</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Date */}
        <div>
          <label className="block font-semibold">Tournament Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Groups */}
        <div>
          <label className="block font-semibold mb-2">Groups</label>
          {groups.map((group, index) => (
            <div key={index} className="border p-2 mb-3 rounded">
              <strong>Group {index + 1}</strong>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {players.map((p) => (
                  <label key={p.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={group.player_ids.includes(p.id)}
                      onChange={() => handleGroupChange(index, p.id)}
                    />
                    {p.name} (ID: {p.id})
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addGroup}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            ➕ Add Group
          </button>
        </div>

        {/* KO Size */}
        <div>
          <label className="block font-semibold mb-1">Knockout Bracket Size</label>
          <select
            value={knockoutSize}
            onChange={handleKnockoutSizeChange}
            className="border rounded px-2 py-1"
          >
            {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024].map((size) => (
              <option key={size} value={size}>
                {size} players
              </option>
            ))}
          </select>
        </div>

        {/* KO Matches */}
        <div>
          <label className="block font-semibold mb-2">First Round KO Matchups</label>
          {knockoutMatches.map((match, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <select
                value={match.player1_id}
                onChange={(e) =>
                  handleKoPlayerChange(index, "player1_id", e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option value="">Select Player 1</option>
                <option value="-1">BYE</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
              </select>
              <span>vs</span>
              <select
                value={match.player2_id}
                onChange={(e) =>
                  handleKoPlayerChange(index, "player2_id", e.target.value)
                }
                className="border rounded px-2 py-1"
              >
                <option value="">Select Player 2</option>
                <option value="-1">BYE</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          ✅ Create Custom Tournament
        </button>
      </form>
    </div>
  );
};

export default CreateCustomTournamentForm;
