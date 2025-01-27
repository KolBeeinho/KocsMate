import type { NextPage } from "next";
import { useContext } from "react";
import IndexMobile from "../components/mobile/indexMobile";
import AppleLogo from "../components/web/AppleLogo";
import GoogleLogo from "../components/web/GoogleLogo";
import KocsMateLogo from "../components/web/KocsMateLogo";
import { indexStyle } from "../styles/styles";
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
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center space-y-4 justify-center">
                <h2 className=" pr-9">
                  A legjobb kocsmák <br />
                  Számodra
                </h2>
                <div className=" flex flex-row items-center space-x-12">
                  <GoogleLogo />
                  <AppleLogo />
                </div>
                <p className="pl-9">
                  Serfeze arpad megette a leveset amicko s orozobe ment de
                  tomshelbi nanditol kert gyujtot
                </p>
              </div>

              <div className="flex justify-center items-center">
                <KocsMateLogo />
              </div>
            </div>

            {/*
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
            */}
          </>
        </div>
      )}
    </>
  );
};

export default Home;
