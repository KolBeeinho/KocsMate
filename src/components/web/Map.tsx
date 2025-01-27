import { MapPinIcon } from "@heroicons/react/24/solid"; // Heroicons importálása
import maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { Bar } from "../../../type";

// Default Kossuth Lajos tér
const center = {
  lat: 47.5057199, // Szélesség
  lng: 19.0449808, // Hosszúság
};

const MyMap = () => {
  const [bars, setBars] = useState<Bar[]>([]);

  // A JSON fájl betöltése (helyben)
  useEffect(() => {
    const fetchBars = async () => {
      const response = await fetch("/bars.json");
      const data = await response.json();
      console.log(data);
      setBars(data);
    };
    fetchBars();
  }, []);

  return (
    <Map
      mapLib={maplibregl as any}
      initialViewState={{
        longitude: center.lng, // Hosszúság
        latitude: center.lat, // Szélesség
        zoom: 10,
      }}
      style={{
        width: "100%",
        height: "calc(100vh - 77px)",
        marginBottom: "500px",
      }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
    >
      <NavigationControl position="top-left" />

      {/* Pontok kirajzolása */}
      {bars.map((bar, index) => (
        <Marker key={index} latitude={bar.latitude} longitude={bar.longitude}>
          {/* React komponensként rendereljük az ikont */}
          <MapPinIcon className="h-10 w-10 bg-red" />
        </Marker>
      ))}
    </Map>
  );
};

export default MyMap;
