import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

const SubmitMatch = () => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");
  const [setScores, setSetScores] = useState([{ p1: "", p2: "" }]);
  const [matches, setMatches] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMatches(sorted);
      })
      .catch((err) => console.error("Error fetching matches:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleAddSet = () => {
    setSetScores([...setScores, { p1: "", p2: "" }]);
  };

  const handleRemoveSet = (index) => {
    setSetScores(setScores.filter((_, i) => i !== index));
  };

  const handleSetChange = (index, player, value) => {
    const updated = [...setScores];
    updated[index][player] = value;
    setSetScores(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!player1 || !player2 || !winner || player1 === player2) {
      alert("Please select valid players and ensure Player 1 and Player 2 are different.");
      return;
    }

    const parsedSetScores = setScores.map((s, i) => ({
      set_number: i + 1,
      player1_score: parseInt(s.p1),
      player2_score: parseInt(s.p2),
    }));

    const player1_score = parsedSetScores.filter(
      (s) => s.player1_score > s.player2_score
    ).length;

    const player2_score = parsedSetScores.filter(
      (s) => s.player2_score > s.player1_score
    ).length;

    const matchData = {
      player1_id: parseInt(player1),
      player2_id: parseInt(player2),
      winner_id: parseInt(winner),
      player1_score,
      player2_score,
      sets: parsedSetScores,
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("Unauthorized! Please log in.");
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return;
      }

      alert("Match submitted successfully!");
      setPlayer1("");
      setPlayer2("");
      setWinner("");
      setSetScores([{ p1: "", p2: "" }]);
    } catch (err) {
      console.error("Error submitting match:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">➕ Add Match</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 1</label>
              <select
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              >
                <option value="">Select Player 1</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 2</label>
              <select
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                disabled={!player1}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              >
                <option value="">Select Player 2</option>
                {players
                  .filter((p) => p.id !== parseInt(player1))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Set Scores</label>
              {setScores.map((set, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="P1"
                    value={set.p1}
                    onChange={(e) => handleSetChange(index, "p1", e.target.value)}
                    className="w-20 p-1 border border-gray-300 rounded"
                    required
                  />
                  <span>vs</span>
                  <input
                    type="number"
                    placeholder="P2"
                    value={set.p2}
                    onChange={(e) => handleSetChange(index, "p2", e.target.value)}
                    className="w-20 p-1 border border-gray-300 rounded"
                    required
                  />
                  {setScores.length > 1 && (
                    <button type="button" onClick={() => handleRemoveSet(index)} className="text-red-600 text-sm">
                      ✖
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddSet} className="text-blue-600 text-sm font-semibold mt-1">
                + Add Set
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Winner</label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                disabled={!player1 || !player2}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              >
                <option value="">Select Winner</option>
                {player1 && (
                  <option value={player1}>{players.find((p) => p.id == player1)?.name}</option>
                )}
                {player2 && (
                  <option value={player2}>{players.find((p) => p.id == player2)?.name}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Match Date (optional)</label>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
            >
              Submit Match
            </button>
          </form>
        ) : (
          <div className="text-center text-gray-600 bg-white border border-gray-200 rounded shadow-md p-6">
            Please log in to submit a match.
          </div>
        )}

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">📜 Recent Matches</h3>
          <div className="space-y-4">
            {matches.map((m) => {
              const winner = m.winner_id === m.player1_id ? m.player1 : m.player2;
              const setString =
                m.set_scores && m.set_scores.length > 0
                  ? m.set_scores.map((s) => `${s.player1_score}:${s.player2_score}`).join(", ")
                  : null;

              const matchDate = new Date(m.timestamp).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={m.id} className="bg-white border border-gray-200 rounded shadow p-4 text-sm">
                  <span className="block text-gray-500 mb-1">{matchDate}</span>
                  <span className="font-semibold">{m.player1}</span> vs{" "}
                  <span className="font-semibold">{m.player2}</span>{" "}
                  <span className="text-gray-500">
                    ({m.player1_score}:{m.player2_score}
                    {setString && `) (${setString}`}
                    )
                  </span>{" "}
                  <span className="text-green-600 font-medium">Winner: {winner}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitMatch;
