import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub } from "../../../prisma/prisma/generated/client";
import DisplayPubInfo from "../../components/dashboard/sections/home/displaypubinfo";
import Sidebar from "../../components/dashboard/sidebar";
import { AuthContext } from "../../utils/providers/AuthContext";

const Home: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<Pub | null>(null);

  if (!authContext) {
    return;
  }
  const { user } = authContext;

  useEffect(() => {
    if (!user || !user.business) {
      router.push("/"); // Ha nincs business jog, átirányítjuk a főoldalra
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.id) {
      // API hívás a pub adatainak lekérésére
      fetch(`/api/getAdminPub?adminId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.pub) {
            setPubData(data.pub);
          } else {
            console.error("Nincs pub adat");
          }
        })
        .catch((error) => console.error("Error fetching pub data:", error));
    }
  }, [user]);
  // Ha a pubData vagy a user nem töltődött be, akkor visszatérünk egy "Loading..." szöveggel
  if (!user || !pubData) return <p>Loading...</p>;

  return (
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
          <DisplayPubInfo pubData={pubData} updatePubData={setPubData} />
        </div>
      </div>
    </>
  );
};

export default Home;
