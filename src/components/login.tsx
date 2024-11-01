import { signIn } from "next-auth/react"; // NextAuth bejelentkező függvény
import { FormEvent, useState } from "react";
import GoogleLoginButton from "./GoogleLogin";
import KocsMateLogo from "./KocsMateLogo";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const no_google_button = document.getElementById("login_no_google");
    if (e.target !== no_google_button) {
      return;
    }
    if (!username) {
      setError("Hiányzik a felhasználónév!");
      return;
    }
    if (!password) {
      setError("Hiányzik a jelszó!");
      return;
    }
    // NextAuth bejelentkezés
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      console.error("Sikertelen bejelentkezés!", result.error);
      setError(result.error);
    } else {
      console.log("Sikeres bejelentkezés!");
      window.location.href = "/search";
    }
  };

  return (
    <>
      <KocsMateLogo />
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto gap-4"
      >
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">
            Felhasználónév:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-glaucous text-black rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be a felhasználóneved..."
          />
        </div>
        <div className="mb-4 w-full">
          <label className="block text-betu_szin text-lg mb-2">Jelszó:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-glaucous text-black rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch"
            placeholder="Írd be a jelszavad..."
          />
        </div>
        {error && <p className="text-dark-red mb-4 text-center">{error}</p>}
        <button
          type="submit"
          id="login_no_google"
          className="w-full bg-butter-scotch font-bold py-2 rounded-md hover:bg-glaucous transition duration-300"
        >
          Bejelentkezés
        </button>
        <GoogleLoginButton />
      </form>
    </>
  );
}
