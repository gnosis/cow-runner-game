
export interface Position {
  x: number,
  y: number
}

/**
* Animation states.
* @enum {string}
*/
export enum Status {
  CRASHED,
  DUCKING,
  JUMPING,
  RUNNING,
  WAITING
}
