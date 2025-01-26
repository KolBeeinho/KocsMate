import React from "react";
import { useDevice } from "../utils/providers/DeviceContext"; //importálni kell

const DeviceInfoComponent: React.FC = () => {
  const { platform, osVersion } = useDevice(); //mindig hivatkozni kell a saját hookra
  //Változók a feltételhez
  const is_ios = platform === "ios";
  const is_android = platform === "android";
  const is_web = platform === "web";
  return (
    <div>
      <h1>Eszköz információk</h1>
      <p>Platform: {platform}</p>
      <p>OS verzió: {osVersion}</p>

      {is_ios && <p>iOS eszközt használ!</p>}
      {is_android && <p>Android eszközt használ!</p>}
      {is_web && <p>Web böngészőben fut!</p>}
    </div>
  );
};

export default DeviceInfoComponent;
