import React from "react";

export default function KnockoutBracket({ bracket, playerNames }) {
  if (!bracket || Object.keys(bracket).length === 0) return null;

  const getSize = (label) => {
    if (label === "Final") return 1;
    if (label === "3rd Place Match") return 2; // Final before 3rd
    const match = label.match(/\d+/); // Match "Round of 4", "Round of 8"
    return match ? parseInt(match[0]) + 10 : 1000; // higher number = earlier round
  };  

  const rounds = Object.keys(bracket).sort((a, b) => getSize(a) - getSize(b));

  const isMatchComplete = (match) =>
    match.player1_id && match.player2_id && match.winner_id;

  const isRoundActive = (roundMatches) =>
    roundMatches.some((match) => !match.winner_id && match.player1_id && match.player2_id);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">Knockout Bracket</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {rounds.map((round) => {
          const matches = bracket[round];
          const active = isRoundActive(matches);

          return (
            <div key={round}>
              <h4 className={`text-center font-semibold mb-2 ${active ? "text-blue-600" : ""}`}>
                {round === "Final" ? "🏆 Final" :
                round === "Round of 2" ? "🥉 3rd Place Match" :
                round === "Round of 4" ? "Semi Finals" :
                round === "Round of 8" ? "Quarter Finals" :
                round}
              </h4>
              <div className="space-y-4">
                {matches.map((match) => {
                  let label = null;
                  if (match.round === "3rd Place Match") label = "🥉 3rd Place Match";
                  else if (round === "Round of 2" || round === "Final") label = "🏆 Final";

                  const matchComplete = isMatchComplete(match);

                  return (
                    <div
                      key={match.id}
                      className={`border rounded p-2 transition-all ${
                        matchComplete
                          ? "bg-green-50 border-green-400"
                          : match.player1_id && match.player2_id
                          ? "bg-yellow-50 border-yellow-300"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >

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
          );
        })}
      </div>
    </div>
  );
}
