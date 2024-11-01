import type { NextPage } from "next";
import KocsMateLogo from "../components/KocsMateLogo";
export const Home: NextPage = () => {
  return (
    <div className="flex">
      <KocsMateLogo />
      <h1 className="">Na helló, helló!</h1>
    </div>
  );
};

export default Home;
