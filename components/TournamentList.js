import React from 'react';

export default function TournamentList({ tournaments }) {
  if (!tournaments?.length) return <p>No tournaments yet.</p>;

  return (
    <div className="space-y-4">
      {tournaments.map(t => (
        <div key={t.id} className="border rounded p-4 shadow">
          <h3 className="text-lg font-semibold">{t.name}</h3>
          <p>Date: {new Date(t.date).toLocaleDateString()}</p>
          <p>Players: {t.num_players}</p>
          <p>Groups: {t.num_groups}</p>
          <p>Knockout size: {t.knockout_size}</p>
          <p>Grouping: {t.grouping_mode}</p>
        </div>
      ))}
    </div>
  );
}
