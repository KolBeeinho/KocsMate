import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub } from "../../../prisma/prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DeleteConfirm from "../../components/dashboard/DeleteConfim";
import { AuthContext } from "../../utils/providers/AuthContext";
import pubStates from "../../utils/pubStates";

const PubSettings: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<Pub | null>(null);
  const [pubState, setPubState] = useState<string>("func");
  const [isConfirming, setIsConfirming] = useState<boolean>(false); // A megerősítő logika állapota

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = event.target.value;
    setPubState(newState);
    setIsConfirming(true);
  };

  const handleConfirmChange = () => {
    fetch(`/api/updatePubState`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pubData?.id, state: pubState }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Sikertelen állapot frissítés");
        }
        return res.json();
      })
      .then(() => {
        setIsConfirming(false);
      })
      .catch((error) => {
        console.error("Error updating pub state:", error);
        setIsConfirming(false);
      });
  };

  const handleCancelChange = () => {
    setIsConfirming(false);
    setPubState(pubData?.state || "func");
  };

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
          setPubState(data.pub?.state || "func"); // Betöltés után állapot beállítása
        })
        .catch((error) => console.error(error));
    }
  }, [user]);
  if (!user || !pubData) return <p>Loading...</p>;
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
                {pubStates("func")}
              </option>
              <option value="t_closed" className="text-yellow-500">
                {pubStates("t_closed")}
              </option>
              <option value="closed" className="text-red-500">
                {pubStates("closed")}
              </option>
            </select>
          </div>
        </div>
        {isConfirming && (
          <DeleteConfirm
            onConfirm={handleConfirmChange}
            onCancel={handleCancelChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PubSettings;
