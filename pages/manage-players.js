import { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import { Container, Form, Button, Table } from "react-bootstrap";
import { isAdmin } from "../utils/auth"; // ✅ Import auth check
import { useRouter } from "next/router";

const ManagePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [handedness, setHandedness] = useState("");
  const [forehandRubber, setForehandRubber] = useState("");
  const [backhandRubber, setBackhandRubber] = useState("");
  const [blade, setBlade] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin()) {
      router.push("/"); // ✅ Redirect non-admin users to leaderboard
    }
  }, []);

  const fetchPlayers = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`)
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

    // ✅ Retrieve the authentication token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in as an admin to add a player.");
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  // ✅ Send token in headers
            },
            body: JSON.stringify(newPlayer),
        });

        if (!response.ok) {
            if (response.status === 401) {
                alert("Unauthorized! Please log in.");
                window.location.href = "/login";  // ✅ Redirect to login page
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert("Player added successfully!");

        // ✅ Reset input fields
        setName("");
        setHandedness("");
        setForehandRubber("");
        setBackhandRubber("");
        setBlade("");
        setAge("");
        setGender("");

        fetchPlayers();  // ✅ Refresh player list after adding
    } catch (error) {
        console.error("Error adding player:", error);
        alert("Failed to add player. Please try again.");
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
