import type { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { AuthContextType } from "../../type";
import KocsMateLogo from "../components/KocsMateLogo";
import Login from "../components/login";
import { AuthContext } from "../utils/providers/AuthContext";

export const Home: NextPage = () => {
  const { user, isRegistered } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="text-2xl flex flex-col items-center">
      {user && isRegistered && (
        <>
          <KocsMateLogo />
          <h1 className="">Na helló, helló!</h1>
          {/* térkép és további*/}
        </>
      )}
      <>
        {/* <KocsMateLogo /> */}
        {!isRegistered && (
          <>
            <Login />
            <Link href="/register" className="mt-4">
              Nem regisztrált még?
            </Link>
          </>
        )}
      </>
    </div>
  );
};

export default Home;
