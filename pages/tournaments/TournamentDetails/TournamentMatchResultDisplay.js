// pages/tournaments/TournamentDetails/TournamentMatchResultDisplay.js
export default function TournamentMatchResultDisplay({ match, playerNames }) {
  if (!match) return null;

  const p1Name = playerNames[match.player1_id] || "TBD";
  const p2Name = playerNames[match.player2_id] || "TBD";

  const p1SetWins = match.set_scores?.filter((s) => s[0] > s[1]).length || 0;
  const p2SetWins = match.set_scores?.filter((s) => s[1] > s[0]).length || 0;

  return (
    <div className="bg-white shadow rounded p-3 text-sm space-y-2 border border-gray-200">
      <div className="font-medium text-gray-800">
        {p1Name} <span className="text-gray-500">vs</span> {p2Name}
      </div>
      <div className="text-gray-700">
        <span className="font-semibold">{match.player1_score}</span> -{" "}
        <span className="font-semibold">{match.player2_score}</span>{" "}
        <span className="italic text-gray-500">
          (Winner: {playerNames[match.winner_id]})
        </span>
      </div>
      {match.set_scores?.length > 0 && (
        <div className="text-xs text-gray-600">
          <div className="mb-1">Set Scores:</div>
          <div className="flex flex-wrap gap-2">
            {match.set_scores.map((set, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-100 rounded border text-gray-700"
              >
                {set[0]} - {set[1]}
              </span>
            ))}
          </div>
          <div className="mt-1 italic">
            Sets: {p1SetWins} - {p2SetWins}
          </div>
        </div>
      )}
    </div>
  );
}
