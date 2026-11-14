import { env } from "node:process";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import build from "./dist/server/server.js";
import { compress } from "hono/compress";

const app = new Hono();
app.use(
  compress({
    contentTypeFilter: (contentType) => !contentType.match("html"),
  }),
);
app.use("/*", serveStatic({ root: "./dist/client" }));
app.route("/", build);

const port = Number(env.PORT || 3000);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running at http://localhost:${info.port}/`);
});
