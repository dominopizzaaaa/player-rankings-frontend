import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { getTournamentDetails, submitMatchResult } from "../../utils/api";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tournament, setTournament] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [playerNames, setPlayerNames] = useState({});
  const [setCounts, setSetCounts] = useState({}); // Keyed by match ID

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
        initialSetCounts[match.id] = 1;
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
              <form
                id={`match-form-${match.id}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleScoreSubmit(match);
                }}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input name="player1_score" type="number" className="border p-1 rounded w-14" placeholder="P1 Points" required />
                  <span>-</span>
                  <input name="player2_score" type="number" className="border p-1 rounded w-14" placeholder="P2 Points" required />
                  <select name="winner_id" className="border p-1 rounded" required>
                    <option value="">Winner</option>
                    <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
                    <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
                  </select>
                </div>

                <div id={`set-scores-${match.id}`} className="space-y-1">
                  {Array.from({ length: setCounts[match.id] || 1 }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <input name={`set-${i}-p1`} type="number" placeholder={`Set ${i + 1} P1`} className="border p-1 rounded w-16" required />
                      <input name={`set-${i}-p2`} type="number" placeholder={`Set ${i + 1} P2`} className="border p-1 rounded w-16" required />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    className="text-blue-500 underline text-sm"
                    onClick={() => setSetCounts(prev => ({
                      ...prev,
                      [match.id]: (prev[match.id] || 1) + 1
                    }))}
                  >
                    + Add Set
                  </button>

                  <button
                    type="button"
                    className="text-red-500 underline text-sm"
                    onClick={() => setSetCounts(prev => ({
                      ...prev,
                      [match.id]: Math.max(1, (prev[match.id] || 1) - 1)
                    }))}
                  >
                    - Remove Set
                  </button>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded mt-2">Submit</button>
              </form>
            ) : (
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  {match.player1_score !== null && match.player2_score !== null
                    ? `${match.player1_score} - ${match.player2_score} (Winner: ${playerNames[match.winner_id]})`
                    : `(Winner: ${playerNames[match.winner_id]})`}
                </p>

                {match.set_scores?.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Sets: {match.set_scores.map((s, i) => `(${s[0]}-${s[1]})`).join(" ")}
                  </p>
                )}
              </div>
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

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Final Standings</h3>
          <ol className="list-decimal list-inside mt-2">
            {tournament.final_standings.length === 0 ? (
              <li>Not available yet</li>
            ) : (
              tournament.final_standings.map((pid, i) => (
                <li key={i}>{playerNames[pid]}</li>
              ))
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
