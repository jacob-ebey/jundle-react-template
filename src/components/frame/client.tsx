"use client";

import { createFromReadableStream } from "@jundle/react-server-dom/client";
import {
  createContext,
  use,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { browser } from "react-dom";

export type FrameProps = {
  id?: string;
  lazy?: boolean;
  src: string;
  " initial"?: ReadableStreamAsyncIterator<Uint8Array>;
};

async function fetchRSC(
  url: string,
  signal: AbortSignal,
): Promise<React.ReactNode> {
  const res = await fetch(url, {
    headers: { Accept: "text/x-component" },
    signal,
  });
  if (!res.body) throw new Error("No RSC response body");
  return createFromReadableStream(res.body);
}

const streamPromises = new WeakMap<
  ReadableStreamAsyncIterator<Uint8Array>,
  Promise<React.ReactNode>
>();

function getPromise(body: ReadableStreamAsyncIterator<Uint8Array>) {
  const existing = streamPromises.get(body);
  if (existing) return existing;
  const promise = Promise.resolve(
    createFromReadableStream(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of body) {
            controller.enqueue(chunk);
          }
          controller.close();
        },
      }),
    ),
  );
  streamPromises.set(body, promise);
  return promise;
}

const srcPromises = new Map<string, Promise<React.ReactNode>>();

function initialPromise(src: string) {
  const existing = srcPromises.get(src);
  if (existing) return existing;
  const promise = fetchRSC(src, new AbortController().signal);
  srcPromises.set(src, promise);
  return promise;
}

type FrameState = {
  pending: boolean;
  reload: () => void;
};

const FrameContext = createContext<FrameState | null>(null);

export function useFrame() {
  const state = use(FrameContext);
  if (!state) throw new Error("useFrame must be used within a <Frame>");
  return state;
}

export function Frame({ " initial": initial, lazy, src }: FrameProps) {
  if (lazy || !initial) use(browser());
  const [pending, startPending] = useTransition();
  const [promise, setPromise] = useState(() =>
    initial ? getPromise(initial) : initialPromise(src),
  );

  const abortRef = useRef<AbortController | undefined>(undefined);

  const reload = useEffectEvent(() => {
    startPending(async () => {
      const previousController = abortRef.current;
      const controller = (abortRef.current = new AbortController());
      const promise = fetchRSC(src, controller.signal);
      startPending(() => setPromise(promise));
      requestAnimationFrame(() => {
        previousController?.abort();
      });
      await promise
        .catch(() => {})
        .finally(() => {
          if (abortRef.current === controller) {
            abortRef.current = undefined;
          }
        });
    });
  });

  const [lastSrc, setLastSrc] = useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    requestAnimationFrame(() => {
      reload();
    });
  }

  const state = useMemo(() => ({ pending, reload }), [pending, reload]);

  return <FrameContext value={state}>{use(promise)}</FrameContext>;
}
