"use server-entry";

let count = 0;

export default async function ExampleFrame() {
  await new Promise((r) => setTimeout(r, 500));
  return (
    <div>
      <p>Hello, Frame {count++}!</p>
    </div>
  );
}
