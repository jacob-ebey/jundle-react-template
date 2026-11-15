"use client";

import { createFromReadableStream } from "@jundle/react-server-dom/client";
import { fetchRSC } from "@jundle/rsc/client";
import {
  use,
  useActionState,
  useCallback,
  useState,
  useTransition,
} from "react";
import { browser } from "react-dom";

export type ClientFrameProps = {
  id?: string;
  initial?: Promise<ReadableStream<Uint8Array>>;
  src: string;
};

const frames = new Map<string, () => void>();

export function reloadFrameCallback(id: string, event: Event) {
  event.preventDefault();
  const reload = frames.get(id);
  if (!reload) throw new Error(`Frame "${id}" not found.`);
  reload();
}

export function useReloadFrame(id: string) {
  const [, reload, pending] = useActionState(() => {
    const reload = frames.get(id);
    if (!reload) throw new Error(`Frame "${id}" not found.`);
    reload();
  }, undefined);
  return [reload, pending];
}

export function ClientFrame({ id, initial, src }: ClientFrameProps) {
  if (!initial) use(browser());

  const [promise, setPromise] = useState(() => {
    if (initial)
      return initial.then((body) =>
        createFromReadableStream(body, {
          environmentName: id ? `frame:${id}` : undefined,
        }),
      );
    return fetchRSC(src, { cache: "force-cache" });
  });
  const [_, startPending] = useTransition();

  const reload = useCallback(
    () => startPending(() => setPromise(fetchRSC(src))),
    [src],
  );

  if (id) frames.set(id, reload);

  return use(promise);
}
