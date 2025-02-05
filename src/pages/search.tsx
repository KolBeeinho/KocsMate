import { Transition } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
import { Review } from "../../prisma/prisma/generated/client";
import { components } from "../styles/styles";
import useLoading from "../utils/hooks/useLoad";
import { AuthContext } from "../utils/providers/AuthContext";
const Search = () => {
  //Login részek kommentelve
  const authContext = useContext(AuthContext);
  //const router = useRouter();
  if (!authContext) {
    return;
  }
  const { loading } = useLoading();
  const [transition, setTransition] = useState<boolean>(false);
  const [pubs, setPubs] = useState<any[]>([]); // Az összes pub tárolása //& { products?: Product[] }
  const [review, setReview] = useState<string>(""); // Tárolja az új véleményt

  useEffect(() => {
    if (loading) {
      setTransition(transition);
    } else {
      setTransition(!transition);
    }
  }, [loading]);
  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch("/api/getPubs");
        if (response.ok) {
          const data = await response.json();
          setPubs(data.pubs);
        } else {
          console.error("Hiba a pubok lekérésekor:", response.statusText);
        }
      } catch (error) {
        console.error("Hiba a lekérés során:", error);
      }
    };
    fetchPubs();
  }, []);

  const { user, logout } = authContext;
  console.log(user, user?.business);

  //Vélemény küldése lehet majd websocketekkel lesz
  const handleReviewSubmit = async (pubId: string) => {
    try {
      const response = await fetch("/api/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pubId,
          userId: user?.id,
          rating: 5,
          comment: review,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Vélemény hozzáadva:", data);
        setReview("");
      } else {
        console.error("Hiba a vélemény hozzáadásakor:", response.statusText);
      }
    } catch (error) {
      console.error("Hiba a vélemény mentésekor:", error);
    }
  };

  return (
    <>
      {true ? ( //User kell majd
        <Transition
          show={transition}
          enter="transition duration-1000 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-300 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
          as="div"
        >
          <button
            className={`${components.button.homePageButton}`}
            onClick={logout}
          >
            Kijelentkezés
          </button>
          {/* <div className="h-1/2 sticky inset-0">
            <Map />
          </div> */}

          {/* Az összes pub megjelenítése egy dobozkában */}
          {pubs.length > 0 && (
            <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
              <h3 className="text-xl font-semibold">Pubok listája</h3>
              <ul>
                {pubs.map((pub) => (
                  <li
                    key={pub.id}
                    className={`my-2 ${
                      pub.state !== "func" ? "text-gray-500" : ""
                    }`}
                  >
                    <h4 className="font-medium">{pub.name}</h4>
                    <p>{pub.fullAddress}</p>
                    <a
                      href={pub.href}
                      target="_blank"
                      className="text-blue-500 block"
                    >
                      {pub.href}
                    </a>
                    <a
                      href={`tel:${pub.phone}`}
                      className="text-blue-500 block"
                    >
                      {pub.phone}
                    </a>
                    <a href={`mailto:${pub.email}`} className="block">
                      {pub.email}
                    </a>
                    <p>{pub.state}</p>
                    <p>{pub.googleRating}</p>
                    <p>{pub.rating}</p>
                    {/* Vélemények megjelenítése */}
                    {pub.reviews && pub.reviews.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold">Vélemények</h5>
                        <ul>
                          {pub.reviews.map((review: Review) => (
                            <li
                              key={review.id}
                              className={`${!review.isActive && "hidden"} my-2`}
                            >
                              <p>
                                <strong>Értékelés:</strong> {review.userId} / 5
                              </p>
                              <p>
                                <strong>Értékelés:</strong> {review.rating} / 5
                              </p>
                              <p>
                                <strong>Vélemény:</strong> {review.comment}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Vélemény írása textarea */}
          <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold">Vélemény írása</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Írd le véleményedet..."
            />
            <button
              onClick={() => handleReviewSubmit(pubs[0]?.id)} // Az első pubot használjuk, cseréld a kívánt pub-ra
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Vélemény küldése
            </button>
          </div>
        </Transition>
      ) : null}
    </>
  );
};

export default Search;
