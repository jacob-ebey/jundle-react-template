import { getContext } from "hono/context-storage";

import { getServer } from "#lib/hono.tsx";

import { Frame as ClientFrame } from "./client.tsx";

export type FrameProps = {
  id?: string;
  lazy?: boolean;
  src: string;
};

export async function Frame({ lazy, src }: FrameProps) {
  const c = getContext();
  const server = getServer();
  const url = new URL(src, c.req.url);
  let initial: ReadableStreamAsyncIterator<Uint8Array> | undefined;
  if (!lazy) {
    const response = await server.fetch(
      new Request(url, {
        headers: {
          Accept: "text/x-component",
        },
      }),
    );
    if (!response.body) throw new Error("No frame response body for " + src);
    initial = response.body.values();
  }

  return <ClientFrame {...{ " initial": initial, lazy, src }} />;
}
