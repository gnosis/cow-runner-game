/**
 * Default game width.
 */
export const DEFAULT_WIDTH = 600;

 /**
  * Frames per second.
  * @const
  */
export const FPS = 60;

// export const IS_HIDPI = window.devicePixelRatio > 1;
export const IS_HIDPI = true
export const IS_IOS = /iPad|iPhone|iPod/.test(window.navigator.platform);
export const IS_ANDROID = /Android/.test(window.navigator.userAgent);
export const IS_TOUCH_ENABLED = 'ontouchstart' in window;
export const IS_MOBILE = IS_TOUCH_ENABLED;
 