// pages/tournaments/[id].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { getTournamentDetails, submitMatchResult } from "../../utils/api";
import TournamentMatchForm from "./TournamentDetails/TournamentMatchForm";
import TournamentMatchResultDisplay from "./TournamentDetails/TournamentMatchResultDisplay";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tournament, setTournament] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [playerNames, setPlayerNames] = useState({});
  const [setCounts, setSetCounts] = useState({});

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((p) => (map[p.id] = p.name));
        setPlayerNames(map);
      });

    if (isAdmin()) setAdmin(true);
    fetchTournamentDetails();
  }, [id]);

  const fetchTournamentDetails = async () => {
    const data = await getTournamentDetails(id);
    setTournament(data);
    const initialSetCounts = {};
    [...data.group_matches, ...data.knockout_matches, ...data.individual_matches].forEach(
      (match) => {
        initialSetCounts[match.id] = Math.max(1, match.set_scores?.length || 1);
      }
    );
    setSetCounts(initialSetCounts);
  };

  const handleScoreSubmit = async (match) => {
    const form = document.getElementById(`match-form-${match.id}`);
    const winnerId = parseInt(form.winner_id.value);

    const sets = [];
    let index = 0;
    while (true) {
      const p1Input = form[`set-${index}-p1`];
      const p2Input = form[`set-${index}-p2`];
      if (!p1Input || !p2Input) break;

      sets.push({
        set_number: index + 1,
        player1_score: parseInt(p1Input.value),
        player2_score: parseInt(p2Input.value)
      });
      index++;
    }

    await submitMatchResult(match.id, {
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      winner_id: winnerId,
      sets: sets
    });

    fetchTournamentDetails();
  };

  const renderMatches = (matches, stage) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{stage}</h3>
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-3 rounded shadow">
            <p>{playerNames[match.player1_id]} vs {playerNames[match.player2_id]}</p>

            {admin && match.winner_id === null ? (
              <TournamentMatchForm
                match={match}
                playerNames={playerNames}
                setCounts={setCounts}
                setSetCounts={setSetCounts}
                onSubmit={handleScoreSubmit}
              />
            ) : (
              <TournamentMatchResultDisplay
                match={match}
                playerNames={playerNames}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Tournament: {tournament.name}</h2>
        {renderMatches(tournament.group_matches, "Group Stage Matches")}
        {renderMatches(tournament.knockout_matches, "Knockout Stage Matches")}
        {renderMatches(tournament.individual_matches, "Individual Matches")}
      </div>
    </div>
  );
}
