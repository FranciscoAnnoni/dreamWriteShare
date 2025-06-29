/// <reference types="vite/client" />

// Declaraciones de tipos para archivos CSS
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

// Declaraciones para otros archivos de assets
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}
