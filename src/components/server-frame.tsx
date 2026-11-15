import { getContext } from "hono/context-storage";

import { getServer } from "#lib/hono.tsx";
import { ClientFrame } from "./client-frame";

export type ServerFrameProps = {
  id: string;
  src: string;
};

export async function ServerFrame({ id, src }: ServerFrameProps) {
  const c = getContext();
  const server = getServer();
  const url = new URL(src, c.req.url);

  const initial = Promise.resolve(
    server.fetch(
      new Request(url, {
        headers: {
          Accept: "text/x-component",
        },
      }),
    ),
  ).then((response) => {
    if (!response.body) throw new Error("No frame response body");
    return response.body.values();
  });

  return <ClientFrame id={id} initial={await initial} src={src} />;
}
