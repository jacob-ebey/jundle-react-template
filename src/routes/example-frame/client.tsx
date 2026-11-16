"use client";

import { Button } from "@ui-sdk/react/button";

import { useFrame } from "#components/frame";

export function ReloadSelf() {
  const frame = useFrame();
  return (
    <Button type="button" onClick={frame.reload}>
      Reload Self {frame.pending ? "(pending)" : null}
    </Button>
  );
}
