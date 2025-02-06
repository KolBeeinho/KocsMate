import { Product, Pub, Review } from "prisma/generated/client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "../../utils/providers/AuthContext";

interface PubContextProps {
  pubData: Pub & { products?: Product[]; reviews: Review[] };
  pubState: string;
  setPubState: React.Dispatch<React.SetStateAction<string>>;
  setPubData: React.Dispatch<
    React.SetStateAction<Pub & { products?: Product[]; reviews: Review[] }>
  >;
}

interface DashboardContextProps {
  children: ReactNode;
}

const PubContext = createContext<PubContextProps | undefined>(undefined);

export const PubProvider: React.FC<DashboardContextProps> = ({ children }) => {
  // Az alapértelmezett pubData most tartalmazza az összes kötelező mezőt üres alapértelmezett értékekkel
  const [pubData, setPubData] = useState<
    Pub & { products?: Product[]; reviews: Review[] }
  >({
    name: "",
    id: "",
    fullAddress: "",
    longitude: 0,
    latitude: 0,
    phone: "",
    email: "",
    openingHours: [], //NAGYON FONTOS, HOGY TÖMB LEGYEN (JsonValue miatt)
    functioning: true,
    href: "",
    googleRating: 0,
    rating: 0,
    state: "func",
    reviews: [],
    products: [],
  }); //init Pub értékek
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
          if (data?.pub) {
            setPubData({
              ...data.pub,
              reviews: data.pub.reviews || [], // Biztosítjuk, hogy a reviews ne legyen undefined
              products: data.pub.products || [], // Biztosítjuk, hogy a products ne legyen undefined
            });
            setPubState(data.pub?.state || "func");
          }
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  return (
    <PubContext.Provider value={{ pubData, pubState, setPubState, setPubData }}>
      {children}
    </PubContext.Provider>
  );
};

export const usePubContext = (): PubContextProps | undefined =>
  useContext(PubContext);
