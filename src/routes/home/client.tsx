"use client";

import { Suspense, useState } from "react";
import { Input } from "@ui-sdk/react/input";

import { Frame } from "#components/frame";

export function DynamicFrameSrc() {
  const [name, setName] = useState("");

  return (
    <div>
      <Input
        onInput={(e) => {
          setName(e.currentTarget.value);
        }}
      />
      <Suspense fallback="Loading...">
        <Frame src={`/example-frame${name.trim() ? `/${name.trim()}` : ""}`} />
      </Suspense>
    </div>
  );
}

const MICROLIGHTER =
  "https://esm.sh/microlighter@2.2.0/es2022/micro-lighter-element.min.mjs";
if (typeof document !== "undefined") {
  import(/* @vite-ignore */ MICROLIGHTER);
}

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <micro-lighter
      language={language}
      controls="copy"
      data-syntax-theme="github"
    >
      <pre className="flex overflow-x-auto">
        <code className="flex-1 p-4">{code}</code>
      </pre>
    </micro-lighter>
  );
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "micro-lighter": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          controls?: string;
          language: string;
        },
        HTMLElement
      >;
    }
  }
}
