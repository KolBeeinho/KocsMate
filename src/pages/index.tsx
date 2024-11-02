import type { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import KocsMateLogo from "../components/KocsMateLogo";
import { styles } from "../styles/styles";
import { AuthContext } from "../utils/providers/AuthContext";

export const Home: NextPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("Authentikációs hiba");
    return null;
  }

  const { user } = authContext;

  console.log("Aktív felhasználó: " + user); //Teszt
  return (
    <div className="text-2xl flex flex-col items-center">
      <>
        <KocsMateLogo />
        <div className="flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto gap-4">
          {[
            { href: "/login", text: "Bejelentkezek" },
            { href: "/register", text: "Nem regisztrált még?" },
            {
              href: "/eula",
              text: "Olvassa el adatvédelmi tájékoztatónkat!",
            },
          ].map(({ href, text }, index) => (
            <Link key={index} href={href} className="mt-4">
              <button className={`${styles.button.tailwind}`}>{text}</button>
            </Link>
          ))}
        </div>
      </>
    </div>
  );
};

export default Home;
