import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.kocsmate",
  appName: "KocsMate",
  webDir: "./src",
  server: {
    //ha emulátort használsz, akkor 127.0.0.1 vagy localhost
    hostname: "127.0.0.1",
    cleartext: true,
  },
};

export default config;
