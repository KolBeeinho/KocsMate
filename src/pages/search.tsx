import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Map from "../components/web/Map";
import { components } from "../styles/styles";
import useLoading from "../utils/hooks/useLoad";
import { AuthContext } from "../utils/providers/AuthContext";
const Search = () => {
  //Login részek kommentelve
  const authContext = useContext(AuthContext);
  const router = useRouter();
  if (!authContext) {
    return;
  }
  const { loading } = useLoading();
  const [transition, setTransition] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (loading) {
      setTransition(transition);
    } else {
      setTransition(!transition);
    }
  }, [loading]);

  const { user, logout } = authContext;
  console.log(user, user?.business);
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  return (
    <>
      {true ? ( //User
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
          <Map />
        </Transition>
      ) : null}
    </>
  );
};

export default Search;
