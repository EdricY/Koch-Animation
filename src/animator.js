import { Global, SQRT3 } from "./global";
import { get180Offset, get0Offset, get60Offset, timeToFrac, } from "./util";
import './offscreen-canvas-polyfill';


const bigFlakeImg = new Image();
bigFlakeImg.src = "./assets/koch1.png"

let osBig = new OffscreenCanvas(Global.ImageSize, Global.ImageSize);
let osBigCtx = osBig.getContext("2d");
bigFlakeImg.onload = () => {
  osBigCtx.fillStyle = Global.BigColor;
  osBigCtx.fillRect(0, 0, Global.ImageSize, Global.ImageSize);

  osBigCtx.globalCompositeOperation = "destination-in";
  osBigCtx.drawImage(bigFlakeImg, 0, 0, Global.ImageSize, Global.ImageSize);
}


const smallFlakeImgA = new Image();
const smallFlakeImgB = new Image();
smallFlakeImgA.src = "./assets/koch2ax.png"
smallFlakeImgB.src = "./assets/koch2bx.png"
let osSmallA = new OffscreenCanvas(Global.ImageSize, Global.ImageSize);
let osSmallACtx = osSmallA.getContext("2d");
smallFlakeImgA.onload = () => {
  osSmallACtx.fillStyle = Global.SmallColor;
  osSmallACtx.fillRect(0, 0, Global.ImageSize, Global.ImageSize);

  osSmallACtx.globalCompositeOperation = "destination-in";
  osSmallACtx.drawImage(smallFlakeImgA, 0, 0, Global.ImageSize, Global.ImageSize);
}

let osSmallB = new OffscreenCanvas(Global.ImageSize, Global.ImageSize);
let osSmallBCtx = osSmallB.getContext("2d");
smallFlakeImgB.onload = () => {
  osSmallBCtx.fillStyle = Global.SmallColor;
  osSmallBCtx.fillRect(0, 0, Global.ImageSize, Global.ImageSize);

  osSmallBCtx.globalCompositeOperation = "destination-in";
  osSmallBCtx.drawImage(smallFlakeImgB, 0, 0, Global.ImageSize, Global.ImageSize);
}

class FlakeIteration {
  constructor(x, y, start) {
    this.start = start;
    this.x = x;
    this.y = y;
    this.done = false;
    this.moveEnd = false;

    this.x2 = this.x + Global.FallDist * Math.cos(Global.FallTheta);
    this.y2 = this.y + Global.FallDist * Math.sin(Global.FallTheta);

  }
  tick(bgCtx, fgCtx, now) {
    if (this.done) return;

    const ms = now - this.start;
    if (ms < 0) return;

    if (ms < Global.FallMS) {
      // big fall phase
      const frac = timeToFrac(ms, Global.FallMS);
      const dist = frac * Global.FallDist;
      const dx = dist * Math.cos(Global.FallTheta);
      const dy = dist * Math.sin(Global.FallTheta);
      fgCtx.drawImage(osBig, this.x + dx, this.y + dy, Global.ImageSize, Global.ImageSize);

    } else if (ms < Global.FallMS + Global.FanMS) {
      // small fan phase
      bgCtx.drawImage(
        osBig,
        this.x2,
        this.y2,
        Global.ImageSize,
        Global.ImageSize
      );
      bgCtx.drawImage(
        osBig,
        this.x2,
        this.y2 + Global.BigSize / 2,
        Global.ImageSize,
        Global.ImageSize
      );


      const frac = timeToFrac(ms - Global.FallMS, Global.FanMS);
      const dist = frac * Global.FanDist;
      const dx = dist * Math.cos(Global.FanTheta);
      const dy = dist * Math.sin(Global.FanTheta);

      fgCtx.fillStyle = Global.BigColor;
      fgCtx.fillRect(
        this.x2 + Global.ImageSize / 2 - Global.SmallSize,
        this.y2 + Global.ImageSize / 2 + Global.BigSize / 2 - Global.BigSize / 4,
        Global.SmallSize * 2,
        Global.BigSize / 2
      );


      fgCtx.drawImage(
        osSmallB,
        this.x2 + dx,
        this.y2 + dy,
        Global.ImageSize,
        Global.ImageSize
      );
      fgCtx.drawImage(
        osSmallA,
        this.x2 - dx,
        this.y2 - dy,
        Global.ImageSize,
        Global.ImageSize
      );

    } else if (ms >= Global.FallMS + Global.FanMS) {
      // delay
      bgCtx.drawImage(osBig, this.x, this.y, Global.ImageSize, Global.ImageSize);

      bgCtx.drawImage(
        osSmallB,
        this.x2 + Global.FanDist * Math.cos(Global.FanTheta),
        this.y2 + Global.FanDist * Math.sin(Global.FanTheta),
        Global.ImageSize,
        Global.ImageSize
      );
      bgCtx.drawImage(
        osSmallA,
        this.x2 - Global.FanDist * Math.cos(Global.FanTheta),
        this.y2 - Global.FanDist * Math.sin(Global.FanTheta),
        Global.ImageSize,
        Global.ImageSize
      );

    }
    if (ms >= Global.FallMS + Global.FanMS + Global.FallDelay) {
      // this.done = true;
      this.start = this.start + Global.FallMS + Global.FanMS + Global.FallDelay;
    }

  }
}

