"use client";

import { useReloadFrame } from "#components/client-frame.tsx";
import { Button } from "@ui-sdk/react/button";

export function ReloadSelf() {
  const [reloadFrame, pending] = useReloadFrame();
  return (
    <Button type="button" onClick={reloadFrame}>
      Reload Self {pending ? "(pending)" : null}
    </Button>
  );
}
