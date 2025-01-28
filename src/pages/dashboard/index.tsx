import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import HomeJFWCoin from "../../components/dashboard/sections/home/HomeJFWCoin";
import HomeNFTSale from "../../components/dashboard/sections/home/HomeNFTSale";
import Sidebar from "../../components/dashboard/sidebar";
import { AuthContext } from "../../utils/providers/AuthContext";
const Home: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  if (!authContext) {
    return;
  }
  const { user } = authContext;
  console.log(user, user?.business);
  useEffect(() => {
    if (!user || !user.business) {
      router.push("/");
    }
  }, [user, router]);
  return (
    <>
      {user ? (
        <>
          <Head>
            <title>KocsMate Dashboard</title>
            <meta name="title" content="JFW Dashboard" />
            <meta name="description" content="Minting Dashboard" />
            <meta charSet="utf-8" />
            <meta
              name="keywords"
              content="nft, cnft, cardano, junk food, Junk Food War, JFW"
            />
            <meta name="robots" content="all" />
            <meta httpEquiv="Content-Type" content="text/html;" />
            <meta name="viewport" content="initial-scale=1.0" />
            <meta name="language" content="English" />
          </Head>
          <div className="md:grid md:grid-flow-col" id="dashboard">
            <Sidebar />
            <div className="mx-4 flex flex-col space-y-8 md:mt-[80px] md:ml-[100px] lg:flex-row lg:space-y-0 lg:space-x-10 xl:space-x-12">
              <HomeJFWCoin />
              <HomeNFTSale />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
export default Home;
