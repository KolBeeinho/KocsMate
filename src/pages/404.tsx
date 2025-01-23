import Link from "next/link";
import React from "react";
import KocsMateLogo from "../components/KocsMateLogo";
import { Style404 } from "../styles/styles";
const Custom404: React.FC = () => {
  return (
    <div className={`${Style404.container}`}>
      <h1 style={{ fontSize: "72px" }}>404</h1>
      <h2>OOPS! Az oldal nem található.</h2>
      <Link href="/">
        <button className={`${Style404.link}`}>Vissza a főoldalra</button>
      </Link>
      <div>
        <KocsMateLogo />
      </div>
    </div>
  );
};

export default Custom404;
