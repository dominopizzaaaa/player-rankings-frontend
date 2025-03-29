export default function GroupMatrixTable({ playerNames, groupMatrix }) {
  const playerIds = Object.keys(playerNames).map(Number);

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-2">Group Stage Matrix</h3>
      <div className="overflow-x-auto">
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
                  if (rowId === colId) return <td key={colId} className="border p-2 text-center text-gray-400">—</td>;

                  const key = [rowId, colId].sort((a, b) => a - b).join("-");
                  const match = groupMatrix[key];

                  if (!match) {
                    return <td key={colId} className="border p-2 text-center text-gray-400">–</td>;
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
    </div>
  );
}
