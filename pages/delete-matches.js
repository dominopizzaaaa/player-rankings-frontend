import { useState, useEffect } from "react";
import api from "../utils/api"; // Import API utility
import CustomNavbar from "../components/Navbar"; // Import Navbar

const DeleteMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch matches from API
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await api.get("/matches");
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
    setLoading(false);
  };

  // Delete match function
  const deleteMatch = async (id) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      await api.delete(`/matches/${id}`);
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
            {matches.map((match) => (
              <li key={match.id} className="list-group-item d-flex justify-content-between align-items-center">
                {match.player1} vs {match.player2} (Winner: {match.winner})
                <button className="btn btn-danger btn-sm" onClick={() => deleteMatch(match.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeleteMatches;
