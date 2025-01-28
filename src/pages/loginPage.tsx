import Link from "next/link";
import KocsmateLogo from "../components/web/KocsMateLogo";
import { components, indexStyle } from "../styles/styles";

const LoginPage: React.FC = () => {
  return (
    <div className="m-10 flex flex-col items-center">
      <KocsmateLogo />
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
            <button className={`${components.button.homePageButton}`}>
              {text}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
