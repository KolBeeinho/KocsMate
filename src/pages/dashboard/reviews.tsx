import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub } from "../../../prisma/prisma/generated/client";
import Sidebar from "../../components/dashboard/sidebar";
import { AuthContext } from "../../utils/providers/AuthContext";

const Reviews: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<(Pub & { reviews: any[] }) | null>(
    null
  ); // A reviews típust dinamikusra állítottuk, ha nincs definiálva
  const [loading, setLoading] = useState<boolean>(true); // Betöltés jelző

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  // Ellenőrzés: ha nincs user vagy a felhasználó nem üzleti, akkor visszairányítjuk
  useEffect(() => {
    if (!user || !user.business) {
      router.push("/");
    }
  }, [user, router]);

  // Pub adatok lekérése
  useEffect(() => {
    if (user?.id) {
      setLoading(true); // Betöltés indítása
      fetch(`/api/getAdminPub?adminId=${user.id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch pub data");
          }
          return res.json();
        })
        .then((data) => {
          setPubData(data.pub);
        })
        .catch((error) => console.error("Error fetching pub data:", error))
        .finally(() => setLoading(false)); // Betöltés vége
    }
  }, [user]);

  // Betöltés állapot
  if (!user || loading || !pubData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="md:grid md:grid-flow-col" id="dashboard">
      <Sidebar />
      <div className="mx-4 flex flex-col space-y-8 md:mt-[80px] md:ml-[100px] lg:flex-row lg:space-y-0 lg:space-x-10 xl:space-x-12">
        {/* Vélemények megjelenítése */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Vélemények</h2>
          {pubData.reviews && pubData.reviews.length > 0 ? (
            <ul className="space-y-4">
              {pubData.reviews.map((review) => (
                <li key={review.id} className="border p-4 rounded-lg shadow">
                  <p className="font-semibold text-lg">
                    {review.user?.fullName || "Névtelen"}{" "}
                    {/* userName helyett user.fullName */}
                  </p>
                  <p className="text-sm text-gray-600">
                    Értékelés: ⭐ {review.rating}/5
                  </p>
                  <p className="mt-2">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nincsenek még vélemények.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
