// pages/tournaments/TournamentDetails/GroupMatrixTable.js
import React from "react";

export default function GroupMatrixTable({ groupMatrix, playerNames }) {
  if (!groupMatrix || !groupMatrix.players?.length) return null;

  const results = groupMatrix.results || {};
  const rankings = groupMatrix.rankings || {};

  return (
    <div className="mt-10 space-y-8">
      <h3 className="text-xl font-bold mb-4">Group Stage</h3>

      {Object.entries(rankings).map(([groupNum, playerList]) => {
        const groupPlayerIds = playerList;

        return (
          <div key={groupNum}>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Group {parseInt(groupNum) + 1}
            </h4>

            <div className="overflow-x-auto mb-2">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-100">Player</th>
                    {groupPlayerIds.map((pid) => (
                      <th key={pid} className="border p-2 bg-gray-100">{playerNames[pid]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupPlayerIds.map(rowId => (
                    <tr key={rowId}>
                      <td className="border p-2 font-medium bg-gray-50">{playerNames[rowId]}</td>
                      {groupPlayerIds.map(colId => {
                        if (rowId === colId) {
                          return <td key={colId} className="border text-center text-gray-300">—</td>;
                        }

                        const key = `${rowId}-${colId}`;
                        const altKey = `${colId}-${rowId}`;
                        const match = results[key] || results[altKey];

                        return (
                          <td key={colId} className="border p-1 text-center">
                            {match ? (
                              <>
                                <div className="text-sm font-semibold">{match.score}</div>
                                <div className="text-xs text-gray-500">{match.set_scores}</div>
                                <div className="text-xs italic text-gray-600">W: {playerNames[match.winner]}</div>
                              </>
                            ) : (
                              <span className="text-gray-300">–</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Group Ranking */}
            <div className="mt-1">
              <div className="text-sm font-medium text-gray-700 mb-1">Rankings:</div>
              <ol className="list-decimal list-inside text-sm ml-2">
                {groupPlayerIds.map(pid => (
                  <li key={pid}>{playerNames[pid]}</li>
                ))}
              </ol>
            </div>
          </div>
        );
      })}
    </div>
  );
}
