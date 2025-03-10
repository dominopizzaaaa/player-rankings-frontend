import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Elo Rankings</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/matches" className="hover:text-gray-300">Matches</Link>
          <Link href="/manage-players" className="hover:text-gray-300">Add Player</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
