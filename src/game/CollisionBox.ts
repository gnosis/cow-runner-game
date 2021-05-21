
/**
 * Collision box object.
 * @param {number} x X position.
 * @param {number} y Y Position.
 * @param {number} w Width.
 * @param {number} h Height.
 */
 // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
 export function CollisionBox(this: any, this: any, this: any, this: any, x: any, y: any, w: any, h: any) {
  this.x = x;
  this.y = y;
  this.width = w;
  this.height = h;
};
