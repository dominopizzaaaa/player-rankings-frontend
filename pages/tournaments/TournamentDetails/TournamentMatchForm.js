// pages/tournaments/TournamentDetails/TournamentMatchForm.js
import { useState } from "react";

export default function TournamentMatchForm({ match, playerNames, setCounts, setSetCounts, onSubmit }) {
  return (
    <form
      id={`match-form-${match.id}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(match);
      }}
      className="mt-4 space-y-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex gap-2 items-center">
          <input name="player1_score" type="number" className="border p-2 rounded w-20 text-center" placeholder="P1 Score" required />
          <span className="text-lg font-semibold">-</span>
          <input name="player2_score" type="number" className="border p-2 rounded w-20 text-center" placeholder="P2 Score" required />
        </div>

        <select name="winner_id" className="border p-2 rounded w-full sm:w-auto" required>
          <option value="">Select Winner</option>
          <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
          <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
        </select>
      </div>

      <div className="space-y-2">
        {Array.from({ length: setCounts[match.id] || 1 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <input name={`set-${i}-p1`} type="number" placeholder={`Set ${i + 1} P1`} className="border p-2 rounded w-24" required />
            <input name={`set-${i}-p2`} type="number" placeholder={`Set ${i + 1} P2`} className="border p-2 rounded w-24" required />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-2">
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm"
          onClick={() => setSetCounts(prev => ({
            ...prev,
            [match.id]: (prev[match.id] || 1) + 1
          }))}
        >
          + Add Set
        </button>

        <button
          type="button"
          className="text-red-600 hover:underline text-sm"
          onClick={() => setSetCounts(prev => ({
            ...prev,
            [match.id]: Math.max(1, (prev[match.id] || 1) - 1)
          }))}
        >
          - Remove Set
        </button>
      </div>

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
        Submit Result
      </button>
    </form>
  );
}
