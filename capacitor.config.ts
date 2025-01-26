import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.kocsmate",
  appName: "KocsMate",
  webDir: "www",
  server: {
    url: "http://localhost:3000",
    cleartext: true,
  },
};

export default config;
