import tailwindcss from "@tailwindcss/vite";
import type { JundleConfig, JundleVitePlugin } from "jundle";

export default {
  vitePlugins: [tailwindcss() as JundleVitePlugin],
  bundles: {
    server: {
      graph: "server",
      platform: "node",
    },
  },
  entries: [
    {
      bundle: "server",
      file: "./src/server.tsx",
      runtime: "@jundle/cloudflare",
    },
  ],
  graphs: {
    server: {
      conditions: ["react-server", "workerd", "..."],
    },
  },
} satisfies JundleConfig;
