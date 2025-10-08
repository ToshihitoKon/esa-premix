import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    32: "public/logo_32.png",
    64: "public/logo_64.png",
    128: "public/logo_128.png",
  },
  host_permissions: ["https://*.esa.io/*"],
  action: {
    default_icon: {
      32: "public/logo_32.png",
      64: "public/logo_64.png",
      128: "public/logo_128.png",
    },
    default_popup: "src/popup/index.html",
  },
  content_scripts: [
    {
      js: ["src/content/main.ts"],
      matches: ["https://*.esa.io/*"],
    },
  ],
  background: {
    service_worker: "src/background/main.ts",
  },
  permissions: ["activeTab", "storage"],
  description: "esa-premix is a Chrome extension that adds helpful UI elements to esa.io",
});
