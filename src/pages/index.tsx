import type { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import KocsMateLogo from "../components/KocsMateLogo";
import { components, indexStyle } from "../styles/styles";
import { AuthContext } from "../utils/providers/AuthContext";

export const Home: NextPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("Authentikációs hiba");
    return null;
  }

  const { user } = authContext;

  // console.info("Aktív felhasználó: " + user); //Teszt
  return (
    <div className={`${indexStyle.parent}`}>
      <>
        <KocsMateLogo />
        <div className={`${indexStyle.container}`}>
          {[
            //más fájlba
            { href: "/login", text: "Bejelentkezek" },
            { href: "/register", text: "Nem regisztrált még?" },
            {
              href: "/eula",
              text: "Olvassa el adatvédelmi tájékoztatónkat!",
            },
          ].map(({ href, text }, index) => (
            <Link key={index} href={href} className={`${indexStyle.buttons}`}>
              <button className={`${components.button}`}>{text}</button>
            </Link>
          ))}
        </div>
      </>
    </div>
  );
};

export default Home;
