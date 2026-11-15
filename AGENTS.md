# Overview

A React Server Components based repository with Jundle, Hono, and the UI SDK.

## Jundle

A new bundler built for speed with a cohecive graph model that represents your entire full-stack, multi-graph applications.

## UI SDK

This project uses React and ui-sdk. Read node_modules/@ui-sdk/react/docs/llms.txt to see what's available.

For a custom component, read the relevant sections of docs/core.md and docs/rendering.md in the same package.

## Files Overview

- `src/server.tsx` is our server entry where we map routes to URLs.
- Routes live in `src/routes/<name>/route.ts{x}` and are denoted as code-splitting boundaries via the `"use server-entry"` directive.
- Routes are server components. Interactive components specific to the route live within the `src/routes/<name>/` directory.
- `src/browser.ts` is our browser entry (generally doesn't need to be read or edited)
- `src/global.css` defines our tailwind theme.
- `jundle.config.ts` is the Jundle config file setup for React Server Components (generally doesn't need to be read or edited).
- `server.js` serves our bundled application in production (generally doesn't need to be read or edited).

## Rules

- Always import with the extension. I.e, `./client.tsx`, `#lib/utils.ts`, `./global.css`.
- The `src/` directory is aliased as `#` via `package.json#imports`.
- Never import from parent directories with `../`. For example, to import `cn` from `src/lib/utils.ts`, you would do `import { cn } from "#lib/utils.ts"`.
- Custom, composable components built on the UI SDK live in `src/components/ui`.
- Higher level shared application specific components that compose ui components live in `src/components/<file-or-folder>`
- If a route only requires one or two interactive components, throw them in a `client.tsx` file alongside the route. If we need a bunch or it grows large, create individual files for each feature set / component set alongside the `route.tsx`.
- A `"use client"` directive is required for interactivity / hook useage.
