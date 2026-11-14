import type { JundleConfig } from "jundle";

import pkgJson from "./package.json" with { type: "json" };

export default {
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
      runtime: "node",
    },
  ],
  graphs: {
    server: {
      conditions: ["react-server", "..."],
      external: Object.keys(pkgJson.dependencies),
    },
  },
} satisfies JundleConfig;
