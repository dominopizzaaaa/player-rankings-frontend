// Base URL for API requests
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ✅ Helper function to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

// ✅ Fetch all players
export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/players`);
    if (!response.ok) throw new Error(`Failed to fetch players: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

// ✅ Fetch all matches
export const fetchMatches = async () => {
  try {
    const response = await fetch(`${BASE_URL}/matches`);
    if (!response.ok) throw new Error(`Failed to fetch matches: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

// ✅ Add a new player (Admin only)
export const addPlayer = async (playerData) => {
  try {
    const response = await fetch(`${BASE_URL}/players`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData),
    });

    if (!response.ok) throw new Error(`Failed to add player: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Error adding player:", error);
    return null;
  }
};

// ✅ Delete a player (Admin only)
export const deletePlayer = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/players/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to delete player: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Error deleting player:", error);
    return null;
  }
};

// ✅ Delete a match (Admin only)
export const deleteMatch = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/matches/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to delete match: ${response.statusText}`);

    alert("Match deleted successfully!"); // ✅ Success message
    window.location.reload(); // ✅ Refresh the page after deletion

    return await response.json();
  } catch (error) {
    console.error("Error deleting match:", error);
    alert("Failed to delete match. Please try again."); // ✅ Error message
    return null;
  }
};


// ✅ Update a player (Admin only)
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await fetch(`${BASE_URL}/players/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData),
    });

    if (!response.ok) throw new Error(`Failed to update player: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Error updating player:", error);
    return null;
  }
};

// ✅ Update a match (Admin only)
export const updateMatch = async (id, matchData) => {
  try {
    const response = await fetch(`${BASE_URL}/matches/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(matchData),
    });

    if (!response.ok) throw new Error(`Failed to update match: ${response.statusText}`);

    return await response.json();
  } catch (error) {
    console.error("Error updating match:", error);
    return null;
  }
};

export async function getTournaments() {
  const res = await fetch(`${API_BASE}/tournaments`);
  return res.json();
}

export const createTournament = async (tournamentData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,  // Only if your route is admin-protected
    },
    body: JSON.stringify(tournamentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create tournament");
  }

  return await response.json();
};


// ✅ Login user and store token
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error(`Login failed: ${response.statusText}`);

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};

// ✅ Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};
