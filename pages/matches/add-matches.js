import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

const SubmitMatch = ({ refreshMatches }) => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [winner, setWinner] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!player1 || !player2 || !winner || player1 === player2) {
      alert("Please select valid players and ensure Player 1 and Player 2 are different.");
      return;
    }

    const matchData = {
      player1_id: parseInt(player1),
      player2_id: parseInt(player2),
      player1_score: parseInt(player1Score),
      player2_score: parseInt(player2Score),
      winner_id: parseInt(winner),
    };

    console.log("Match data being sent:", JSON.stringify(matchData, null, 2)); // Debugging

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
          Authorization: `Bearer ${token}`, // ✅ Added token authentication
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
      setPlayer1Score("");
      setPlayer2Score("");
      setWinner("");

    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">➕ Add Match</h2>
  
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6 border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Player 1</label>
            <select
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 1 Score</label>
              <input
                type="number"
                value={player1Score}
                onChange={(e) => setPlayer1Score(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Player 2 Score</label>
              <input
                type="number"
                value={player2Score}
                onChange={(e) => setPlayer2Score(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Winner</label>
            <select
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              disabled={!player1 || !player2}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Winner</option>
              {player1 && (
                <option value={player1}>
                  {players.find((p) => p.id == player1)?.name}
                </option>
              )}
              {player2 && (
                <option value={player2}>
                  {players.find((p) => p.id == player2)?.name}
                </option>
              )}
            </select>
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Submit Match
          </button>
        </form>
      </div>
    </div>
  );  
};

export default SubmitMatch;
