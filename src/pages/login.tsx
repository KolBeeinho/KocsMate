import type { NextPage } from "next";
// import { useRouter } from "next/router";
// import { useContext, useEffect } from "react";
import Login from "../components/web/login";
// import { AuthContext } from "../utils/providers/AuthContext";
// import Search from "./search";

export const login: NextPage = () => {
  //Loginhoz
  // const authContext = useContext(AuthContext);
  // const router = useRouter();
  // if (!authContext) {
  //   console.error("Nem lehet bejelentkezni!");
  //   return null;
  // }
  // const { user } = authContext;
  // useEffect(() => {
  //   if (user) {
  //     router.push("/search");
  //   }
  // }, [user, router]);
  // console.log(user?.id);
  // return <>{!user ? <Login /> : <Search />}</>;
  //egyszerűbb
  //
  return <Login />;
};
export default login;
