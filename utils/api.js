const BASE_URL = "https://player-rankings-backend.onrender.com";

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