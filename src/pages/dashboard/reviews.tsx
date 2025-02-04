import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Pub, Review } from "../../../prisma/prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { AuthContext } from "../../utils/providers/AuthContext";

const Reviews: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<(Pub & { reviews: Review[] }) | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

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
          setPubData(data.pub); //TODO felhasználónév beleimplementálása a review típusba (reláción keresztül)
        })
        .catch((error) => console.error("Error fetching pub data:", error))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleModerate = async (
    reviewId: string,
    action: "disable" | "enable"
  ) => {
    try {
      const response = await fetch("/api/moderateReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId, action }),
      });

      const data = await response.json();
      if (data.review) {
        setPubData((prevData) => ({
          ...prevData!,
          reviews: (prevData?.reviews || []).map((review) =>
            review.id === reviewId
              ? { ...review, isActive: action === "disable" ? false : true }
              : review
          ),
        }));
      }
    } catch (error) {
      console.error("Hiba történt a moderálás során:", error);
    }
  };

  if (!user || loading || !pubData) {
    return <p>Loading...</p>;
  }

  return (
    <DashboardLayout>
      <div className="w-full lg:w-1/2 review max-h-fit p-4">
        <h2 className="text-2xl font-bold mb-4">Vélemények</h2>
        {pubData.reviews && pubData.reviews.length > 0 ? (
          <ul className="space-y-4">
            {pubData.reviews.map(
              (
                review //nem lehet Review típus, mert pluszban lekérünk hozzá adatokat a User táblából
              ) => (
                <li
                  key={review.id}
                  className={` ${
                    !review.isActive && "text-red-500"
                  } border border-amber-50 p-4 rounded-lg shadow`}
                >
                  <p className="font-semibold text-lg">
                    {review.userId || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Értékelés: ⭐ {review.rating}/5
                  </p>
                  <p className="mt-2">{review.comment}</p>
                  {review.isActive ? (
                    <button
                      onClick={() => handleModerate(review.id, "disable")} //Disable action moderálja
                      className="mt-2 text-red-500 hover:text-red-700"
                    >
                      Moderálás: Tiltás
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(review.id, "enable")} //Enable action újra elérhetővé teszi
                      className="mt-2 text-green-700 hover:text-green-900"
                    >
                      Moderálás: Visszaállítás
                    </button>
                  )}
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="text-gray-500">Nincsenek még vélemények.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reviews;
