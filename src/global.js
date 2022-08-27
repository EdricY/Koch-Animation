import BezierEasing from "bezier-easing";
export const SQRT3 = Math.sqrt(3);

export const Global = {
  BezierEase: BezierEasing(.52, 0, .36, 1.01),
  BigColor: '#add',
  SmallColor: '#385',
  FallMS: 1600,
  FallDelay: 400,
  FanMS: 1200,
  FallTheta: Math.PI / 2,
  Scale: .3,
  FanTheta: Math.PI,
  get ImageSize() { return this.Scale * 1000 },
  get BigSize() { return this.Scale * 480 },
  get SmallSize() { return this.BigSize / SQRT3 },
  get FanDist() { return this.SmallSize / 2 },
  get FallDist() { return this.BigSize / 2 },
}
