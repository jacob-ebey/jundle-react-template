import {
  renderHTML,
  renderRSC,
  renderRequest,
  type PageComponent,
} from "@jundle/rsc";
import type { Handler } from "hono";

export function lazyRenderHTML(
  lazy: () => Promise<{ default: React.ComponentType }>,
): Handler {
  return async (c) => {
    const { default: Component } = await lazy();
    c.header("Content-Type", "text/html;charset=utf8");
    return c.body(
      await renderHTML(<Component />, { page: Component as PageComponent }),
    );
  };
}

export function lazyRenderRSC(
  lazy: () => Promise<{ default: React.ComponentType }>,
): Handler {
  return async (c) => {
    const { default: Component } = await lazy();
    c.header("Content-Type", "text/x-component;charset=utf8");
    return c.body(renderRSC(<Component />));
  };
}

export function lazyRenderRequest(
  lazy: () => Promise<{ default: React.ComponentType }>,
): Handler {
  return async (c) => {
    const { default: Component } = await lazy();
    return await renderRequest(c.req.raw, <Component />, {
      page: Component as PageComponent,
    });
  };
}
