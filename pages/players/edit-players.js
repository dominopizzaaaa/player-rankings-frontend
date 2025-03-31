import { useState, useEffect } from "react";
import { fetchPlayers, updatePlayer } from "../../utils/api";
import CustomNavbar from "../../components/Navbar";
import { isAdmin } from "../../utils/auth";
import { useRouter } from "next/router";

export default function EditPlayers() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [editData, setEditData] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Only run redirect client-side after mount
    if (typeof window !== "undefined" && !isAdmin()) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    fetchPlayers().then(setPlayers);
  }, []);

  const handleEditClick = (player) => {
    console.log("Editing:", player.name); // Debug log
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
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Players</h2>

        <div className="space-y-3">
          {players.map((player) => (
            <div key={player.id}>
              <div className="flex items-center justify-between p-3 bg-white shadow rounded border">
                <span className="text-gray-700 font-medium">
                  {player.name} <span className="text-sm text-gray-500">(Rating: {player.rating})</span>
                </span>
                <button
                  onClick={() => handleEditClick(player)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded shadow"
                >
                  Edit
                </button>
              </div>

              {selectedPlayer?.id === player.id && (
                <div className="mt-4 bg-white p-6 rounded shadow-md border">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Editing: {selectedPlayer.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Name", name: "name" },
                      { label: "Rating", name: "rating", type: "number" },
                      { label: "Matches", name: "matches", type: "number" },
                      { label: "Forehand Rubber", name: "forehand_rubber" },
                      { label: "Backhand Rubber", name: "backhand_rubber" },
                      { label: "Blade", name: "blade" },
                      { label: "Age", name: "age", type: "number" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-600">
                          {field.label}
                        </label>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          value={editData[field.name] ?? ""}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Handedness
                      </label>
                      <select
                        name="handedness"
                        value={editData.handedness || ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Left">Left</option>
                        <option value="Right">Right</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={editData.gender ?? ""}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
