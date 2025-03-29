import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tournament, setTournament] = useState(null);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/details`)
      .then((res) => res.json())
      .then((data) => setTournament(data))
      .catch((err) => console.error("Failed to load tournament details", err));
  }, [id]);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const handleScoreUpdate = async (matchId, p1Score, p2Score, winnerId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/${matchId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player1_score: p1Score,
          player2_score: p2Score,
          winner_id: winnerId,
        }),
      });

      if (!res.ok) throw new Error("Failed to update match");

      alert("Match updated!");
      router.reload();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const renderMatch = (match) => (
    <div key={match.id} className="border p-2 rounded mb-2 bg-white">
      <p>Match #{match.id}</p>
      <p>Player 1 ID: {match.player1_id}</p>
      <p>Player 2 ID: {match.player2_id}</p>
      {admin ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const p1Score = parseInt(formData.get("p1"));
            const p2Score = parseInt(formData.get("p2"));
            const winner = p1Score > p2Score ? match.player1_id : match.player2_id;
            handleScoreUpdate(match.id, p1Score, p2Score, winner);
          }}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <input
              type="number"
              name="p1"
              placeholder="P1 score"
              className="border rounded p-1 w-20"
              defaultValue={match.player1_score ?? ""}
            />
            <input
              type="number"
              name="p2"
              placeholder="P2 score"
              className="border rounded p-1 w-20"
              defaultValue={match.player2_score ?? ""}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      ) : (
        <>
          <p>Score: {match.player1_score ?? "-"} - {match.player2_score ?? "-"}</p>
          <p>Winner: {match.winner_id ?? "TBD"}</p>
        </>
      )}
    </div>
  );

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Tournament: {tournament.name}</h2>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Group Stage Matches</h3>
          {tournament.group_matches.map(renderMatch)}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Knockout Stage Matches</h3>
          {tournament.knockout_matches.map(renderMatch)}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Individual Matches</h3>
          {tournament.individual_matches.map(renderMatch)}
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Final Standings</h3>
          <ol className="list-decimal pl-5">
            {tournament.final_standings.map((playerId, index) => (
              <li key={index}>Place {index + 1}: Player {playerId}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
