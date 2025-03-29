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
        console.error("Failed to load tournament details", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!tournament) return <div className="p-4">Tournament not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{tournament.name} Details</h1>
        <p className="mb-4">Date: {tournament.date}</p>

        {/* Group Stage Matches */}
        <h2 className="text-xl font-semibold mb-2">Group Stage Matches</h2>
        <MatchList matches={tournament.group_matches} />

        {/* Knockout Stage */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Knockout Stage Matches</h2>
        <MatchList matches={tournament.knockout_matches} />

        {/* Other Matches */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Other Matches</h2>
        <MatchList matches={tournament.individual_matches} />

        {/* Final Standings */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Final Standings</h2>
        <ol className="list-decimal list-inside bg-white p-4 rounded shadow">
          {tournament.final_standings.map((playerId, index) => (
            <li key={index}>Player ID: {playerId} – Place: {index + 1}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function MatchList({ matches }) {
  if (!matches || matches.length === 0) {
    return <p className="text-gray-500">No matches.</p>;
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <div key={match.id} className="bg-white p-2 rounded shadow">
          <p>
            Player {match.player1_id} vs Player {match.player2_id}
          </p>
          <p>Score: {match.player1_score} - {match.player2_score}</p>
          <p>Winner: {match.winner_id || "TBD"}</p>
          <p>Round: {match.round} | Stage: {match.stage}</p>
        </div>
      ))}
    </div>
  );
}
