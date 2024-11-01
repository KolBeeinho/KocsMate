import { FormEvent, useState } from "react";
import KocsMateLogo from "./KocsMateLogo";

export default function Register() {
  //#region Fields
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [full_name, setFullName] = useState<string>("");
  //#endregion
  const [error, setError] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullNamePattern =
      /^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+ [A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+$/;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+/;

    const errors: Array<string> = [];

    if (!username) errors.push("Hiányzó felhasználónév!");
    if (!email) errors.push("Hiányzó email-cím!");
    if (!password) errors.push("Hiányzó jelszó!");
    if (!full_name) errors.push("Hiányzó teljes név!");
    if (!fullNamePattern.test(full_name))
      errors.push("A teljes név nem megfelelő!");
    if (password.length < 8 || !passwordPattern.test(password))
      errors.push(
        "A jelszónak legalább 8 karakterből kell lennie, valamint legalább egy kisbetű, egy nagybetű, egy szám, egy speciális karakter!"
      );
    if (errors.length > 0) {
      setError(errors.join(" "));
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, full_name }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        console.log("Sikeres regisztráció!");
        window.location.href = "/";
      } else {
        const data = await res.json();
        console.error("Sikertelen regisztráció!", data.error);
        setError(data.error || "Sikertelen regisztráció");
      }
    } catch (err) {
      console.error(err);
      setError("Hiba történt a regisztráció során.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <KocsMateLogo />
      <form
        onSubmit={handleRegister}
        className="flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
      >
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">
            Felhasználónév:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-glaucous rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be a felhasználóneved..."
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">
            Teljes név:
          </label>
          <input
            type="text"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border border-glaucous rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be a teljes neved..."
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-glaucous rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be az e-mail címed..."
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">Jelszó:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-glaucous rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be a jelszavad..."
          />
        </div>
        {error && <p className="text-dark-red mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full disabled:bg-slate-600 bg-butter-scotch font-bold py-2 rounded-md hover:bg-glaucous transition duration-300"
        >
          {loading ? "Folyamatban..." : "Regisztráció"}
          {/* Ide majd animáció is mehetne */}
        </button>
      </form>
    </div>
  );
}
