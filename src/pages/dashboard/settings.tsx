import { NextPage } from "next";
import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DeleteConfirm from "../../components/dashboard/DeleteConfim";
import { usePubContext } from "../../utils/providers/DashboardContext";
import pubStates from "../../utils/pubStates";

const PubSettings: NextPage = () => {
  const pubContext = usePubContext();
  if (!pubContext) {
    return <p>Loading...</p>;
  }
  const { pubData, pubState, setPubState } = pubContext;

  const [isConfirming, setIsConfirming] = useState<boolean>(false); //A megerősítő logika állapota

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
    setPubState(pubData?.state || "func"); // visszaállítjuk a korábbi állapotot
  };

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
