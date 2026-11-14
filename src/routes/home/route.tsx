"use server-entry";

import { Counter } from "./counter.tsx";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hello, Home!</title>
      </head>
      <body>
        <nav>
          <a href="/about">About</a>
        </nav>
        <h1>Hello, Home!</h1>
        <Counter />
      </body>
    </html>
  );
}
