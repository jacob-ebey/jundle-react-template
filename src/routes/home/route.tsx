"use server-entry";

import { Button } from "@ui-sdk/react/button";
import { Separator } from "@ui-sdk/react/separator";
import { Suspense } from "react";

import { ServerFrame } from "#components/server-frame.tsx";
import { ReloadFrame } from "./client.tsx";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hello, Home!</title>
      </head>
      <body className="container flex-1 pt-6 pb-24 sm:pt-10">
        <main className="flex flex-col gap-6 sm:gap-10">
          <h1 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-6xl sm:leading-[1.08] lg:text-7xl">
            A template for building the next generation of React applications
            with Jundle and the UI SDK.
          </h1>

          <Separator />

          <div className="flex gap-4 sm:gap-5 flex-col lg:items-center lg:flex-row">
            <div className="flex-1 flex flex-col gap-4 sm:gap-5">
              <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-5xl sm:leading-[1.08] lg:text-6xl">
                Jundle? What's that?
              </h2>
              <p className="max-w-200 text-lg leading-normal tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
                It's a new bundler built for speed with a cohecive graph model
                that represents your entire full-stack, multi-graph
                applications.
              </p>
            </div>
            <Button
              className="no-underline flex h-16 items-center text-lg sm:h-20 sm:px-8 sm:text-2xl"
              render={<a href="/docs" />}
            >
              Read the Jundle docs
            </Button>
          </div>

          <Separator />

          <div className="flex gap-4 sm:gap-5 flex-col lg:items-center lg:flex-row">
            <div className="flex-1 flex flex-col gap-4 sm:gap-5">
              <h2 className="text-4xl leading-[1.15] font-[450] tracking-[-0.045em] text-balance sm:text-5xl sm:leading-[1.08] lg:text-6xl">
                UI SDK
              </h2>
              <p className="max-w-200 text-lg leading-normal tracking-[-0.015em] text-pretty text-foreground/70 sm:text-xl lg:text-2xl lg:leading-[1.45]">
                A library of behaviors for agents to build the next generation
                of user interfaces.
              </p>
            </div>
            <Button
              className="no-underline flex h-16 items-center text-lg sm:h-20 sm:px-8 sm:text-2xl"
              render={<a href="https://ui-sdk.dev/" />}
            >
              Read the UI SDK docs
            </Button>
          </div>

          <Separator />

          <ReloadFrame />
          <Suspense fallback="loading...">
            <ServerFrame id="example-frame" src="/example-frame" />
          </Suspense>

          <Separator />
        </main>
      </body>
    </html>
  );
}
