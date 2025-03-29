// pages/tournaments/TournamentDetails/TournamentMatchForm.js
import { useState } from "react";

export default function TournamentMatchForm({ match, playerNames, onSubmit }) {
  const [setCount, setSetCount] = useState(1); // default to 1 for flexibility

  return (
    <form
      id={`match-form-${match.id}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(match);
      }}
      className="mt-2 space-y-2"
    >
      <div className="flex items-center gap-2">
        <input
          name="player1_score"
          type="number"
          className="border p-1 rounded w-14"
          placeholder="P1 Points"
          required
        />
        <span>-</span>
        <input
          name="player2_score"
          type="number"
          className="border p-1 rounded w-14"
          placeholder="P2 Points"
          required
        />
        <select name="winner_id" className="border p-1 rounded" required>
          <option value="">Winner</option>
          <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
          <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
        </select>
      </div>

      {/* Placeholder for dynamic sets input if re-enabled in future */}
      <div className="space-y-1 text-gray-500 text-xs">
        Simulated sets will be calculated from points.
      </div>

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          className="text-blue-500 underline text-sm"
          onClick={() => setSetCount(prev => prev + 1)}
        >
          + Add Set
        </button>
        <button
          type="button"
          className="text-red-500 underline text-sm"
          onClick={() => setSetCount(prev => Math.max(1, prev - 1))}
        >
          - Remove Set
        </button>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
        Submit
      </button>
    </form>
  );
}
