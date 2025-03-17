import { useState, useEffect } from "react";

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
      alert("Please select valid players and a winner.");
      return;
    }
  
    const matchData = {
      player1_id: parseInt(player1),
      player2_id: parseInt(player2),
      player1_score: parseInt(player1Score),
      player2_score: parseInt(player2Score),
      winner_id: parseInt(winner),  // ✅ Changed "winner" to "winner_id"
    };
  
    console.log("Match data being sent:", JSON.stringify(matchData, null, 2)); // Debugging
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      alert("Match submitted successfully!");
      setPlayer1("");
      setPlayer2("");
      setPlayer1Score("");
      setPlayer2Score("");
      setWinner("");
  
      refreshMatches(); // ✅ Refresh match history after submission
  
    } catch (error) {
      console.error("Error submitting match:", error);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Submit Match Result</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Player 1</label>
          <select
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value={parseInt(player1, 10)}>Player 1</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Player 2</label>
          <select
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value={parseInt(player2, 10)}>Player 2</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium">Player 1 Score</label>
            <input
              type="number"
              value={player1Score}
              onChange={(e) => setPlayer1Score(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Player 2 Score</label>
            <input
              type="number"
              value={player2Score}
              onChange={(e) => setPlayer2Score(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Winner</label>
          <select
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Winner</option>
            <option value={player1}>Player 1</option>
            <option value={player2}>Player 2</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 hover:bg-blue-700"
        >
          Submit Match
        </button>
      </form>
    </div>
  );
};

export default SubmitMatch;
