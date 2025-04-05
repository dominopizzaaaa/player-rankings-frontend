import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import {
  getTournamentDetails,
  submitMatchResult,
  resetTournament,
} from "../../utils/api";
import TournamentMatchForm from "../../components/TournamentDetails/TournamentMatchForm";
import TournamentMatchResultDisplay from "../../components/TournamentDetails/TournamentMatchResultDisplay";
import GroupMatrixTable from "../../components/TournamentDetails/GroupMatrixTable";
import KnockoutBracket from "../../components/TournamentDetails/KnockoutBracket";
import FinalStandings from "../../components/TournamentDetails/FinalStandings";

export default function TournamentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tournament, setTournament] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [playerNames, setPlayerNames] = useState({});
  const [setCounts, setSetCounts] = useState({});

  // Toggle states
  const [showGroupMatches, setShowGroupMatches] = useState(false);
  const [showKnockoutMatches, setShowKnockoutMatches] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/`);
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

  const handleScoreSubmit = async (matchData) => {
    await submitMatchResult(matchData.id, {
      player1_id: matchData.player1_id,
      player2_id: matchData.player2_id,
      winner_id: matchData.winner_id,
      player1_score: matchData.player1_score,
      player2_score: matchData.player2_score,
      sets: matchData.sets,
    });

    fetchTournamentDetails();
  };

  const getPlayerName = (playerId) => {
    if (!playerId) return "TBD";
    return playerNames[playerId] || `Player #${playerId}`;
  };

  const renderMatches = (matches, title) => (
    <div className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div key={match.id} className="bg-white p-4 rounded-lg shadow border border-gray-300">
            <p className="text-sm font-medium text-gray-700 mb-2">
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Tournament: {tournament.name}
        </h2>

        {admin && (
          <div className="flex justify-end mb-8">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to reset this tournament? This will delete all matches."
                  )
                ) {
                  await resetTournament(tournament.id);
                  alert("Tournament has been reset. You can now regenerate matches.");
                  location.reload();
                }
              }}
            >
              Reset Tournament
            </button>
          </div>
        )}

        {/* Toggle Group Matches */}
        <div className="mb-6">
          <button
            onClick={() => setShowGroupMatches(!showGroupMatches)}
            className="mb-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded"
          >
            {showGroupMatches ? "Hide" : "Show"} Group Stage Matches
          </button>
          {showGroupMatches && renderMatches(tournament.group_matches, "Group Stage Matches")}
        </div>

        {tournament.group_matrix && (
          <GroupMatrixTable groupMatrix={tournament.group_matrix} playerNames={playerNames} />
        )}

        {/* Toggle Knockout Matches */}
        <div className="mb-6">
          <button
            onClick={() => setShowKnockoutMatches(!showKnockoutMatches)}
            className="mb-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded"
          >
            {showKnockoutMatches ? "Hide" : "Show"} Knockout Stage Matches
          </button>
          {showKnockoutMatches && renderMatches(tournament.knockout_matches, "Knockout Stage Matches")}
        </div>

        {tournament.knockout_bracket && (
          <KnockoutBracket bracket={tournament.knockout_bracket} playerNames={playerNames} />
        )}

        {admin && (
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
              onClick={fetchTournamentDetails}
            >
              Refresh Final Standings
            </button>
          </div>
        )}

        {tournament.final_standings && (
          <FinalStandings standings={tournament.final_standings} getPlayerName={getPlayerName} />
        )}
      </div>
    </div>
  );
}
