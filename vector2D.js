export const Vector = {
  vector: (x, y) => {return {x: x, y: y}},
  add: (v1, v2) => {return {x: v1.x + v2.x, y: v1.y + v2.y}},
  sub: (v1, v2) => {return {x: v1.x - v2.x, y: v1.y - v2.y}},
  mag: (v) => {return Math.sqrt(v.x * v.x + v.y * v.y)},
  scale: (v, s) => {return {x: v.x * s, y: v.y * s}},
  sum: (vs) => {return vs.reduce(Vector.add, Vector.vector(0,0))},
  zero: {x: 0, y: 0}
}