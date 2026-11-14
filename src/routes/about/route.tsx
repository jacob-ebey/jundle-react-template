"use server-entry";

import { Counter } from "./counter.tsx";

export default function About() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Hello, About!</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
        </nav>
        <h1>Hello, About!</h1>
        <Counter />
      </body>
    </html>
  );
}
