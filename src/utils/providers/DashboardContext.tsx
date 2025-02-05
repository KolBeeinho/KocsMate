import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Product, Pub } from "../../../prisma/prisma/generated/client";
import { AuthContext } from "../../utils/providers/AuthContext";

interface PubContextProps {
  pubData: any; // A pubData típusát pontosítani kell, pl. Pub
  pubState: string;
}

interface DashboardContextProps {
  children: ReactNode;
}

const PubContext = createContext<PubContextProps | undefined>(undefined);

export const PubProvider: React.FC<DashboardContextProps> = ({ children }) => {
  const [pubData, setPubData] = useState<
    (Pub & { products?: Product[] }) | null
  >(null);
  const [pubState, setPubState] = useState<string>("func");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/getAdminPub?adminId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPubData(data.pub);
          setPubState(data.pub?.state || "func"); //ez kérdőjeles, mert csak a settingsnél van használva
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  return (
    <PubContext.Provider value={{ pubData, pubState }}>
      {children}
    </PubContext.Provider>
  );
};

export const usePubContext = (): PubContextProps | undefined =>
  useContext(PubContext);
