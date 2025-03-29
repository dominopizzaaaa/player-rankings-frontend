import React from "react";

export default function KnockoutBracket({ bracket, playerNames }) {
  if (!bracket || Object.keys(bracket).length === 0) return null;

  const rounds = Object.keys(bracket).sort((a, b) => {
    // Sort by size of "Round of X" → 8, 4, 2, 1
    const getSize = (label) => parseInt(label.match(/\d+/)?.[0] || 0);
    return getSize(b) - getSize(a);
  });

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Knockout Bracket</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {rounds.map((round) => (
          <div key={round}>
            <h4 className="text-center font-semibold mb-2">{round}</h4>
            <div className="space-y-4">
              {bracket[round].map((match) => (
                <div
                  key={match.id}
                  className={`border rounded p-2 ${
                    match.winner_id ? "bg-green-50" : "bg-gray-100"
                  }`}
                >
                  <div className="font-medium">
                    {playerNames[match.player1_id] || "TBD"} vs {playerNames[match.player2_id] || "TBD"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.player1_score ?? "-"} : {match.player2_score ?? "-"}
                  </div>
                  {match.winner_id && (
                    <div className="text-xs text-blue-500 italic">
                      Winner: {playerNames[match.winner_id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
