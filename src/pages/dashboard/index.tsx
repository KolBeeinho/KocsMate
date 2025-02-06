import { NextPage } from "next";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DisplayPubInfo from "../../components/dashboard/sections/home/displaypubinfo";
import { usePubContext } from "../../utils/providers/DashboardContext";

const Home: NextPage = () => {
  const pubContext = usePubContext();
  if (!pubContext) {
    return <p>Loading...</p>;
  }
  const { pubData, setPubData } = pubContext;

  return (
    <DashboardLayout>
      <DisplayPubInfo pubData={pubData} updatePubData={setPubData} />
    </DashboardLayout>
  );
};

export default Home;
