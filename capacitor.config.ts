import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.kocsmate",
  appName: "KocsMate",
  webDir: "./src",
  server: {
    url: "http://127.0.0.1:3000", //ha emulátort használsz, akkor 127.0.0.1 vagy localhost
    cleartext: true,
  },
};

export default config;
