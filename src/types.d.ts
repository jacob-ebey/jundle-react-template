
declare module "*.css" {
}

declare module "*" with { type: "raw" } {
  const content: string;
  export default content;
}
