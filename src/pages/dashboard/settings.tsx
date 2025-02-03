import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub } from "../../../prisma/prisma/generated/client";
import DisplayPubInfo from "../../components/dashboard/sections/home/displaypubinfo";
import Sidebar from "../../components/dashboard/sidebar";
import { AuthContext } from "../../utils/providers/AuthContext";

const Settings: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<Pub | null>(null);

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
          setPubData(data.pub);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  const updatePubData = async (updatedData: Pub) => {
    try {
      const response = await fetch("/api/updatePub", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      if (result.success) {
        setPubData(result.pub);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user || !pubData) return <p>Loading...</p>;

  return (
    <div className="md:grid md:grid-flow-col" id="dashboard">
      <Sidebar />
      <div className="mx-4 flex flex-col space-y-8 md:mt-[80px] md:ml-[100px] lg:flex-row lg:space-y-0 lg:space-x-10 xl:space-x-12">
        <DisplayPubInfo pubData={pubData} updatePubData={updatePubData} />
      </div>
    </div>
  );
};
export default Settings;
