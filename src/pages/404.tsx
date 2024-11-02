import Link from "next/link";
import React from "react";
import KocsMateLogo from "../components/KocsMateLogo";

const Custom404: React.FC = () => {
  return (
    <div className="flex items-center flex-col">
      <h1 style={{ fontSize: "72px" }}>404</h1>
      <h2>OOPS! Az oldal nem található.</h2>
      <Link href="/">
        <button className="w-full bg-butter-scotch font-bold p-2 mt-4 rounded-md hover:bg-glaucous transition duration-300 max-w-60">
          Vissza a főoldalra
        </button>
      </Link>
      <div>
        <KocsMateLogo />
      </div>
    </div>
  );
};

export default Custom404;
