import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import { Container, Form, Button, Table } from "react-bootstrap";

const ManagePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState("");
  const [forehandRubber, setForehandRubber] = useState("");
  const [backhandRubber, setBackhandRubber] = useState("");
  const [blade, setBlade] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const fetchPlayers = () => {
    fetch("https://player-rankings-backend.onrender.com/players")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Player name is required!");
      return;
    }

    const newPlayer = {
      name,
      handedness,
      forehand_rubber: forehandRubber,
      backhand_rubber: backhandRubber,
      blade,
      age: age ? parseInt(age) : null,
      gender,
    };

    try {
      const response = await fetch("https://player-rankings-backend.onrender.com/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlayer),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Player added successfully!");
      setName("");
      setHandedness("");
      setForehandRubber("");
      setBackhandRubber("");
      setBlade("");
      setAge("");
      setGender("");
      fetchPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <Container className="mt-4">
        <h2 className="text-center mb-4">➕ Add New Player</h2>
        <Form onSubmit={handleAddPlayer} className="bg-light p-4 rounded shadow">
          <Form.Group className="mb-3">
            <Form.Label>Player Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hand</Form.Label>
            <Form.Select value={handedness} onChange={(e) => setHandedness(e.target.value)}>
              <option value="">Select Playing Hand</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Forehand Rubber</Form.Label>
            <Form.Control type="text" value={forehandRubber} onChange={(e) => setForehandRubber(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Backhand Rubber</Form.Label>
            <Form.Control type="text" value={backhandRubber} onChange={(e) => setBackhandRubber(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Blade</Form.Label>
            <Form.Control type="text" value={blade} onChange={(e) => setBlade(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Gender</Form.Label>
          <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

          <Button variant="primary" type="submit">
            Add Player
          </Button>

        </Form>


      </Container>
    </div>
  );
};

export default ManagePlayers;
