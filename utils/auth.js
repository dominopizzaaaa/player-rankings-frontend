export const isAdmin = () => {
  const token = localStorage.getItem("token"); // Fetch stored token
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    return payload.role === "admin"; // Check if user is admin
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

