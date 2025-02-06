import { useState } from "react";

interface ImageUploadProps {
  pubId: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ pubId }) => {
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
    formData.append("pubId", pubId);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Hiba történt a feltöltés során.");
      }

      const data = await response.json();
      setUploadedImageUrl(data.imageUrl); // A válasz tartalmazza az URL-t
    } catch (error) {
      console.error("Hiba történt a feltöltés során:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      {uploadedImageUrl && (
        <div className="fixed inset-0">
          <p>Feltöltött kép:</p>
          <img src={uploadedImageUrl} alt="Feltöltött kép" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
