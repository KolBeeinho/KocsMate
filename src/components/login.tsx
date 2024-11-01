// components/Login.tsx
import { FormEvent, useState } from "react";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      console.log("Login successful");
    } else {
      const data = await res.json();
      console.error("Sikertelen bejelentkezés!", data.error);
      setError(data.error || "Sikertelen bejelentkezés");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Felhasználónév:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Jelszó:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-[var(--dark-red)]">{error}</p>}
      <button type="submit">Bejelentkezés</button>
    </form>
  );
}
