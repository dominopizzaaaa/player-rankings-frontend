import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SubmitMatch from "../components/SubmitMatch";
import Link from "next/link";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState({}); // Store player names

  // Fetch players and store them in an object {id: name}
  useEffect(() => {
    fetch("http://localhost:8000/players")
      .then((response) => response.json())
      .then((data) => {
        const playerMap = {};
        data.forEach((player) => {
          playerMap[player.id] = player.name;
        });
        setPlayers(playerMap);
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  // Function to fetch match history
  const fetchMatches = () => {
    fetch("http://localhost:8000/matches")
      .then((response) => response.json())
      .then((data) => setMatches(data))
      .catch((error) => console.error("Error fetching matches:", error));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Match History</h2>

        {/* Match Submission Form */}
        <SubmitMatch refreshMatches={fetchMatches} />

        {/* Match History Table */}
        <table className="w-full bg-white shadow-md rounded-lg mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Player 1</th>
              <th className="py-2 px-4">Player 2</th>
              <th className="py-2 px-4">Winner</th>
              <th className="py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b">
                {/* Player 1 Name (ID) */}
                <td className="py-2 px-4 text-center">
                  <Link href={`/players/${match.player1_id}`} className="text-blue-600 hover:underline">
                    {players[match.player1_id] || `Player ${match.player1_id}`} ({match.player1_id})
                  </Link>
                </td>

                {/* Player 2 Name (ID) */}
                <td className="py-2 px-4 text-center">
                  <Link href={`/players/${match.player2_id}`} className="text-blue-600 hover:underline">
                    {players[match.player2_id] || `Player ${match.player2_id}`} ({match.player2_id})
                  </Link>
                </td>

                {/* Winner Name (ID) */}
                <td className="py-2 px-4 text-center font-bold">
                  {players[match.winner] 
                    ? `${players[match.winner]} (${match.winner})` 
                    : `Player ${match.winner} (${match.winner})`}
                </td>

                {/* Match Score */}
                <td className="py-2 px-4 text-center">
                  {match.player1_score} - {match.player2_score}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Matches;
