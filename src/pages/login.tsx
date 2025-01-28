import type { NextPage } from "next";
import Login from "../components/web/login";

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
  //     router.push("/");
  //   }
  // }, [user, router]);
  // return <Login />;
  //egyszerűbb
  //
  return <Login />;
};
export default login;
