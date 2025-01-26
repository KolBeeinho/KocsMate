import type { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import KocsMateLogo from "../components/KocsMateLogo";
import IndexMobile from "../components/mobile/indexMobile";
import { components, indexStyle } from "../styles/styles";
import isMobile from "../utils/checkOS";
import { AuthContext } from "../utils/providers/AuthContext";
export const Home: NextPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("Authentikációs hiba");
    return null;
  }
  // console.info("Aktív felhasználó: " + user); //Teszt
  return (
    <>
      {isMobile() ? (
        <IndexMobile />
      ) : (
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
                <Link
                  key={index}
                  href={href}
                  className={`${indexStyle.buttons}`}
                >
                  <button className={`${components.button.homePageButton}`}>
                    {text}
                  </button>
                </Link>
              ))}
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Home;
