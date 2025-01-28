import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import KocsMateLogo from "./KocsMateLogo";
export default function PassReset() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { token } = router.query; //A token a query paraméterből érkezik
  async function resetPassword(
    token: string | string[] | undefined,
    newPassword: string
  ) {
    setError("");
    const response = await fetch("/api/auth/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "reset-password",
        token,
        newPassword,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
    } else {
      router.push("/login");
      alert("Sikeres jelszóváltozás!");
      setError("");
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+/;
    if (!passwordPattern.test(newPassword) || newPassword.length < 8) {
      setError(
        "A jelszónak legalább 8 karakterből kell lennie, valamint legalább egy kisbetű, egy nagybetű, egy szám, egy speciális karakter!"
      );
      return;
    }
    if (!token) {
      return;
    }
    await resetPassword(token, newPassword);
  };

  return (
    <div className="flex flex-col items-center">
      <KocsMateLogo />
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="password"
          placeholder="Új jelszó"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="cursor-pointer">
          Jelszó módosítása
        </button>
        <div className="mt-4">{error && error}</div>{" "}
        {/* valami szebb megjelenítés a hibáknak */}
      </form>
    </div>
  );
}
