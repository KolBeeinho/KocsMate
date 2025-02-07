import { useDevice } from "./providers/DeviceContext";
export default function isMobile(): boolean;
export default function isMobile(returnString: true): string | null;

export default function isMobile(returnString?: true): boolean | string | null {
  const { platform } = useDevice();
  const isMobileDevice = platform === "ios" || platform === "android";

  return returnString ? (isMobileDevice ? platform : null) : isMobileDevice;
}
