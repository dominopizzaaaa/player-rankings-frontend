import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../../components/Navbar";
import CreateTournamentForm from "./CreateTournamentForm";
import CreateCustomTournamentForm from "./CreateCustomTournamentForm"; // 👈 New import
import TournamentList from "./TournamentList";
import { isAdmin } from "../../utils/auth";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false); // 👈 Toggle for forms
  const router = useRouter();

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments`)
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .catch((err) => console.error("Failed to load tournaments", err));
  }, []);

  const refreshTournaments = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments`)
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CustomNavbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Tournaments</h2>

        {admin && (
          <>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowCustomForm(false)}
                className={`px-4 py-2 rounded ${
                  !showCustomForm ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                Standard Tournament
              </button>
              <button
                onClick={() => setShowCustomForm(true)}
                className={`px-4 py-2 rounded ${
                  showCustomForm ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}
              >
                Customized Tournament
              </button>
            </div>

            {showCustomForm ? (
              <CreateCustomTournamentForm onCreated={refreshTournaments} />
            ) : (
              <CreateTournamentForm onCreated={refreshTournaments} />
            )}
          </>
        )}

        <TournamentList
          tournaments={tournaments}
          onTournamentClick={(id) => router.push(`/tournaments/${id}`)}
          onDelete={refreshTournaments}
        />
      </div>
    </div>
  );
}
