import { FormEvent, useState } from "react";
import KocsMateLogo from "./KocsMateLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  async function requestPasswordReset(email: string) {
    const response = await fetch("/api/auth/passreset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "request-reset",
        email,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      alert("E-mail sikeresen elküldve!");
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await requestPasswordReset(email);
  };

  return (
    <div className="flex flex-col items-center">
      <KocsMateLogo />
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="cursor-pointer">
          Jelszó visszaállítása
        </button>
        <div className="mt-4">{error && error}</div>
        {/* valami szebb megjelenítés a hibáknak */}
      </form>
    </div>
  );
}
