import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Map from "../components/Map";
import { styles } from "../styles/styles";
import useLoading from "../utils/hooks/useLoad";
import { AuthContext } from "../utils/providers/AuthContext";
const Search = () => {
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
  console.log(user);
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      {user ? (
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
          <button className={`${styles.button.tailwind}`} onClick={logout}>
            Kijelentkezés
          </button>
          <Map />
        </Transition>
      ) : null}
    </>
  );
};

export default Search;
