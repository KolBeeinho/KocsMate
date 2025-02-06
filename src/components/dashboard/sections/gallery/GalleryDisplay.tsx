//TODO cserélje le a background mezőt, ne tiltson
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import useOutsideClick from "src/utils/sideBarClose";
import DeleteConfirm from "../../DeleteConfim";

interface GalleryDisplayProps {
  images?: string[];
  pubId: string;
}

const GalleryDisplay: React.FC<GalleryDisplayProps> = ({
  images = [],
  pubId,
}) => {
  const [loadedImages, setLoadedImages] = useState<string[]>(images);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false); // Állapot a megerősítéshez
  const [imageToDelete, setImageToDelete] = useState<string | null>(null); // Kép, amit törölni szeretnénk
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ha nincsenek képek, ne végezzünk lekérést
    if (images) {
      const fetchImages = async () => {
        try {
          const response = await fetch("/api/getGallery");
          const data = await response.json();

          // Ha van új kép, frissítsük a UI-t
          if (data.images && data.images.length !== loadedImages.length) {
            setLoadedImages(data.images);
          }
        } catch (error) {
          console.error("Hiba a képek lekérése során:", error);
        }
      };

      fetchImages();
    }
  }, [images, loadedImages]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    //utilsba mehet majd
    setSelectedImageIndex(null);
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex !== null && prevIndex < loadedImages.length - 1
        ? prevIndex + 1
        : 0
    );
  };

  const goToPreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex !== null && prevIndex > 0
        ? prevIndex - 1
        : loadedImages.length - 1
    );
  };

  const handleCheckIconClick = async () => {
    if (selectedImageIndex !== null) {
      const selectedImage = loadedImages[selectedImageIndex];

      // A kép adatainak frissítése a backend-en
      try {
        const response = await fetch("/api/updateImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: selectedImage,
            pubId: pubId,
            isBackground: true,
          }),
        });

        if (response.ok) {
          alert("A kép beállítva háttérképnek frissítve.");
        } else {
          alert("Nem sikerült a kép tájolásának frissítése.");
        }
      } catch (error) {
        console.error("Hiba történt a tájolás frissítése közben:", error);
      }
    }
  };

  const handleDeleteImage = (imageUrl: string) => {
    setImageToDelete(imageUrl);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (imageToDelete) {
      try {
        const response = await fetch("/api/deleteImage", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: imageToDelete,
            pubId: pubId, //Kapja kívülről
          }),
        });

        if (!response.ok) {
          throw new Error("Hiba történt a törlés során");
        }

        const data = await response.json();
        console.log("Sikeres törlés:", data.message);

        // Ha sikerült törölni, frissítsük a képek listáját
        setLoadedImages((prevImages) =>
          prevImages.filter((url) => url !== imageToDelete)
        );
      } catch (error) {
        console.error("Hiba történt a törlés során:", error);
      }
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false); // Mégse gomb
  };
  useOutsideClick(modalRef, handleCloseModal);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📸 Galéria
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadedImages.map((url, kepId) => (
          <div
            key={kepId}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
            onClick={() => handleImageClick(kepId)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(url);
              }}
              className="bg-red-500 text-white p-2 rounded-full absolute top-2 right-2 z-10"
            >
              <TrashIcon className="h-6 w-6 absolute -right-10 top-2 text-red-500" />
              Törlés
            </button>
            <Image
              src={url}
              alt={`Galéria kép ${kepId + 1}`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              width={200}
              height={200}
            />
            <div className="absolute inset-0 bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-40"></div>
          </div>
        ))}
      </div>
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-opacity-80 backdrop-blur-sm p-4"
          ref={modalRef}
        >
          <div className="relative flex items-center max-w-4xl">
            <button
              onClick={goToPreviousImage}
              className="absolute left-4 z-10 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition"
            >
              <ChevronLeftIcon className="h-10 w-10 text-white" />
            </button>

            <img
              src={loadedImages[selectedImageIndex]}
              alt="Selected"
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
            />

            <button
              onClick={goToNextImage}
              className="absolute right-4 z-10 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition"
            >
              <ChevronRightIcon className="h-10 w-10 text-white" />
            </button>
            <button
              onClick={handleCheckIconClick}
              className="absolute top-4 left-4 z-10 bg-green-500 p-2 rounded-full hover:bg-green-600 transition"
            >
              <CheckIcon className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
      {/* Törlés megerősítés modal */}
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default GalleryDisplay;
