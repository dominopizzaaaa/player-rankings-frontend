import { useEffect, useState } from "react";
import CustomNavbar from "../../components/Navbar";
import { useRouter } from "next/router";

const AddPlayers = () => {
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState("");
  const [forehandRubber, setForehandRubber] = useState("");
  const [backhandRubber, setBackhandRubber] = useState("");
  const [blade, setBlade] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.push("/");
    }
  }, []);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    const newPlayer = {
      name,
      handedness,
      forehand_rubber: forehandRubber,
      backhand_rubber: backhandRubber,
      blade,
      age: age ? parseInt(age) : null,
      gender,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlayer),
      });
      if (!res.ok) throw new Error();
      alert("✅ Player added!");
      setName(""); setHandedness(""); setForehandRubber(""); setBackhandRubber(""); setBlade(""); setAge(""); setGender("");
    } catch (err) {
      console.error(err);
      alert("Failed to add player.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <CustomNavbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            ➕ Add New Player
          </h2>

          <form onSubmit={handleAddPlayer} className="grid gap-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="text-sm font-semibold">Player Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Ma Long"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Handedness</label>
              <select
                value={handedness}
                onChange={(e) => setHandedness(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select</option>
                <option value="Right">Right</option>
                <option value="Left">Left</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">Forehand Rubber</label>
              <input
                type="text"
                value={forehandRubber}
                onChange={(e) => setForehandRubber(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Tenergy 05"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Backhand Rubber</label>
              <input
                type="text"
                value={backhandRubber}
                onChange={(e) => setBackhandRubber(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Dignics 09C"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Blade</label>
              <input
                type="text"
                value={blade}
                onChange={(e) => setBlade(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Viscaria"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 25"
              />
            </div>

            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
              >
                Add Player
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlayers;