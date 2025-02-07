import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.kocsmate",
  appName: "KocsMate",
  webDir: "./src",
  server: {
    url: "http://localhost:3000",
    hostname: "127.0.0.1:3000",
    cleartext: true,
  },
};

export default config;
