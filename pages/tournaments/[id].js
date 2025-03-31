import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { getTournamentDetails, submitMatchResult } from "../../utils/api";
import TournamentMatchForm from "./TournamentDetails/TournamentMatchForm";
import TournamentMatchResultDisplay from "./TournamentDetails/TournamentMatchResultDisplay";
import GroupMatrixTable from "./TournamentDetails/GroupMatrixTable";
import KnockoutBracket from "./TournamentDetails/KnockoutBracket";
import FinalStandings from "./TournamentDetails/FinalStandings";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tournament, setTournament] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [playerNames, setPlayerNames] = useState({});
  const [setCounts, setSetCounts] = useState({});

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`);
      const data = await res.json();
      const map = {};
      data.forEach((p) => (map[p.id] = p.name));
      setPlayerNames(map);

      const tournamentData = await getTournamentDetails(id);
      setTournament(tournamentData);

      const initialSetCounts = {};
      [...tournamentData.group_matches, ...tournamentData.knockout_matches, ...tournamentData.individual_matches].forEach(
        (match) => {
          initialSetCounts[match.id] = Math.max(1, match.set_scores?.length || 1);
        }
      );
      setSetCounts(initialSetCounts);
    };

    loadData();
    if (isAdmin()) setAdmin(true);
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

    const player1_score = parseInt(form.player1_score.value);
    const player2_score = parseInt(form.player2_score.value);

    const sets = [];
    let index = 0;
    while (true) {
      const p1Input = form[`set-${index}-p1`];
      const p2Input = form[`set-${index}-p2`];
      if (!p1Input || !p2Input) break;

      sets.push({
        set_number: index + 1,
        player1_score: parseInt(p1Input.value),
        player2_score: parseInt(p2Input.value),
      });
      index++;
    }

    await submitMatchResult(match.id, {
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      winner_id: winnerId,
      player1_score,
      player2_score,
      sets,
    });

    fetchTournamentDetails();
  };

  const getPlayerName = (playerId) => {
    if (!playerId) return "TBD";
    return playerNames[playerId] || `Player #${playerId}`;
  };

  const renderMatches = (matches, title) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 flex justify-between items-center">
        {admin && (
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200 mr-4"
            onClick={async () => {
              if (confirm("Are you sure you want to reset this tournament? This will delete all matches.")) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${tournament.id}/reset`, {
                  method: "POST"
                });
                alert("Tournament has been reset. You can now regenerate matches.");
                location.reload();
              }
            }}
          >
            Reset Tournament
          </button>
        )}
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-3 rounded border border-gray-300 text-sm">
            <p className="mb-1 font-medium text-gray-700">
              {getPlayerName(match.player1_id)} vs {getPlayerName(match.player2_id)}
            </p>

            {admin && match.winner_id === null ? (
              <TournamentMatchForm
                match={match}
                playerNames={playerNames}
                setCounts={setCounts}
                setSetCounts={setSetCounts}
                onSubmit={handleScoreSubmit}
              />
            ) : (
              <TournamentMatchResultDisplay match={match} playerNames={playerNames} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!tournament) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Tournament: {tournament.name}
        </h2>

        {renderMatches(tournament.group_matches, "Group Stage Matches")}

        {tournament.group_matrix && (
          <GroupMatrixTable
            groupMatrix={tournament.group_matrix}
            playerNames={playerNames}
          />
        )}

        {renderMatches(tournament.knockout_matches, "Knockout Stage Matches")}

        {tournament.knockout_bracket && (
          <KnockoutBracket
            bracket={tournament.knockout_bracket}
            playerNames={playerNames}
          />
        )}

        {tournament.final_standings && (
          <FinalStandings
            standings={tournament.final_standings}
            getPlayerName={getPlayerName}
          />
        )}
      </div>
    </div>
  );
}
