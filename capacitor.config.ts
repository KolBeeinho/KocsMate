import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.kocsmate",
  appName: "KocsMate",
  webDir: "./src",
  server: {
    url: "http://192.168.0.233:3000", //ha emulátort használsz, akkor 127.0.0.1 vagy localhost
    cleartext: true,
  },
};

export default config;
