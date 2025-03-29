import React from "react";

export default function GroupMatrixTable({ groupMatrix, playerNames }) {
  if (!groupMatrix || !groupMatrix.players?.length) return null;

  const playerIds = groupMatrix.players;
  const rankings = groupMatrix.rankings || [];
  const results = groupMatrix.results || {};

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-2">Group Stage Matrix</h3>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-200">Player</th>
              {playerIds.map(pid => (
                <th key={pid} className="border p-2 bg-gray-200">{playerNames[pid]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {playerIds.map(rowId => (
              <tr key={rowId}>
                <td className="border p-2 font-semibold">{playerNames[rowId]}</td>
                {playerIds.map(colId => {
                  if (rowId === colId) {
                    return (
                      <td key={colId} className="border p-2 text-center text-gray-400">
                        —
                      </td>
                    );
                  }

                  const key = `${rowId}-${colId}`;
                  const altKey = `${colId}-${rowId}`;
                  const match = results[key] || results[altKey];

                  if (!match) {
                    return (
                      <td key={colId} className="border p-2 text-center text-gray-400">
                        –
                      </td>
                    );
                  }

                  return (
                    <td key={colId} className="border p-2 text-center">
                      <div>{match.score}</div>
                      <div className="text-xs text-gray-500">{match.set_scores}</div>
                      <div className="text-xs italic text-gray-700">W: {playerNames[match.winner]}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {groupMatrix.rankings && Object.keys(groupMatrix.rankings).length > 0 && (
  <div className="mt-8">
    <h4 className="text-lg font-semibold mb-2">Group Stage Rankings</h4>

    {Object.entries(groupMatrix.rankings).map(([groupNum, players]) => (
      <div key={groupNum} className="mb-6">
        <h5 className="text-md font-semibold mb-1">Group {parseInt(groupNum) + 1}</h5>

        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">#</th>
              <th className="border px-2 py-1 text-left">Player</th>
              <th className="border px-2 py-1 text-center">Matches</th>
              <th className="border px-2 py-1 text-center">Sets</th>
              <th className="border px-2 py-1 text-center">Points</th>
            </tr>
          </thead>
          <tbody>
            {players.map((pid, idx) => {
              const stats = groupMatrix.player_stats?.[pid] || {
                wins: 0, losses: 0, set_wins: 0, set_losses: 0, points_won: 0, points_lost: 0
              };

              return (
                <tr key={pid} className="border-t">
                  <td className="border px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border px-2 py-1">{playerNames[pid]}</td>
                  <td className="border px-2 py-1 text-center">{stats.wins} - {stats.losses}</td>
                  <td className="border px-2 py-1 text-center">{stats.set_wins} - {stats.set_losses}</td>
                  <td className="border px-2 py-1 text-center">{stats.points_won} - {stats.points_lost}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}

    </div>
  );
}
