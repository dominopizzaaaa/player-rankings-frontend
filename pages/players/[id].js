import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { fetchPlayers, fetchMatches } from "../../utils/api";

const PlayerProfile = () => {
  const router = useRouter();
  const { id } = router.query; // Get player ID from URL
  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [playersMap, setPlayersMap] = useState({});

  useEffect(() => {
    if (!id) return;
  
    const loadData = async () => {
      try {
        const players = await fetchPlayers();
        const map = {};
        players.forEach((p) => {
          map[p.id] = `${p.name} (${p.id})`;
        });
        setPlayersMap(map);
  
        const playerData = players.find((p) => p.id == id);
        if (playerData) setPlayer(playerData);
  
        const allMatches = await fetchMatches();
        const playerMatches = allMatches.filter(
          (match) => match.player1_id == id || match.player2_id == id
        );
        setMatches(playerMatches);
      } catch (err) {
        console.error("Error loading player profile:", err);
      }
    };
  
    loadData();
  }, [id]);  
  

  if (!player) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{player.name} ({player.id})'s Profile</h2>

        {/* Player Info */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <p><strong>Elo Rating:</strong> {player.rating}</p>
          <p><strong>Matches Played:</strong> {player.matches}</p>
          <p><strong>Handedness:</strong> {player.handedness || "Unknown"}</p>
          <p><strong>Forehand Rubber:</strong> {player.forehand_rubber || "Unknown"}</p>
          <p><strong>Backhand Rubber:</strong> {player.backhand_rubber || "Unknown"}</p>
          <p><strong>Blade:</strong> {player.blade || "Unknown"}</p>
          <p><strong>Age:</strong> {player.age ? `${player.age} years old` : "Unknown"}</p>
          <p><strong>Gender:</strong> {player.gender || "Unknown"}</p>
        </div>

        {/* Match History */}
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
                parseInt(match.player1_id) === parseInt(id)
                  ? match.player2_id
                  : match.player1_id;

              console.log(`Match ID ${match.id}: Opponent ID =`, opponentId);
              console.log(`Player names map:`, playersMap);

              return (
                <tr key={match.id} className="border-b">
                  <td className="py-2 px-4 text-center">
                    {playersMap[opponentId] || `Player ${opponentId} (${opponentId})`}
                  </td>
                  <td className="py-2 px-4 text-center font-bold">
                    {playersMap[match.winner_id] || `Player ${match.winner_id} (${match.winner_id})`}
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
