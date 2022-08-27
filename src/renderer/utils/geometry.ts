export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Determines if a point is inside a rectangle,
 * returning false for boundary cases.
 */
export const pointIsInsideRect: (point: Point, rect: Rect) => boolean = (
  point,
  rect
) =>
  point.x > rect.x &&
  point.x < rect.x + rect.w &&
  point.y > rect.y &&
  point.y < rect.y + rect.h;
