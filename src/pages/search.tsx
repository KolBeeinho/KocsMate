import { Transition } from "@headlessui/react";
import { Pub } from "prisma/generated/client";
import { useContext, useEffect, useState } from "react";
import Map from "../components/web/Map";
import useLoading from "../utils/hooks/useLoad";
import { AuthContext } from "../utils/providers/AuthContext";
const Search = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return;
  }
  const { loading } = useLoading();
  const [transition, setTransition] = useState<boolean>(false);
  const [pubs, setPubs] = useState<Pub[]>([]);

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
          {/* <button
            className={`${components.button.homePageButton}`}
            onClick={logout}
          >
            Kijelentkezés
          </button> */}
          <Map user={user || null} />
        </Transition>
      ) : null}
    </>
  );
};

export default Search;
