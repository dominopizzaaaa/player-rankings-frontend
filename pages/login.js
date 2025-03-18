import { useState } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: "admin",
        password: "admin123"
      })
    });
  
    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "/"; // Redirect after login
    } else {
      alert("Invalid login");
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Admin Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control mb-2"/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2"/>
      <button onClick={handleLogin} className="btn btn-primary">Login</button>
    </div>
  );
};

export default Login;
