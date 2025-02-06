import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GalleryDisplay from "../../components/dashboard/sections/gallery/GalleryDisplay";
import GalleryUpload from "../../components/dashboard/sections/gallery/GalleryUpload";
import { usePubContext } from "../../utils/providers/DashboardContext";
const gallery = () => {
  const pubContext = usePubContext();

  if (!pubContext) return <p>Loading...</p>;

  const { pubData } = pubContext;
  console.log(pubData.id);
  return (
    <DashboardLayout>
      <GalleryDisplay pubId={pubData.id} />
      <GalleryUpload pubId={pubData.id} />
    </DashboardLayout>
  );
};

export default gallery;
