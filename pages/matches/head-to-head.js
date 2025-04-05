import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { fetchPlayers, fetchHeadToHead } from "../../utils/api";


export default function HeadToHeadPage() {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const playerNames = Object.fromEntries(players.map((p) => [p.id, p.name]));

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playerList = await fetchPlayers();
        setPlayers(playerList);
      } catch (err) {
        setError("Failed to load players");
      }
    };
    loadPlayers();
  }, []);
  
  const handleCompare = async () => {
    try {
      const result = await fetchHeadToHead(player1, player2);
      setData(result);
      setError("");
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };  

  const fetchHeadToHead = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/head-to-head`, {
        params: { player1_id: player1, player2_id: player2 },
      });
      setData(res.data);
      setError("");
    } catch (err) {
      setError("No match history found between these two players.");
      setData(null);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Head-to-Head Comparison</h1>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <select
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Player 1</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>

          <select
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Player 2</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleCompare}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Compare
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {data && (
          <div className="bg-white p-6 rounded shadow space-y-4">
            <div className="text-xl font-semibold">Stats</div>
            <p>Matches Played: {data.matches_played}</p>
            <p>
              {playerNames[data.player1_id]} Wins: {data.player1_wins} ({data.player1_win_percentage}%)
            </p>
            <p>
              {playerNames[data.player2_id]} Wins: {data.player2_wins} ({data.player2_win_percentage}%)
            </p>
            <p>
              Sets: {data.player1_sets} - {data.player2_sets}
            </p>
            <p>
              Points: {data.player1_points} - {data.player2_points}
            </p>

            <div className="text-xl font-semibold mt-6">Match History</div>
            <div className="overflow-auto">
              <table className="w-full text-sm text-left border mt-2"> 

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Tournament</th>
                  <th className="p-2">Winner</th>
                  <th className="p-2">Match Score</th>
                  <th className="p-2">Set Scores</th>
                </tr>
              </thead>

                <tbody>
                  {data.match_history.map((m, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        {m.date ? new Date(m.date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-2">{m.tournament ? m.tournament_name || "Tournament" : "—"}</td>
                      <td className="p-2">{playerNames[m.winner_id] || "—"}</td>
                      <td className="p-2">
                        {m.player1_id && m.player2_id
                          ? `${m.player1_score} - ${m.player2_score}`
                          : "—"}
                      </td>
                      <td className="p-2">
                        {m.set_scores?.length > 0
                          ? m.set_scores.map((s, j) => (
                            <span key={j}>
                              ({s.player1_score}-{s.player2_score}){j < m.set_scores.length - 1 ? ", " : ""}
                            </span>
                            ))
                          : "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
