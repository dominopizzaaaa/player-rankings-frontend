import React from "react";

export default function FinalStandings({ standings, playerNames }) {
  if (!standings || Object.keys(standings).length === 0) return null;

  const getPlayer = (pos) => {
    const playerId = standings[pos];
    if (!playerId || !playerNames || !playerNames[playerId]) return "TBD";
    return playerNames[playerId];
  };
  

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-10">
      <h3 className="text-xl font-bold mb-4 text-center">🏆 Final Standings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-50 rounded">
          <div className="font-semibold text-yellow-600">🥇 1st Place</div>
          <div className="text-gray-800">{getPlayer("1")}</div>
        </div>
        <div className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-100 rounded">
          <div className="font-semibold text-gray-600">🥈 2nd Place</div>
          <div className="text-gray-800">{getPlayer("2")}</div>
        </div>
        {standings["3"] && (
          <div className="border-l-4 border-orange-400 pl-4 py-2 bg-orange-50 rounded">
            <div className="font-semibold text-orange-600">🥉 3rd Place</div>
            <div className="text-gray-800">{getPlayer("3")}</div>
          </div>
        )}
        {standings["4"] && (
          <div className="border-l-4 border-blue-400 pl-4 py-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">4th Place</div>
            <div className="text-gray-800">{getPlayer("4")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
