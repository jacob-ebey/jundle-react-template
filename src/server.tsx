import { Hono } from "hono";
import { lazyRenderHTML } from "#lib/hono.tsx";

import "./browser.ts";

const app = new Hono();

app.get(
  "/",
  lazyRenderHTML(() => import("./routes/home/route.tsx")),
);

export default app;
