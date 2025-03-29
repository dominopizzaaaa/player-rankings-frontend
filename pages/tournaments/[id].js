import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/details`)
        .then((res) => res.json())
        .then((data) => {
          setTournament(data);
          setLoading(false);
        })
        .catch((err) => console.error("Failed to load tournament details", err));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!tournament) return <div>Tournament not found.</div>;

  const renderMatch = (match) => (
    <div key={match.id} className="p-2 border rounded mb-2">
      <p>
        Player {match.player1_id} vs Player {match.player2_id}
      </p>
      {match.winner_id ? (
        <p>
          Winner: Player {match.winner_id} — Score: {match.player1_score} : {match.player2_score}
        </p>
      ) : admin ? (
        <MatchResultForm match={match} tournamentId={tournament.id} />
      ) : (
        <p className="italic text-gray-500">Awaiting result...</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Tournament: {tournament.name}</h2>

        <Section title="Group Stage Matches" matches={tournament.group_matches} renderMatch={renderMatch} />
        <Section title="Knockout Stage Matches" matches={tournament.knockout_matches} renderMatch={renderMatch} />
        <Section title="Individual Matches" matches={tournament.individual_matches} renderMatch={renderMatch} />

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Final Standings</h3>
          {tournament.final_standings.length === 0 ? (
            <p className="text-gray-600 italic">No results yet.</p>
          ) : (
            <ol className="list-decimal list-inside">
              {tournament.final_standings.map((pid, index) => (
                <li key={index}>#{index + 1}: Player {pid}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, matches, renderMatch }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {matches.length === 0 ? (
        <p className="text-gray-600 italic">No matches.</p>
      ) : (
        <div className="space-y-2">{matches.map(renderMatch)}</div>
      )}
    </div>
  );
}

function MatchResultForm({ match, tournamentId }) {
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const score1 = parseInt(player1Score);
    const score2 = parseInt(player2Score);
    if (isNaN(score1) || isNaN(score2)) return alert("Scores must be numbers.");

    const winnerId = score1 > score2 ? match.player1_id : match.player2_id;

    setSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournament-matches/${match.id}/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1_score: score1,
          player2_score: score2,
          winner_id: winnerId,
        }),
      });
      window.location.reload(); // Refresh to show updated results
    } catch (err) {
      console.error("Failed to submit result", err);
      alert("Error submitting result");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
      <input
        type="number"
        placeholder="P1 Score"
        value={player1Score}
        onChange={(e) => setPlayer1Score(e.target.value)}
        className="w-20 p-1 border rounded"
        required
      />
      <input
        type="number"
        placeholder="P2 Score"
        value={player2Score}
        onChange={(e) => setPlayer2Score(e.target.value)}
        className="w-20 p-1 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={submitting}>
        Submit
      </button>
    </form>
  );
}
