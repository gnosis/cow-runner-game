// import { Runner } from "game";

// declare global {
//   interface Window {
//     Runner?: typeof Runner
//   }
// }

// interface CanvasRenderingContext2D {
//   webkitBackingStorePixelRatio?: number
// }

declare module '*.png' {
  const content: any;
  export default content;
}