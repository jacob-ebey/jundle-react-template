import {
  renderHTML,
  renderRSC,
  renderRequest,
  type PageComponent,
} from "@jundle/rsc";
import type { Context, Env, Handler } from "hono";
import type { BlankInput, Input } from "hono/types";

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
