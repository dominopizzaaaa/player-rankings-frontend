// Base URL for API requests
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

console.log("🔍 Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log("🔍 BASE_URL", BASE_URL);

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
    const response = await fetch(`${BASE_URL}/players/`);
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
    const response = await fetch(`${BASE_URL}/matches/`);
    if (!response.ok) throw new Error(`Failed to fetch matches: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

// ✅ Add a new player (Admin only)
export const addPlayer = async (playerData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/players/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(playerData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add player: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

// ✅ Delete a player (Admin only)
export const deletePlayer = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/players/${id}/`, {
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
    const response = await fetch(`${BASE_URL}/matches/${id}/`, {
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

export const addMatch = async (matchData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/matches/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(matchData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to add match: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

// ✅ Update a player (Admin only)
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await fetch(`${BASE_URL}/players/${id}/`, {
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
    const response = await fetch(`${BASE_URL}/matches/${id}/`, {
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
  const res = await fetch(`${BASE_URL}/tournaments/`);
  return res.json();
}

export const createTournament = async (tournamentData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/tournaments/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(tournamentData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Tournament creation error:", error);
    throw new Error(JSON.stringify(error));
  }

  return await response.json();
};

// ✅ Login user and store token
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Invalid login");

    localStorage.setItem("token", data.access_token);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// ✅ Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ✅ Fetch tournament details
export async function getTournamentDetails(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/details`);
  if (!res.ok) throw new Error("Failed to fetch tournament details");
  return await res.json();
}

// ✅ Submit a match result
export async function submitMatchResult(matchId, result) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/matches/${matchId}/result`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(result),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to submit match result");
  }

  return await res.json();
}

export const resetTournament = async (tournamentId) => {
  try {
    const response = await fetch(`${BASE_URL}/tournaments/${tournamentId}/reset/`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error(`Failed to reset tournament: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error resetting tournament:", error);
    return null;
  }
};

// ✅ Create a customized tournament (Admin only)
export const createCustomTournament = async (customTournamentData) => {
  try {
    const response = await fetch(`${BASE_URL}/tournaments/custom/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(customTournamentData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Custom tournament creation error:", error);
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating custom tournament:", error);
    throw error;
  }
};

// ✅ Delete a tournament (Admin only)
export const deleteTournament = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tournaments/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`Failed to delete tournament: ${res.statusText}`);
    return true;
  } catch (err) {
    console.error("Error deleting tournament:", err);
    throw err;
  }
};
