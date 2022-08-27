import { Global } from "./global";

export function timeToFrac(ms, dur) {
  const frac = ms / dur;
  if (frac > 1) return 1;
  if (frac < 0) return 0;
  return Global.BezierEase(frac);
}

const COS60 = Math.cos(Math.PI / 3)
const SIN60 = Math.sin(Math.PI / 3)
export function get60Offset(x, y, dist) {
  return [
    x + (dist * COS60),
    y + (dist * SIN60),
  ]
}

export function get240Offset(x, y, dist) {
  return [
    x - dist * COS60,
    y - dist * SIN60,
  ]
}

export function get0Offset(x, y, dist) {
  return [
    x + dist,
    y,
  ]
}

export function get180Offset(x, y, dist) {
  return [
    x - dist,
    y,
  ]
}