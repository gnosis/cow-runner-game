import { Runner } from "game";

declare global {
  interface Window {
    Runner?: typeof Runner
  }
}


declare module '*.png' {
  const content: any;
  export default content;
}

interface CanvasRenderingContext2D {
  webkitBackingStorePixelRatio?: number
}