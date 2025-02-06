// components/ImageUpload.tsx
import { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Kérlek válassz ki egy fájlt.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Hiba történt a feltöltés során.");
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Hiba történt a feltöltés során:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      {uploadedImageUrl && (
        <div>
          <p>Feltöltött kép:</p>
          <img src={uploadedImageUrl} alt="Feltöltött kép" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
