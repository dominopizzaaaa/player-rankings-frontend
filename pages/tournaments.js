import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "../components/Navbar";
import CreateTournamentForm from "../components/CreateTournamentForm";
import TournamentList from "../components/TournamentList";
import { isAdmin } from "../utils/auth";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [admin, setAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/");  // Redirect to home if not admin
    } else {
      setAdmin(true);
    }
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

        {admin && <CreateTournamentForm onCreate={refreshTournaments} />}
        <TournamentList tournaments={tournaments} onTournamentClick={(id) => router.push(`/tournaments/${id}`)} />
      </div>
    </div>
  );
}
