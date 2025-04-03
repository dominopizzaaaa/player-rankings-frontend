import { useState, useEffect } from "react";

export default function CreateCustomTournamentForm({ onCreated }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [players, setPlayers] = useState([]);
  const [groups, setGroups] = useState([{ group_number: 0, player_ids: [] }]);
  const [knockoutMatches, setKnockoutMatches] = useState([{ player1_id: null, player2_id: null }]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
      .then((res) => res.json())
      .then(setPlayers);
  }, []);

  const addGroup = () => {
    setGroups([...groups, { group_number: groups.length, player_ids: [] }]);
  };

  const updateGroup = (index, playerId) => {
    const updatedGroups = [...groups];
    const playerIds = updatedGroups[index].player_ids;
    if (playerIds.includes(playerId)) {
      updatedGroups[index].player_ids = playerIds.filter((id) => id !== playerId);
    } else {
      updatedGroups[index].player_ids = [...playerIds, playerId];
    }
    setGroups(updatedGroups);
  };

  const addKnockoutMatch = () => {
    setKnockoutMatches([...knockoutMatches, { player1_id: null, player2_id: null }]);
  };

  const updateKOPlayer = (index, playerKey, value) => {
    const updated = [...knockoutMatches];
    updated[index][playerKey] = parseInt(value);
    setKnockoutMatches(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      date,
      customized_groups: groups,
      customized_knockout: knockoutMatches,
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/custom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Customized tournament created!");
      onCreated();
      setName("");
      setDate("");
    } else {
      alert("Failed to create tournament");
    }
  };

  return (
    <div className="bg-white p-4 shadow mb-6 rounded">
      <h3 className="text-xl font-semibold mb-2">Create Customized Tournament</h3>

      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tournament Name" className="input mb-2" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input mb-4" required />

        <div className="mb-4">
          <h4 className="font-medium">Groups</h4>
          {groups.map((group, index) => (
            <div key={index} className="mb-2">
              <p>Group {group.group_number}</p>
              <div className="flex flex-wrap gap-2">
                {players.map((p) => (
                  <label key={p.id} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={group.player_ids.includes(p.id)}
                      onChange={() => updateGroup(index, p.id)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={addGroup} className="btn btn-sm mt-2">+ Add Group</button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium">Knockout Bracket</h4>
          {knockoutMatches.map((match, i) => (
            <div key={i} className="flex gap-2 items-center mb-1">
              <select value={match.player1_id || ""} onChange={(e) => updateKOPlayer(i, "player1_id", e.target.value)} className="input">
                <option value="">Player 1</option>
                {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              vs
              <select value={match.player2_id || ""} onChange={(e) => updateKOPlayer(i, "player2_id", e.target.value)} className="input">
                <option value="">Player 2</option>
                {players.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          ))}
          <button type="button" onClick={addKnockoutMatch} className="btn btn-sm">+ Add Match</button>
        </div>

        <button type="submit" className="btn btn-primary mt-2">Create Customized Tournament</button>
      </form>
    </div>
  );
}
