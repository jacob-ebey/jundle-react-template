"use client";

import { Button } from "@ui-sdk/react/button";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Button type="button" onClick={() => setCount((c) => c + 1)}>
      Count {count}
    </Button>
  );
}
