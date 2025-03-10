import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import { Table, Container } from "react-bootstrap";

const Home = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("https://player-rankings-backend.onrender.com/players")
      .then((response) => response.json())
      .then((data) => {
        const sortedPlayers = data.sort((a, b) => b.rating - a.rating);
        setPlayers(sortedPlayers);
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-4 d-flex justify-content-center">
        <div className="text-center w-100">
          <h2 className="mb-4">🏆 Player Leaderboard</h2>
          <Table striped bordered hover className="mx-auto text-center" style={{ width: "60%" }}>
            <thead className="bg-primary text-white">
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Player ID</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id}>
                  <td className="fw-bold">{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.id}</td>
                  <td>{player.rating}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>

    </div>
  );
};

export default Home;
