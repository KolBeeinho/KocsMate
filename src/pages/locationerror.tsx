import { Geolocation } from "@capacitor/geolocation";
import { useRouter } from "next/router";
import React, { useState } from "react";
import KocsMateLogo from "src/components/web/KocsMateLogo";
const LocationErrorPage: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleRetry = async () => {
    try {
      const hasPermission = await Geolocation.checkPermissions();
      if (hasPermission.location !== "granted") {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location !== "granted") {
          setErrorMessage("A helymeghatározáshoz engedély szükséges.");
          return;
        }
      }
      const coordinates = await Geolocation.getCurrentPosition();

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      setUserLocation({ lat, lng });

      console.log("Helyadatok:", lat, lng);
      router.push(`/search?lat=${lat}&lng=${lng}`);
    } catch (err) {
      console.error("Hiba történt a geolokáció lekérésekor:", err);
      setErrorMessage(
        "Nem sikerült lekérni a helyadatokat. Kérjük, próbálja újra."
      );
    }
  };

  const handleManualLocation = () => {
    router.push("/search");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--oxford-blue)]">
      <h1 className="text-2xl font-bold mb-22 text-[var(--butterscotch)]">
        Nem tudom hol vagy!
      </h1>
      <KocsMateLogo />
      <p className="text-center my-12 text-[var(--butterscotch)] font-bold">
        Az alkalmazás működéséhez szükséges a helyadatok elérése. Kérjük,
        ellenőrizze a beállításokban, és próbálja újra.
      </p>
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      <div className="flex flex-col space-y-4 w-[70%]">
        <button
          onClick={handleRetry}
          className="bg-[var(--butterscotch)] text-[var(--oxford-blue)] py-2 px-4 rounded-lg"
        >
          Add meg a helyzeted
        </button>
        <button
          onClick={handleManualLocation}
          className="bg-[var(--butterscotch)] text-[var(--oxford-blue)] py-2 px-4 rounded-lg"
        >
          Manuális címmegadás
        </button>
      </div>
    </div>
  );
};

export default LocationErrorPage;
