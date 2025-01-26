import { useDevice } from "./providers/DeviceContext";

export default function isMobile(): boolean {
  const { platform } = useDevice();
  return platform === "ios" || platform === "android";
}
