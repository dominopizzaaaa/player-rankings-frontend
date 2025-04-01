import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdmin } from "../../utils/auth";

const TournamentList = ({ tournaments, onDelete }) => {
  const [admin, setAdmin] = useState(false);
  const [playerNames, setPlayerNames] = useState({});

  useEffect(() => {
    setAdmin(isAdmin());

    const fetchPlayerNames = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`);
        const data = await res.json();
        const map = {};
        data.forEach((p) => (map[p.id] = p.name));
        setPlayerNames(map);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayerNames();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tournament and all its matches?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete tournament");
      }

      if (onDelete) onDelete(id);
    } catch (err) {
      console.error(err);
      alert("Something went wrong deleting the tournament.");
    }
  };

  const extractWinners = (finalStandings) => {
    if (!finalStandings || typeof finalStandings !== "object") return null;

    const getName = (pos) => {
      const id = finalStandings[pos] || finalStandings[parseInt(pos)];
      return id ? playerNames[id] || `Player #${id}` : null;
    };
    

    return {
      first: getName("1"),
      second: getName("2"),
      third: getName("3"),
    };
  };

  return (
    <div className="grid gap-4">
      {tournaments.map((tournament) => {
        console.log("🎯 Tournament:", tournament);
        console.log("🏁 Final standings:", tournament.final_standings);
        
        const winners = extractWinners(tournament.final_standings);

        return (
          <div
            key={tournament.id}
            className="bg-white p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-bold">{tournament.name}</h3>
              <p className="text-sm text-gray-600">Date: {tournament.date}</p>

              {winners?.first && winners?.second ? (
                <div className="mt-2 text-sm text-gray-700">
                  🥇 1st: {winners.first} <br />
                  🥈 2nd: {winners.second} <br />
                  {winners.third && <>🥉 3rd: {winners.third}</>}
                </div>
              ) : (
                <p className="mt-2 text-sm text-yellow-700 font-medium">⏳ In Progress</p>
              )}

              <Link
                href={`/tournaments/${tournament.id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </div>

            {admin && (
              <button
                onClick={() => handleDelete(tournament.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm"
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TournamentList;