const first = 0;
export default class KochAnimator {
  constructor(canvas) {
    this.tickables = [];
    this.ctx = canvas.getContext("2d");
    this.w = canvas.width;
    this.h = canvas.height;
    this.outerSize = Math.round(Math.sqrt(this.w * this.w + this.h * this.h)) + 2 * Global.BigSize;
    console.log(this.outerSize)
    const bgLayer = new OffscreenCanvas(this.outerSize, this.outerSize);
    const fgLayer = new OffscreenCanvas(this.outerSize, this.outerSize);
    this.bgCtx = bgLayer.getContext("2d");
    this.fgCtx = fgLayer.getContext("2d");

    // this.ctx.translate(this.w / 2, this.h / 2);
    // this.ctx.rotate(Math.PI / 2);
    // this.ctx.translate(-this.w / 2, -this.h / 2);

    for (let x = 0; x < this.outerSize; x += Global.BigSize * SQRT3) {
      for (let i = 0, y = 0; y < this.outerSize; i++) {
        y = 0 + (Global.BigSize / 2 + Global.FallDist) * i;
        let t = first - (Global.FallDelay) * i;
        this.tickables.push(new FlakeIteration(x, y, t))
      }
    }


    for (let x = -Global.BigSize * SQRT3 / 2; x < this.outerSize; x += Global.BigSize * SQRT3) {
      for (let i = 0, y = 0; y < this.outerSize; i++) {
        y = -Global.FallDist + (Global.BigSize / 2 + Global.FallDist) * i;
        let t = first + Global.FallDelay / 2 - (Global.FallDelay) * i;

        this.tickables.push(new FlakeIteration(x, y, t))
      }
    }


    console.log(this.tickables)

    requestAnimationFrame(() => this.tick());

    // temp
    // setTimeout(() => {
    //   let w = this.ctx.canvas.width;
    //   let h = this.ctx.canvas.height;
    //   let osCanvas = new OffscreenCanvas(this.ctx.canvas.width, this.ctx.canvas.height)
    //   const osctx = osCanvas.getContext("2d");
    //   osctx.fillStyle = "red";
    //   osctx.fillRect(0, 0, w, h);
    //   osctx.globalCompositeOperation = "destination-in"
    //   osctx.drawImage(bigFlakeImg, 0, 0);

    //   this.ctx.fillRect(0, 0, w, h);

    //   this.ctx.globalCompositeOperation = "destination-out"
    //   this.ctx.save()
    //   this.ctx.drawImage(osCanvas, 0, 0)
    //   // this.ctx.translate(Global.FanDist * 6, Global.FanDist * 2 * SQRT3);
    //   this.ctx.translate(Global.BigSize * 1.5 / SQRT3, Global.BigSize / 2);
    //   this.ctx.drawImage(osCanvas, 0, 0)
    //   this.ctx.save();
    //   this.ctx.translate(Global.BigSize * 1.5 / SQRT3 * -2, 0);
    //   this.ctx.drawImage(osCanvas, 0, 0)
    //   this.ctx.translate(0, -Global.BigSize);
    //   this.ctx.drawImage(osCanvas, 0, 0)
    //   this.ctx.restore();
    //   this.ctx.translate(0, -Global.BigSize);
    //   this.ctx.drawImage(osCanvas, 0, 0)

    //   this.ctx.restore()
    //   this.ctx.translate(0, Global.BigSize);
    //   this.ctx.drawImage(osCanvas, 0, 0)


    // }, 1000)
  }

  tick() {
    const now = performance.now();
    for (let i = 0; i < this.tickables.length; i++) {
      const tickable = this.tickables[i];
      tickable.tick(this.bgCtx, this.fgCtx, now);
      if (tickable.done) this.tickables.splice(i--, 1)
    }

    this.ctx.clearRect(0, 0, this.w, this.h)
    this.ctx.drawImage(this.bgCtx.canvas, (this.w - this.outerSize) / 2, (this.h - this.outerSize) / 2);
    this.ctx.drawImage(this.fgCtx.canvas, (this.w - this.outerSize) / 2, (this.h - this.outerSize) / 2);


    this.fgCtx.clearRect(0, 0, this.outerSize, this.outerSize)
    this.bgCtx.clearRect(0, 0, this.outerSize, this.outerSize)
    requestAnimationFrame(() => this.tick());
  }
}
