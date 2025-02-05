import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Product, Pub } from "../../../prisma/prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DisplayPubInfo from "../../components/dashboard/sections/home/displaypubinfo";
import { AuthContext } from "../../utils/providers/AuthContext";

const Home: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<
    (Pub & { products?: Product[] }) | null
  >(null);

  if (!authContext) {
    return;
  }
  const { user } = authContext;

  useEffect(() => {
    if (!user || !user.business) {
      router.push("/");
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
  if (!user || !pubData) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <DisplayPubInfo pubData={pubData} updatePubData={setPubData} />
    </DashboardLayout>
  );
};

export default Home;
