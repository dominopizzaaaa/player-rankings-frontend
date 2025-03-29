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
      .then(res => res.json())
      .then(data => {
        const nameMap = {};
        data.forEach(p => nameMap[p.id] = p.name);
        setPlayerNames(nameMap);
      });

    getTournamentDetails(id).then(setTournament);

    if (isAdmin()) setAdmin(true);
  }, [id]);

  const handleScoreSubmit = async (match) => {
    const form = document.getElementById(`match-form-${match.id}`);
    const score1 = parseInt(form.player1_score.value);
    const score2 = parseInt(form.player2_score.value);
  
    await submitMatchResult(match.id, {
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      player1_score: score1,
      player2_score: score2,
      winner_id: match.winner_id,
    });
  
    getTournamentDetails(id).then(setTournament);
  };
  

  const renderMatches = (matches, stage) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{stage}</h3>
      <div className="space-y-2">
        {matches.map(match => (
          <div key={match.id} className="bg-white p-3 rounded shadow">
            <p>
              {playerNames[match.player1_id]} vs {playerNames[match.player2_id]}
            </p>
            {admin ? (
              <form id={`match-form-${match.id}`} onSubmit={e => {
                e.preventDefault();
                handleScoreSubmit(match);
              }} className="mt-2 flex gap-2 items-center">
                <input name="player1_score" type="number" className="border p-1 rounded w-12" required />
                <span> - </span>
                <input name="player2_score" type="number" className="border p-1 rounded w-12" required />
                <select name="winner_id" className="border p-1 rounded" required>
                  <option value="">Winner</option>
                  <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
                  <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Submit</button>
              </form>
              
            ) : (
              <p className="text-sm text-gray-600">
                {match.player1_score} - {match.player2_score} (Winner: {playerNames[match.winner_id]})
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
            {tournament.final_standings.map((pid, i) => (
              <li key={i}>{playerNames[pid]}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}