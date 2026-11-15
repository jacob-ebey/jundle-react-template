"use client";

import { createFromReadableStream } from "@jundle/react-server-dom/client";
import { fetchRSC } from "@jundle/rsc/client";
import {
  startTransition,
  use,
  useActionState,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { browser } from "react-dom";

export type ClientFrameProps = {
  id: string;
  initial?: AsyncIterable<Uint8Array>;
  src: string;
};

declare global {
  interface Window {
    __frames: Map<
      string,
      { promise: Promise<React.ReactNode>; reload: () => Promise<void> }
    >;
  }
}

if (typeof document !== "undefined") {
  window.__frames = new Map();
}

export function useReloadFrame(id: string) {
  const [, reload, pending] = useActionState(async () => {
    const frame =
      typeof document !== "undefined" ? window.__frames.get(id) : undefined;
    if (!frame) throw new Error(`Frame "${id}" not found.`);
    await frame.reload();
  }, undefined);
  return [() => startTransition(() => reload()), pending] as const;
}

export function ClientFrame({ id, initial, src }: ClientFrameProps) {
  if (!initial) use(browser());

  const [_, startPending] = useTransition();
  const reload = useCallback(() => {
    const promise = fetchRSC(src);
    startPending(() => setPromise(promise));
    return promise.then(() => {});
  }, [src]);

  const [promise, setPromise] = useState(() => {
    const frame =
      typeof document !== "undefined" ? window.__frames.get(id) : undefined;
    if (frame) return frame.promise;
    let promise: Promise<React.ReactNode>;
    if (initial) {
      promise = Promise.resolve(
        createFromReadableStream(
          new ReadableStream<Uint8Array>({
            async start(controller) {
              for await (const chunk of initial) {
                controller.enqueue(chunk);
              }
              controller.close();
            },
          }),
        ),
      );
    } else {
      promise = fetchRSC(src, { cache: "force-cache" });
    }

    if (typeof document !== "undefined")
      window.__frames.set(id, { promise, reload });

    return promise;
  });

  useEffect(() => {
    if (typeof document !== "undefined")
      window.__frames.set(id, { promise, reload });
  }, [promise, reload]);

  return use(promise);
}
