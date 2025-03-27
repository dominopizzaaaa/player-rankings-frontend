import React, { useEffect, useState } from 'react';
import { getTournaments } from '../../utils/api';
import { isAdmin } from '../../utils/auth';
import TournamentList from '../../components/TournamentList';
import CreateTournamentForm from '../../components/CreateTournamentForm';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);

  const fetchData = async () => {
    const data = await getTournaments();
    setTournaments(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Tournaments</h1>
      {isAdmin() && <CreateTournamentForm onSuccess={fetchData} />}
      <TournamentList tournaments={tournaments} />
    </div>
  );
}