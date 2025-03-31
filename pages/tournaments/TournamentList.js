import Link from "next/link";

const TournamentList = ({ tournaments }) => {
  return (
    <div className="grid gap-4">
      {tournaments.map((tournament) => (
        <div key={tournament.id} className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold">{tournament.name}</h3>
          <p className="text-sm text-gray-600">Date: {tournament.date}</p>
          <Link
            href={`/tournaments/${tournament.id}`}
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TournamentList;
