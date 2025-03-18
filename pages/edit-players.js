import { useState, useEffect } from "react";
import { fetchPlayers, updatePlayer } from "../utils/api";
import CustomNavbar from "../components/Navbar";

const EditPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchPlayers().then(setPlayers);
  }, []);

  const handleEditClick = (player) => {
    setSelectedPlayer(player);
    setEditData({ ...player });
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updatePlayer(selectedPlayer.id, editData);
    setPlayers(players.map((p) => (p.id === selectedPlayer.id ? editData : p)));
    setSelectedPlayer(null);
  };

  return (
    <div>
      <CustomNavbar />
      <div className="container mt-4">
        <h2>Edit Players</h2>
        {players.map((player) => (
          <div key={player.id} className="mb-2">
            <span>{player.name} - Rating: {player.rating}</span>
            <button onClick={() => handleEditClick(player)} className="btn btn-warning btn-sm ms-2">Edit</button>
          </div>
        ))}
        
        {selectedPlayer && (
          <div className="mt-3">
            <h3>Editing: {selectedPlayer.name}</h3>
            <div className="mb-2">
              <label>Name</label>
              <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Rating</label>
              <input type="number" name="rating" value={editData.rating} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Matches</label>
              <input type="number" name="matches" value={editData.matches} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Handedness</label>
              <select name="handedness" value={editData.handedness} onChange={handleInputChange} className="form-control">
                <option value="">Select</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>
            </div>
            <div className="mb-2">
              <label>Forehand Rubber</label>
              <input type="text" name="forehand_rubber" value={editData.forehand_rubber} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Backhand Rubber</label>
              <input type="text" name="backhand_rubber" value={editData.backhand_rubber} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Blade</label>
              <input type="text" name="blade" value={editData.blade} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Age</label>
              <input type="number" name="age" value={editData.age} onChange={handleInputChange} className="form-control" />
            </div>
            <div className="mb-2">
              <label>Gender</label>
              <select name="gender" value={editData.gender} onChange={handleInputChange} className="form-control">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <button onClick={handleUpdate} className="btn btn-success">Save</button>
            <button onClick={() => setSelectedPlayer(null)} className="btn btn-secondary ms-2">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPlayers;
