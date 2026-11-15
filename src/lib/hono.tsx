import { AsyncLocalStorage } from "node:async_hooks";
import {
  renderHTML,
  renderRSC,
  renderRequest,
  type PageComponent,
} from "@jundle/rsc";
import type { Context, Env, Handler, Hono, MiddlewareHandler } from "hono";
import type { BlankInput, HandlerResponse, Input } from "hono/types";

import type Server from "#server.tsx";

const ServerStorage = new AsyncLocalStorage<Hono<any, any, any>>();

export function getServer(): typeof Server {
  const server = ServerStorage.getStore();
  if (!server) throw new Error("No server provided.");
  return server;
}

export function serverStorage<
  E extends Env = any,
  P extends string = string,
  I extends Input = {},
  R extends HandlerResponse<any> = Response,
>(provide: () => Hono): MiddlewareHandler<E, P, I, R> {
  return (_, next) => {
    return ServerStorage.run(provide(), next);
  };
}

export type RouteProps<
  E extends Env = any,
  P extends string = any,
  I extends Input = BlankInput,
> = {
  c: Context<E, P, I>;
};

export function lazyRenderHTML<
  E extends Env = any,
  P extends string = any,
  I extends Input = BlankInput,
>(
  lazy: () => Promise<{
    default: React.ComponentType<{ c: Context<E, P, I> }>;
  }>,
): Handler<E, P, I> {
  return async (c) => {
    const { default: Component } = await lazy();
    c.header("Content-Type", "text/html;charset=utf8");
    return c.body(
      await renderHTML(<Component c={c} />, {
        page: Component as PageComponent,
      }),
    );
  };
}

export function lazyRenderRSC<
  E extends Env = any,
  P extends string = any,
  I extends Input = BlankInput,
>(
  lazy: () => Promise<{
    default: React.ComponentType<{ c: Context<E, P, I> }>;
  }>,
): Handler<E, P, I> {
  return async (c) => {
    const { default: Component } = await lazy();
    c.header("Content-Type", "text/x-component;charset=utf8");
    return c.body(renderRSC(<Component c={c} />));
  };
}

export function lazyRenderRequest<
  E extends Env = any,
  P extends string = any,
  I extends Input = BlankInput,
>(
  lazy: () => Promise<{
    default: React.ComponentType<{ c: Context<E, P, I> }>;
  }>,
): Handler<E, P, I> {
  return async (c) => {
    const { default: Component } = await lazy();
    return await renderRequest(c.req.raw, <Component c={c} />, {
      page: Component as PageComponent,
    });
  };
}
