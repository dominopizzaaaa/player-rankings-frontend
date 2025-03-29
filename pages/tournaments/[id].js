import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomNavbar from "../../components/Navbar";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/details`)
      .then((res) => res.json())
      .then((data) => {
        setTournament(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tournament details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!tournament) return <div>Tournament not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{tournament.name}</h2>

        {/* Group Matches */}
        {tournament.group_matches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Group Stage Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.group_matches.map((match) => (
                <div key={match.id} className="bg-white p-4 rounded shadow">
                  <p>Player {match.player1_id} vs Player {match.player2_id}</p>
                  <p>
                    Score: {match.player1_score ?? "-"} - {match.player2_score ?? "-"}
                  </p>
                  <p>Winner: {match.winner_id ?? "TBD"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knockout Matches */}
        {tournament.knockout_matches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Knockout Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.knockout_matches.map((match) => (
                <div key={match.id} className="bg-white p-4 rounded shadow">
                  <p>Player {match.player1_id} vs Player {match.player2_id}</p>
                  <p>
                    Score: {match.player1_score ?? "-"} - {match.player2_score ?? "-"}
                  </p>
                  <p>Winner: {match.winner_id ?? "TBD"}</p>
                  <p>Round: {match.round}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Individual Matches */}
        {tournament.individual_matches.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Other Matches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tournament.individual_matches.map((match) => (
                <div key={match.id} className="bg-white p-4 rounded shadow">
                  <p>Player {match.player1_id} vs Player {match.player2_id}</p>
                  <p>
                    Score: {match.player1_score ?? "-"} - {match.player2_score ?? "-"}
                  </p>
                  <p>Winner: {match.winner_id ?? "TBD"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Standings */}
        {tournament.final_standings.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Final Standings</h3>
            <ol className="list-decimal list-inside">
              {tournament.final_standings.map((playerId, index) => (
                <li key={playerId}>Player {playerId} ({["1st", "2nd", "3rd", "4th"][index]})</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
