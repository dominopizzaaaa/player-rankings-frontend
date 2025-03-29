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
      className="mt-2 space-y-2"
    >
      <div className="flex items-center gap-2">
        <input name="player1_score" type="number" className="border p-1 rounded w-14" placeholder="P1 Points" required />
        <span>-</span>
        <input name="player2_score" type="number" className="border p-1 rounded w-14" placeholder="P2 Points" required />
        <select name="winner_id" className="border p-1 rounded" required>
          <option value="">Winner</option>
          <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
          <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
        </select>
      </div>

      <div className="space-y-1">
        {Array.from({ length: setCounts[match.id] || 1 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <input name={`set-${i}-p1`} type="number" placeholder={`Set ${i + 1} P1`} className="border p-1 rounded w-16" required />
            <input name={`set-${i}-p2`} type="number" placeholder={`Set ${i + 1} P2`} className="border p-1 rounded w-16" required />
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-1">
        <button
          type="button"
          className="text-blue-500 underline text-sm"
          onClick={() => setSetCounts(prev => ({
            ...prev,
            [match.id]: (prev[match.id] || 1) + 1
          }))}
        >
          + Add Set
        </button>

        <button
          type="button"
          className="text-red-500 underline text-sm"
          onClick={() => setSetCounts(prev => ({
            ...prev,
            [match.id]: Math.max(1, (prev[match.id] || 1) - 1)
          }))}
        >
          - Remove Set
        </button>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Submit</button>
    </form>
  );
}
