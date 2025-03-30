import React from "react";

export default function KnockoutBracket({ bracket, playerNames }) {
  if (!bracket || Object.keys(bracket).length === 0) return null;

  const getSize = (label) => {
    if (label === "3rd Place Match") return -1; // Push it to the bottom
    return parseInt(label.match(/\d+/)?.[0] || 0);
  };

  const rounds = Object.keys(bracket).sort((a, b) => getSize(b) - getSize(a));

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Knockout Bracket</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {rounds.map((round) => (
          <div key={round}>
            <h4 className="text-center font-semibold mb-2">{round}</h4>
            <div className="space-y-4">
              {bracket[round].map((match) => {
                let label = null;
                if (round === "Round of 2") {
                  if (match.round === "3rd Place Match") {
                    label = "🥉 3rd Place Match";
                  } else {
                    label = "🏆 Final";
                  }
                }

                return (
                  <div
                    key={match.id}
                    className={`border rounded p-2 ${
                      match.winner_id ? "bg-green-50" : "bg-gray-100"
                    }`}
                  >
                    {label && (
                      <div className="text-xs font-semibold text-center text-gray-700 mb-1">
                        {label}
                      </div>
                    )}
                    <div className="font-medium">
                      {playerNames[match.player1_id] || "TBD"} vs{" "}
                      {playerNames[match.player2_id] || "TBD"}
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
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
