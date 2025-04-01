import { useState } from "react";

export default function TournamentMatchForm({ match, playerNames, setCounts, setSetCounts, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const count = setCounts[match.id] || 1;
    return {
      winner_id: "",
      sets: Array.from({ length: count }, () => ({ p1: "", p2: "" })),
    };
  });

  const handleSetChange = (index, player, value) => {
    const updated = [...formData.sets];
    updated[index][player] = value;
    setFormData({ ...formData, sets: updated });
  };

  const handleWinnerChange = (e) => {
    setFormData({ ...formData, winner_id: e.target.value });
  };

  const handleAddSet = () => {
    setFormData((prev) => ({
      ...prev,
      sets: [...prev.sets, { p1: "", p2: "" }],
    }));
    setSetCounts((prev) => ({
      ...prev,
      [match.id]: (prev[match.id] || 1) + 1,
    }));
  };

  const handleRemoveSet = () => {
    setFormData((prev) => ({
      ...prev,
      sets: prev.sets.slice(0, -1),
    }));
    setSetCounts((prev) => ({
      ...prev,
      [match.id]: Math.max(1, (prev[match.id] || 1) - 1),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedSetScores = formData.sets.map((s, i) => ({
      set_number: i + 1,
      player1_score: parseInt(s.p1),
      player2_score: parseInt(s.p2),
    }));

    const player1_score = parsedSetScores.filter(s => s.player1_score > s.player2_score).length;
    const player2_score = parsedSetScores.filter(s => s.player2_score > s.player1_score).length;

    onSubmit({
      ...match,
      winner_id: parseInt(formData.winner_id),
      sets: parsedSetScores,
      player1_score,
      player2_score,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <select
          name="winner_id"
          className="border p-2 rounded w-full"
          value={formData.winner_id}
          onChange={handleWinnerChange}
          required
        >
          <option value="">Select Winner</option>
          <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
          <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
        </select>
      </div>

      <div className="space-y-2">
        {formData.sets.map((set, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="number"
              placeholder={`Set ${i + 1} P1`}
              className="border p-2 rounded w-full"
              value={set.p1}
              onChange={(e) => handleSetChange(i, "p1", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder={`Set ${i + 1} P2`}
              className="border p-2 rounded w-full"
              value={set.p2}
              onChange={(e) => handleSetChange(i, "p2", e.target.value)}
              required
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 text-sm">
        <button type="button" className="text-blue-600 hover:underline" onClick={handleAddSet}>
          + Add Set
        </button>
        <button type="button" className="text-red-600 hover:underline" onClick={handleRemoveSet}>
          - Remove Set
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
      >
        Submit Result
      </button>
    </form>
  );
}
