"use server-entry";

import type { RouteProps } from "#lib/hono.tsx";

import { ReloadSelf } from "./client";

let count = 0;

export default async function ExampleFrame({
  c,
}: RouteProps<any, "/example-frame/:name?">) {
  const name = c.req.param("name");
  if (name) await new Promise((r) => setTimeout(r, 500));

  return (
    <div>
      <p>
        Hello, {name || "Frame"} {count++}!
      </p>
      <ReloadSelf />
    </div>
  );
}
