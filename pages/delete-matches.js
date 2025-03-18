import { useState, useEffect } from "react";
import { fetchMatches, deleteMatch } from "../utils/api";  // ✅ Import deleteMatch
import CustomNavbar from "../components/Navbar"; // Import Navbar

const DeleteMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // ✅ Use imported deleteMatch function
  const handleDeleteMatch = async (id) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      await deleteMatch(id);  // ✅ Call the function from api.js
      setMatches(matches.filter((match) => match.id !== id));
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-4">
        <h2>Delete Matches</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="list-group">
            {
              matches.map((match) => {
                // Determine winner's name based on winner_id
                const winnerName =
                  match.winner_id === match.player1_id ? match.player1 : 
                  match.winner_id === match.player2_id ? match.player2 : 
                  "N/A"; // If winner_id is invalid

                return (
                  <li key={match.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {match.player1} vs {match.player2} (Winner: {winnerName})
                    <button className="btn btn-danger btn-sm" onClick={() => deleteMatch(match.id)}>Delete</button>
                  </li>
                );
              })
            }
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeleteMatches;
