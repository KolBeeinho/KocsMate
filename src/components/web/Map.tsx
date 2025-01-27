import maplibregl from "maplibre-gl";
import Map, { NavigationControl } from "react-map-gl";

const center = {
  //Egyelőre Kistarcsa
  lat: 47.55172, // Szélesség
  lng: 19.26131, // Hosszúság
};

const MyMap = () => {
  return (
    <Map
      mapLib={maplibregl as any}
      initialViewState={{
        longitude: center.lng, // Hosszúság
        latitude: center.lat, // Szélesség
        zoom: 14,
      }}
      style={{
        width: "100%",
        height: "calc(100vh - 77px)",
        marginBottom: "500px",
      }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
    >
      <NavigationControl position="top-left" />
    </Map>
  );
};

export default MyMap;
