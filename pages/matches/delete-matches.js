import { useState, useEffect } from "react";
import { fetchMatches, deleteMatch } from "../../utils/api";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { useRouter } from "next/router";

const DeleteMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetchMatchesData();
  }, []);

  const fetchMatchesData = async () => {
    setLoading(true);
    try {
      const matchesData = await fetchMatches();
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
    setLoading(false);
  };

  const handleDeleteMatch = async (id) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      await deleteMatch(id);
      setMatches(matches.filter((match) => match.id !== id));
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🗑️ Delete Matches</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-center text-gray-500">No matches found.</p>
        ) : (
          <ul className="space-y-4">
            {matches.map((match) => {
              const winnerName =
                match.winner_id === match.player1_id
                  ? match.player1
                  : match.winner_id === match.player2_id
                  ? match.player2
                  : "N/A";

              return (
                <li
                  key={match.id}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="text-gray-700">
                    <span className="font-medium">{match.player1}</span> vs{" "}
                    <span className="font-medium">{match.player2}</span>{" "}
                    <span className="text-sm text-gray-500 italic">
                      (Winner: {winnerName})
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded shadow transition"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeleteMatches;
