import { MapPinIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { JsonValue } from "@prisma/client/runtime/library";
import maplibregl from "maplibre-gl";
import { User } from "next-auth";
import Image from "next/image";
import { Image as ImageType, Pub } from "prisma/generated/client";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { daysOfWeek } from "src/utils/daysOfWeek";
import useOutsideClick from "src/utils/sideBarClose";
import { OpeningHoursEntry } from "types";

const center = {
  lat: 47.5057199,
  lng: 19.0449808,
};

interface Props {
  user: User | null;
}

const MapComponent = ({ user }: Props) => {
  const [pubs, setPubs] = useState<(Pub & { images: ImageType[] })[]>([]);
  const [selectedPub, setSelectedPub] = useState<
    Pub & { images: ImageType[] }
  >();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const [show, setShow] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch("/api/getPubs");
        if (response.ok) {
          const data = await response.json();
          console.log(data.pubs);
          setPubs(data.pubs);
        } else {
          console.error("Error fetching pubs:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching pubs:", error);
      }
    };
    fetchPubs();
  }, []);

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
        console.log("Review added:", data);
        setReview("");
      } else {
        console.error("Error adding review:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleMarkerClick = (index: number) => {
    setSelectedPub({ ...pubs[index], images: pubs[index].images || [] });
    setActiveIndex(index);
  };

  const parseOpeningHours = (
    openingHours: string | OpeningHoursEntry[] | JsonValue
  ): OpeningHoursEntry[] => {
    if (typeof openingHours === "string") {
      try {
        const parsedJSON = JSON.parse(openingHours);
        if (typeof parsedJSON === "object" && parsedJSON !== null) {
          return parseOpeningHours(parsedJSON);
        }
      } catch {
        const parsedEntries = openingHours.split(", ").map((entry) => {
          const [day, hours] = entry.split(": ");
          return { day: day.trim(), hours: hours?.trim() || "closed" };
        });
        return daysOfWeek.map(
          (day) =>
            parsedEntries.find((entry) => entry.day.trim() === day.trim()) || {
              day,
              hours: "closed",
            }
        );
      }
    }
    if (typeof openingHours === "object" && openingHours !== null) {
      return daysOfWeek.map((day) => {
        const found = (openingHours as OpeningHoursEntry[]).find(
          (entry) => entry.day.trim() === day.trim()
        );
        return found || { day, hours: "closed" };
      });
    }
    console.error("⚠️ Unknown openingHours format:", openingHours);
    return daysOfWeek.map((day) => ({ day, hours: "closed" }));
  };

  function handleCloseModal() {
    setShow((prevShow) => !prevShow);
    console.log(show);
  }

  useOutsideClick(modalRef, handleCloseModal);

  const memoizedPubs = useMemo(() => pubs, [pubs]);

  return (
    <div>
      <Map
        mapLib={maplibregl as any}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: 12,
        }}
        style={{
          width: "100%",
          height: "calc(100vh - 200px)",
          margin: "50px auto",
          display: "block",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.2)",
        }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      >
        <NavigationControl position="top-left" />

        {/* Markers */}
        {memoizedPubs.map((bar, index) => (
          <Marker
            key={index}
            latitude={bar.latitude}
            longitude={bar.longitude}
            onClick={() => handleMarkerClick(index)}
            style={{
              transform: `translate(-50%, -50%)`,
              position: "absolute",
              left: `${bar.longitude}px`,
              top: `${bar.latitude}px`,
            }}
          >
            <span className="text-lg text-red-500">{bar.name}</span>
            <MapPinIcon className="h-10 w-10 text-red-500 hover:text-red-900 cursor-pointer" />
          </Marker>
        ))}
      </Map>

      {/* Modal */}
      {selectedPub && activeIndex !== null && show && (
        <div className="fixed inset-100 p-10 max-w-fit flex flex-col items-center min-h-fit justify-center bg-opacity-80 backdrop-blur-sm mt-6 border rounded-xl shadow-xl bg-[var(--background)]">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {selectedPub.name}
          </h3>
          {selectedPub.images.length > 0 ? (
            <Image
              src={
                selectedPub.images.find((image) => image.isBackground)?.url ||
                selectedPub.images[0]?.url ||
                "/default-image.jpg"
              }
              alt={`${selectedPub.name} kép`}
              width={200}
              height={200}
            />
          ) : (
            <div>Nem található kép erről: {selectedPub.name}</div>
          )}

          <p className="text-md text-gray-700 mb-2">
            {selectedPub.fullAddress}
          </p>
          <div className="flex items-center mt-2 mb-4">
            <span className="text-yellow-400">
              {Array(Math.round(selectedPub.googleRating)).fill("★").join("")}
            </span>
            <span className="ml-2 text-sm text-gray-600 block">
              Google: {selectedPub.googleRating} / 5
            </span>
            <span className="ml-2 text-sm text-gray-600 block">
              KocsMate: {selectedPub.rating} / 5
            </span>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            {selectedPub.description || "No description available."}
          </p>
          <div className="mt-4">
            <span className="font-semibold text-gray-800">Opening Hours:</span>
            <ul className="list-disc pl-5 text-gray-600 mt-2">
              {parseOpeningHours(
                selectedPub?.openingHours as OpeningHoursEntry[]
              ).map(({ day, hours }) => (
                <li key={day} className="text-sm">{`${day}: ${hours}`}</li>
              ))}
            </ul>
          </div>
          <a
            href={selectedPub.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
          >
            More Details
          </a>
          <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
            <h3 className="text-xl font-semibold">Write a Review</h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Write your review..."
            />
            <button
              onClick={() => handleReviewSubmit(selectedPub.id)}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Submit Review
            </button>
            <button
              title="close"
              onClick={handleCloseModal}
              className="absolute top-1 right-4 z-10 bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
