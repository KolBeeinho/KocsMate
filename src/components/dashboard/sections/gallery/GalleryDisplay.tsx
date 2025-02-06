import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";

interface GalleryDisplayProps {
  images?: string[];
}

const GalleryDisplay: React.FC<GalleryDisplayProps> = ({ images = [] }) => {
  const [loadedImages, setLoadedImages] = useState<string[]>(images);
  const [transition, setTransition] = useState(false); //headlessui Transition kell majd
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTransition(true);
  }, []);

  useEffect(() => {
    if (!images) {
      const fetchImages = async () => {
        try {
          const response = await fetch("/api/getGallery");
          const data = await response.json();
          setLoadedImages(data.images);
        } catch (error) {
          console.error("Hiba a képek lekérése során:", error);
        }
      };

      fetchImages();
    }
  }, [images]);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        📸 Galéria
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadedImages.map((url, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
            onClick={() => handleImageClick(idx)}
          >
            <img
              src={url}
              alt={`Galéria kép ${idx + 1}`}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-40"></div>
          </div>
        ))}
      </div>

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
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
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-red-500 p-2 rounded-full hover:bg-red-600 transition"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDisplay;
