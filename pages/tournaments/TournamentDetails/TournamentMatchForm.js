import { useState } from "react";

export default function TournamentMatchForm({ match, playerNames, onSubmit }) {
  const [setCount, setSetCount] = useState(1); // default to 1
  const [setScores, setSetScores] = useState([{ p1: "", p2: "" }]);

  const handleSetScoreChange = (index, player, value) => {
    const updated = [...setScores];
    updated[index][player] = value;
    setSetScores(updated);
  };

  const handleAddSet = () => {
    setSetCount((prev) => prev + 1);
    setSetScores([...setScores, { p1: "", p2: "" }]);
  };

  const handleRemoveSet = () => {
    if (setCount > 1) {
      setSetCount((prev) => prev - 1);
      setSetScores((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sets = setScores.map(({ p1, p2 }) => ({
      player1_score: Number(p1),
      player2_score: Number(p2),
    }));

    let player1_sets_won = 0;
    let player2_sets_won = 0;

    sets.forEach(({ player1_score, player2_score }) => {
      if (player1_score > player2_score) player1_sets_won++;
      else if (player2_score > player1_score) player2_sets_won++;
    });

    const total_score = {
      player1_score: player1_sets_won,
      player2_score: player2_sets_won,
    };

    const winner_id =
      player1_sets_won > player2_sets_won
        ? match.player1_id
        : match.player2_id;

    onSubmit({
      match_id: match.id,
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      winner_id,
      total_score,
      set_scores: sets,
    });    
  };

  return (
    <form
      id={`match-form-${match.id}`}
      onSubmit={handleSubmit}
      className="mt-2 space-y-2"
    >
      {/* Set-by-set input */}
      {setScores.map((set, i) => (
        <div key={i} className="flex gap-2 items-center text-sm">
          <div className="w-20 text-gray-500">Set {i + 1}</div>
          <input
            type="number"
            placeholder="P1"
            value={set.p1}
            onChange={(e) => handleSetScoreChange(i, "p1", e.target.value)}
            className="border p-1 rounded w-14"
            required
          />
          <span>-</span>
          <input
            type="number"
            placeholder="P2"
            value={set.p2}
            onChange={(e) => handleSetScoreChange(i, "p2", e.target.value)}
            className="border p-1 rounded w-14"
            required
          />
        </div>
      ))}

      {/* Add/Remove Set Buttons */}
      <div className="flex gap-2 mt-1">
        <button type="button" className="text-blue-500 underline text-sm" onClick={handleAddSet}>
          + Add Set
        </button>
        <button type="button" className="text-red-500 underline text-sm" onClick={handleRemoveSet}>
          - Remove Set
        </button>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
        Submit
      </button>
    </form>
  );
}
