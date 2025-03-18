import { useState, useEffect } from "react";
import { fetchMatches, updateMatch } from "../utils/api";
import CustomNavbar from "../components/Navbar";

const EditMatches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchMatches().then(setMatches);
  }, []);

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setEditData({ ...match });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updateMatch(selectedMatch.id, editData);
    setMatches(matches.map((m) => (m.id === selectedMatch.id ? { ...m, ...editData } : m)));
    setSelectedMatch(null);
  };

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-4">
        <h2>Edit Matches</h2>
        {matches.map((match) => {
          // Find the winner's name
          const winner = match.winner_id === match.player1_id ? match.player1 : match.player2;

          return (
            <div key={match.id} className="mb-2">
              <span>
                {match.player1} vs {match.player2}
                {" "} <span>(Score: {match.player1_score} : {match.player2_score})</span>
                {" "} <strong>(Winner: {winner || "TBD"})</strong>
              </span>
              <button onClick={() => handleEditClick(match)} className="btn btn-warning btn-sm ms-2">Edit</button>
            </div>
          );
        })}

        {selectedMatch && (
          <div className="mt-3">
            <h3>Editing Match {selectedMatch.id}</h3>
            <div className="mb-2">
              <label>Player 1 Score</label>
              <input type="number" name="player1_score" value={editData.player1_score} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Player 2 Score</label>
              <input type="number" name="player2_score" value={editData.player2_score} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Winner ID</label>
              <input type="number" name="winner_id" value={editData.winner_id} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Timestamp</label>
              <input type="datetime-local" name="timestamp" value={editData.timestamp} onChange={handleInputChange} className="form-control" />
            </div>
            <button onClick={handleUpdate} className="btn btn-success">Save</button>
            <button onClick={() => setSelectedMatch(null)} className="btn btn-secondary ms-2">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMatches;
