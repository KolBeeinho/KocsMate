import { NextPage } from "next";
import { Pub, Review } from "prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { usePubContext } from "../../utils/providers/DashboardContext";

const Reviews: NextPage = () => {
  const pubContext = usePubContext();

  if (!pubContext) return <p>Loading...</p>;

  const { pubData, setPubData } = pubContext;

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
        setPubData((prevData: Pub & { reviews: Review[] }) => ({
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

  return (
    <DashboardLayout>
      <div className="w-full lg:w-1/2 review max-h-fit p-4">
        <h2 className="text-2xl font-bold mb-4">Vélemények</h2>
        {pubData.reviews && pubData.reviews.length > 0 ? (
          <ul className="space-y-4">
            {pubData.reviews.map(
              (
                review: Review //nem lehet Review típus, mert pluszban lekérünk hozzá adatokat a User táblából, esetleg extends
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
