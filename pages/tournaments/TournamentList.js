import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdmin } from "../../utils/auth";

const TournamentList = ({ tournaments, onDelete }) => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
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

  return (
    <div className="grid gap-4">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">{tournament.name}</h3>
            <p className="text-sm text-gray-600">Date: {tournament.date}</p>
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
      ))}
    </div>
  );
};

export default TournamentList;
