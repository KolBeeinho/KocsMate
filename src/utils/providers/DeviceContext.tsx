import { Device } from "@capacitor/device";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DeviceInfo {
  platform: string | null;
  osVersion: string | null;
}
interface DeviceInfoProps {
  children: React.ReactNode;
}

const DeviceContext = createContext<DeviceInfo | undefined>(undefined);

export const DeviceProvider: React.FC<DeviceInfoProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: null,
    osVersion: null,
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = await Device.getInfo();
      setDeviceInfo({
        platform: info.platform,
        osVersion: info.osVersion,
      });
    };

    fetchDeviceInfo();
  }, []);

  return (
    <DeviceContext.Provider value={deviceInfo}>
      {children}
    </DeviceContext.Provider>
  );
};

//A DeviceContext használatához szükséges hook
export const useDevice = (): DeviceInfo => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};
