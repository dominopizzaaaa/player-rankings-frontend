import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

const PlayerProfile = () => {
  const router = useRouter();
  const { id } = router.query; // Get player ID from URL
  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Fetch player details
    fetch(`http://localhost:8000/players/${id}`)
      .then((response) => response.json())
      .then((data) => setPlayer(data))
      .catch((error) => console.error("Error fetching player:", error));

    // Fetch matches for this player
    fetch(`http://localhost:8000/matches`)
      .then((response) => response.json())
      .then((data) => {
        const playerMatches = data.filter(
          (match) => match.player1_id == id || match.player2_id == id
        );
        setMatches(playerMatches);
      })
      .catch((error) => console.error("Error fetching matches:", error));
  }, [id]);

  if (!player) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{player.name}'s Profile</h2>
        <p><strong>Elo Rating:</strong> {player.rating}</p>
        <p><strong>Matches Played:</strong> {player.matches_played}</p>
        <p><strong>Matches Played:</strong> {player.forehand_rubber}</p>

        <h3 className="text-xl font-bold mt-6">Match History</h3>
        <table className="w-full bg-white shadow-md rounded-lg mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Opponent</th>
              <th className="py-2 px-4">Winner</th>
              <th className="py-2 px-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const opponentId =
                match.player1_id == id ? match.player2_id : match.player1_id;
              return (
                <tr key={match.id} className="border-b">
                  <td className="py-2 px-4 text-center">Player {opponentId}</td>
                  <td className="py-2 px-4 text-center">
                    {match.winner == id ? "You" : `Player ${match.winner}`}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {match.player1_score} - {match.player2_score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerProfile;
