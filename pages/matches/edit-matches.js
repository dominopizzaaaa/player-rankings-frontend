import { useState, useEffect } from "react";
import { fetchMatches, updateMatch } from "../../utils/api";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { useRouter } from "next/router";

const EditMatches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [editData, setEditData] = useState({});
  const [setScores, setSetScores] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) router.push("/");
  }, []);

  useEffect(() => {
    fetchMatches().then((data) => {
      setMatches(data);
    });
  }, []);

  const handleEditClick = (match) => {
    setSelectedMatchId(match.id);
    setEditData({ ...match });
    setSetScores(match.set_scores || [{ p1: 0, p2: 0 }]);
  };

  const handleInputChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSetChange = (index, player, value) => {
    const updated = [...setScores];
    updated[index][player] = parseInt(value);
    setSetScores(updated);
  };

  const handleAddSet = () => {
    setSetScores([...setScores, { p1: 0, p2: 0 }]);
  };

  const handleRemoveSet = (index) => {
    setSetScores(setScores.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    const sets = setScores.map((s, i) => ({
      set_number: i + 1,
      player1_score: parseInt(s.p1),
      player2_score: parseInt(s.p2),
    }));
  
    const player1_score = sets.filter(s => s.player1_score > s.player2_score).length;
    const player2_score = sets.filter(s => s.player2_score > s.player1_score).length;
  
    const updatePayload = {
      ...editData,
      player1_score,
      player2_score,
      sets,
    };
  
    await updateMatch(selectedMatchId, updatePayload);
    setMatches(matches.map((m) =>
      m.id === selectedMatchId ? { ...m, ...editData, set_scores: setScores } : m
    ));
    setSelectedMatchId(null);
  };  

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🎯 Edit Matches</h2>
  
        <div className="space-y-6">
          {matches.map((match) => {
            const winner = match.winner_id === match.player1_id ? match.player1 : match.player2;
  
            return (
              <div key={match.id} className="space-y-2">
                <div className="bg-white shadow rounded p-4 flex justify-between items-center border border-gray-200">
                  <div className="text-gray-700 text-sm">
                    <div>
                      <strong>{match.player1}</strong> vs <strong>{match.player2}</strong>{" "}
                      <span className="text-gray-500">
                        ({match.player1_score}:{match.player2_score}){" "}
                        {match.set_scores?.length > 0 && (
                          <span className="text-gray-400">
                            (
                            {match.set_scores
                              .map((s) => `${s.player1_score}:${s.player2_score}`)
                              .join(", ")}
                            )
                          </span>
                        )}
                      </span>{" "}
                      <span className="text-green-600 font-medium">(Winner: {winner || "TBD"})</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(match)}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded shadow transition"
                  >
                    Edit
                  </button>
                </div>
  
                {selectedMatchId === match.id && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Editing Match #{match.id}
                    </h3>
  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Player 1 Score
                        </label>
                        <input
                          type="number"
                          name="player1_score"
                          value={editData.player1_score}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
  
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Player 2 Score
                        </label>
                        <input
                          type="number"
                          name="player2_score"
                          value={editData.player2_score}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
  
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Winner ID
                        </label>
                        <input
                          type="number"
                          name="winner_id"
                          value={editData.winner_id}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
  
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Timestamp
                        </label>
                        <input
                          type="datetime-local"
                          name="timestamp"
                          value={editData.timestamp}
                          onChange={handleInputChange}
                          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
  
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Set Scores</label>
                      {setScores.map((set, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="number"
                            value={set.p1}
                            onChange={(e) => handleSetChange(index, "p1", e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded"
                          />
                          <span>vs</span>
                          <input
                            type="number"
                            value={set.p2}
                            onChange={(e) => handleSetChange(index, "p2", e.target.value)}
                            className="w-20 p-1 border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(index)}
                            className="text-red-600 text-sm"
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddSet}
                        className="text-blue-600 text-sm font-semibold"
                      >
                        + Add Set
                      </button>
                    </div>
  
                    <div className="flex gap-4">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setSelectedMatchId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EditMatches;
