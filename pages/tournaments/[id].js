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
  
    getTournamentDetails(id).then(setTournament);
  };  

  const renderMatches = (matches, stage) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{stage}</h3>
      <div className="space-y-2">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-3 rounded shadow">
            <p>
              {playerNames[match.player1_id]} vs {playerNames[match.player2_id]}
            </p>
            {admin && match.winner_id === null ? (
              <form
              id={`match-form-${match.id}`}
              onSubmit={(e) => {
                e.preventDefault();
                handleScoreSubmit(match);
              }}
              className="mt-2 flex flex-col gap-2"
            >
              <div id={`set-list-${match.id}`}>
                <div className="flex gap-2 items-center">
                  <input name="set-0-p1" type="number" placeholder="P1" className="border p-1 rounded w-16" required />
                  <span>-</span>
                  <input name="set-0-p2" type="number" placeholder="P2" className="border p-1 rounded w-16" required />
                </div>
              </div>
            
              <button
                type="button"
                className="text-blue-600 text-sm underline mt-1 w-fit"
                onClick={() => {
                  const container = document.getElementById(`set-list-${match.id}`);
                  const index = container.children.length;
                  const div = document.createElement("div");
                  div.className = "flex gap-2 items-center mt-1";
                  div.innerHTML = `
                    <input name="set-${index}-p1" type="number" placeholder="P1" class="border p-1 rounded w-16" required />
                    <span>-</span>
                    <input name="set-${index}-p2" type="number" placeholder="P2" class="border p-1 rounded w-16" required />
                  `;
                  container.appendChild(div);
                }}
              >
                + Add Set
              </button>
            
              <select name="winner_id" className="border p-1 rounded" required>
                <option value="">Winner</option>
                <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
                <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
              </select>
            
              <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded w-fit">
                Submit
              </button>
            </form>
            
            ) : (
              <p className="text-sm text-gray-600 mt-2">
                {match.player1_score} - {match.player2_score} (Winner:{" "}
                {playerNames[match.winner_id]})
              </p>
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
