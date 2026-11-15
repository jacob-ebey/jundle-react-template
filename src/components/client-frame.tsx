"use client";

import { createFromReadableStream } from "@jundle/react-server-dom/client";
import { fetchRSC } from "@jundle/rsc/client";
import {
  createContext,
  startTransition,
  use,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import { browser } from "react-dom";

declare global {
  interface Window {
    __frames: Map<
      string,
      {
        references: number;
        promise: Promise<React.ReactNode>;
        reload: () => Promise<void>;
      }
    >;
  }
}

if (typeof document !== "undefined") {
  window.__frames = new Map();
}

const initialPromises = new WeakMap<
  ReadableStreamAsyncIterator<Uint8Array>,
  Promise<React.ReactNode>
>();

const FrameContext = createContext<{ reload: () => Promise<void> } | undefined>(
  undefined,
);

export function useReloadFrame(id?: string) {
  let reloadImp: () => Promise<void>;
  if (!id) {
    const frame = use(FrameContext);
    if (!frame) throw new Error("No parent frame found.");
    reloadImp = frame.reload;
  } else {
    reloadImp = async () => {
      const frame =
        typeof document !== "undefined" ? window.__frames.get(id) : undefined;
      if (!frame) throw new Error(`Frame "${id}" not found.`);
      await frame.reload();
    };
  }

  const [, reload, pending] = useActionState(reloadImp, undefined);
  return [() => startTransition(() => reload()), pending] as const;
}

export type ClientFrameProps = {
  id: string;
  initial?: ReadableStreamAsyncIterator<Uint8Array>;
  src: string;
};

export function ClientFrame({ id, initial, src }: ClientFrameProps) {
  if (!initial) use(browser());

  const reload = useCallback(() => {
    const frame = window.__frames.get(id);
    const promise = fetchRSC(src);
    window.__frames.set(id, {
      references: frame?.references ?? 0,
      promise,
      reload,
    });
    setPromise(promise);
    return promise.then(() => {});
  }, [src]);

  const [promise, setPromise] = useState(() => {
    if (initial) {
      let promise = initialPromises.get(initial);
      if (promise) {
        return promise;
      }
      promise = Promise.resolve(
        createFromReadableStream(
          new ReadableStream({
            async start(controller) {
              for await (const chunk of initial) {
                controller.enqueue(chunk);
              }
              controller.close();
            },
          }),
        ),
      );
      initialPromises.set(initial, promise);
      if (typeof document !== "undefined")
        window.__frames.set(id, { references: 0, promise, reload });
      return promise;
    }
    const frame = window.__frames.get(id);
    if (frame) {
      return frame.promise;
    }
    const promise = fetchRSC(src);
    window.__frames.set(id, { references: 0, promise, reload });
    return promise;
  });

  useEffect(() => {
    const frame = window.__frames.get(id);
    window.__frames.set(id, {
      references: (frame?.references ?? 0) + 1,
      promise,
      reload,
    });
    return () => {
      const frame = window.__frames.get(id);
      if (frame) {
        if (frame.references === 1) {
          window.__frames.delete(id);
        } else {
          window.__frames.set(id, {
            ...frame,
            references: frame.references - 1,
          });
        }
      }
    };
  }, [promise, reload]);

  return (
    <FrameContext.Provider value={{ reload }}>
      {use(promise)}
    </FrameContext.Provider>
  );
}
