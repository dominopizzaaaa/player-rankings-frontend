import React, { useState } from 'react';
import { createTournament } from '../utils/api';

export default function CreateTournamentForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    num_players: 0,
    num_groups: 0,
    knockout_size: 0,
    grouping_mode: 'ranked'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTournament(form);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <input name="name" placeholder="Tournament Name" onChange={handleChange} className="w-full p-2 border" />
      <input type="date" name="date" onChange={handleChange} className="w-full p-2 border" />
      <input type="number" name="num_players" placeholder="Number of Players" onChange={handleChange} className="w-full p-2 border" />
      <input type="number" name="num_groups" placeholder="Number of Groups" onChange={handleChange} className="w-full p-2 border" />
      <input type="number" name="knockout_size" placeholder="Knockout Size (e.g. 4, 8, 16)" onChange={handleChange} className="w-full p-2 border" />
      <select name="grouping_mode" onChange={handleChange} className="w-full p-2 border">
        <option value="ranked">Ranked</option>
        <option value="random">Random</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Tournament</button>
    </form>
  );
}

