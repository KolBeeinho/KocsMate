import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub } from "../../../prisma/prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { AuthContext } from "../../utils/providers/AuthContext";

const PubSettings: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<Pub | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pubState, setPubState] = useState<string>("func");

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  useEffect(() => {
    if (!user || !user.business) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetch(`/api/getPub?adminId=${user.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Sikertelen adatlekérés");
          }
          return res.json();
        })
        .then((data) => {
          setPubData(data.pub);
          setPubState(data.pub?.state || "func"); // Betöltés után állapot beállítása
        })
        .catch((error) => console.error("Error fetching pub data:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setPubState(newState);

    fetch(`/api/updatePubState`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pubData?.id, state: newState }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Sikertelen állapot frissítés");
        }
        return res.json();
      })
      .catch((error) => console.error("Error updating pub state:", error));
  };

  if (loading || !pubData) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Beállítások</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="pub-state"
              className="block text-lg font-medium mb-2"
            >
              Pub Állapot
            </label>
            <select
              id="pub-state"
              value={pubState}
              onChange={handleStateChange}
              className="block w-full p-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            >
              <option value="func" className="text-green-500">
                Üzemel
              </option>
              <option value="t_closed" className="text-yellow-500">
                Átmenetileg zárva
              </option>
              <option value="closed" className="text-red-500">
                Végleg bezárt
              </option>
            </select>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PubSettings;
