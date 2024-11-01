import { signIn } from "next-auth/react";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <button
      onClick={handleLogin}
      className="btn-google p-4 w-full disabled:bg-slate-600 bg-butter-scotch font-bold py-2 rounded-md hover:bg-glaucous transition duration-300"
    >
      Bejelentkezés Google-lel
    </button>
  );
};

export default GoogleLoginButton;
