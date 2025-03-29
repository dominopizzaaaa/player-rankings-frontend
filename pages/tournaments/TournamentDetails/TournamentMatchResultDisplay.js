// pages/tournaments/TournamentDetails/TournamentMatchResultDisplay.js
export default function TournamentMatchResultDisplay({ match, playerNames }) {
  return (
    <div className="text-sm text-gray-600 space-y-1">
      <p>
        {match.player1_score !== null && match.player2_score !== null
          ? `${match.player1_score} - ${match.player2_score} (Winner: ${playerNames[match.winner_id]})`
          : `(Winner: ${playerNames[match.winner_id]})`}
      </p>

      {match.set_scores?.length > 0 && (
        <p className="text-xs text-gray-500">
          Sets:{" "}
          {match.set_scores.map((s, i) => `(${s[0]}-${s[1]})`).join(" ")}{" "}
          —{" "}
          {
            (() => {
              const p1SetWins = match.set_scores.filter(s => s[0] > s[1]).length;
              const p2SetWins = match.set_scores.filter(s => s[1] > s[0]).length;
              return `${p1SetWins}–${p2SetWins}`;
            })()
          }
        </p>
      )}
    </div>
  );
}
