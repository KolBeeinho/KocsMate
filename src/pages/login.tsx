import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "src/utils/providers/AuthContext";
import Login from "../components/web/login";
import useIsMobile from "../utils/hooks/useIsMobile";
import LocationErrorPage from "./locationerror";

const LoginPage: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [isLocationError, setIsLocationError] = useState(false);
  const isMobile = useIsMobile();

  if (!authContext) {
    console.error("Nem lehet bejelentkezni!");
    return null;
  }

  const { user } = authContext;

  useEffect(() => {
    if (user) {
      const checkLocationPermissions = async () => {
        try {
          const { Geolocation } = await import("@capacitor/geolocation");
          const hasPermission = await Geolocation.checkPermissions();
          if (hasPermission.location !== "granted") {
            setIsLocationError(true);
          } else {
            router.push("/locationerror");
          }
        } catch (err) {
          setIsLocationError(true);
        }
      };

      if (isMobile) {
        checkLocationPermissions();
      } else {
        router.push("/search");
      }
    }
  }, [user, router, isMobile]);

  if (isLocationError) {
    return <LocationErrorPage />;
  }

  return <Login />;
};

export default LoginPage;
