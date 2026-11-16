import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";

import { lazyRenderHTML, lazyRenderRSC, serverStorage } from "#lib/hono.tsx";

import "./browser.ts";

const app = new Hono<{ Bindings: Cloudflare.Env }>()
  .use(contextStorage())
  .use(serverStorage((): Hono<any> => app))
  .get(
    "/",
    lazyRenderHTML(() => import("./routes/home/route.tsx")),
  )
  .get(
    "/example-frame/:name?",
    lazyRenderRSC(() => import("./routes/example-frame/route.tsx")),
  );

export default app;
