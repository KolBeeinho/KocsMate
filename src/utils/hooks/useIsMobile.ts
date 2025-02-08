import { useDevice } from "../providers/DeviceContext";

const useIsMobile = (returnString?: boolean): boolean | string | null => {
  const { platform } = useDevice();
  const isMobileDevice = platform === "ios" || platform === "android";

  return returnString ? (isMobileDevice ? platform : null) : isMobileDevice;
};

export default useIsMobile;
