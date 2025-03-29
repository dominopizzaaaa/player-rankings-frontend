export default function TournamentMatchForm({ match, playerNames, onSubmit }) {
  return (
    <form
      id={`match-form-${match.id}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(match);
      }}
      className="mt-2 space-y-2"
    >
      <div className="flex items-center gap-2">
        <input
          name="player1_score"
          type="number"
          className="border p-1 rounded w-14"
          placeholder="P1 Score"
          required
        />
        <span>-</span>
        <input
          name="player2_score"
          type="number"
          className="border p-1 rounded w-14"
          placeholder="P2 Score"
          required
        />
        <select name="winner_id" className="border p-1 rounded" required>
          <option value="">Winner</option>
          <option value={match.player1_id}>{playerNames[match.player1_id]}</option>
          <option value={match.player2_id}>{playerNames[match.player2_id]}</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
      >
        Submit
      </button>
    </form>
  );
}
