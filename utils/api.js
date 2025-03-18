// const BASE_URL = "https://player-rankings-backend.onrender.com";
const BASE_URL = "http://127.0.0.1:8000";

export const fetchPlayers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/players`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
};

export const fetchMatches = async () => {
  try {
    const response = await fetch(`${BASE_URL}/matches`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
};

export const deletePlayer = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/players/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete player: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting player:", error);
    return null;
  }
};

export const deleteMatch = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/matches/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete match: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting match:", error);
    return null;
  }
};

export const updatePlayer = async (id, playerData) => {
  try {
    await fetch(`${BASE_URL}/players/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });
  } catch (error) {
    console.error("Error updating player:", error);
  }
};

export const updateMatch = async (id, matchData) => {
  try {
    await fetch(`${BASE_URL}/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matchData),
    });
  } catch (error) {
    console.error("Error updating match:", error);
  }
};
