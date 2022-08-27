/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/bezier-easing/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/bezier-easing/src/index.js ***!
  \*************************************************/
/***/ ((module) => {

eval("/**\n * https://github.com/gre/bezier-easing\n * BezierEasing - use bezier curve for transition easing function\n * by Gaëtan Renaudeau 2014 - 2015 – MIT License\n */\n\n// These values are established by empiricism with tests (tradeoff: performance VS precision)\nvar NEWTON_ITERATIONS = 4;\nvar NEWTON_MIN_SLOPE = 0.001;\nvar SUBDIVISION_PRECISION = 0.0000001;\nvar SUBDIVISION_MAX_ITERATIONS = 10;\n\nvar kSplineTableSize = 11;\nvar kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);\n\nvar float32ArraySupported = typeof Float32Array === 'function';\n\nfunction A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }\nfunction B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }\nfunction C (aA1)      { return 3.0 * aA1; }\n\n// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.\nfunction calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }\n\n// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.\nfunction getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }\n\nfunction binarySubdivide (aX, aA, aB, mX1, mX2) {\n  var currentX, currentT, i = 0;\n  do {\n    currentT = aA + (aB - aA) / 2.0;\n    currentX = calcBezier(currentT, mX1, mX2) - aX;\n    if (currentX > 0.0) {\n      aB = currentT;\n    } else {\n      aA = currentT;\n    }\n  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);\n  return currentT;\n}\n\nfunction newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {\n for (var i = 0; i < NEWTON_ITERATIONS; ++i) {\n   var currentSlope = getSlope(aGuessT, mX1, mX2);\n   if (currentSlope === 0.0) {\n     return aGuessT;\n   }\n   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;\n   aGuessT -= currentX / currentSlope;\n }\n return aGuessT;\n}\n\nfunction LinearEasing (x) {\n  return x;\n}\n\nmodule.exports = function bezier (mX1, mY1, mX2, mY2) {\n  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {\n    throw new Error('bezier x values must be in [0, 1] range');\n  }\n\n  if (mX1 === mY1 && mX2 === mY2) {\n    return LinearEasing;\n  }\n\n  // Precompute samples table\n  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);\n  for (var i = 0; i < kSplineTableSize; ++i) {\n    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);\n  }\n\n  function getTForX (aX) {\n    var intervalStart = 0.0;\n    var currentSample = 1;\n    var lastSample = kSplineTableSize - 1;\n\n    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {\n      intervalStart += kSampleStepSize;\n    }\n    --currentSample;\n\n    // Interpolate to provide an initial guess for t\n    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);\n    var guessForT = intervalStart + dist * kSampleStepSize;\n\n    var initialSlope = getSlope(guessForT, mX1, mX2);\n    if (initialSlope >= NEWTON_MIN_SLOPE) {\n      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);\n    } else if (initialSlope === 0.0) {\n      return guessForT;\n    } else {\n      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);\n    }\n  }\n\n  return function BezierEasing (x) {\n    // Because JavaScript number are imprecise, we should guarantee the extremes are right.\n    if (x === 0) {\n      return 0;\n    }\n    if (x === 1) {\n      return 1;\n    }\n    return calcBezier(getTForX(x), mY1, mY2);\n  };\n};\n\n\n//# sourceURL=webpack://koch-animation/./node_modules/bezier-easing/src/index.js?");

/***/ }),

/***/ "./src/animator.js":
/*!*************************!*\
  !*** ./src/animator.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ KochAnimator)\n/* harmony export */ });\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./src/global.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ \"./src/util.js\");\n/* harmony import */ var _offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./offscreen-canvas-polyfill */ \"./src/offscreen-canvas-polyfill.js\");\n/* harmony import */ var _offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_2__);\n\r\n\r\n\r\n\r\n\r\nconst bigFlakeImg = new Image();\r\nbigFlakeImg.src = \"./assets/koch1.png\"\r\n\r\nlet osBig = new OffscreenCanvas(_global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\nlet osBigCtx = osBig.getContext(\"2d\");\r\nbigFlakeImg.onload = () => {\r\n  osBigCtx.fillStyle = _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigColor;\r\n  osBigCtx.fillRect(0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n\r\n  osBigCtx.globalCompositeOperation = \"destination-in\";\r\n  osBigCtx.drawImage(bigFlakeImg, 0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n}\r\n\r\n\r\nconst smallFlakeImgA = new Image();\r\nconst smallFlakeImgB = new Image();\r\nsmallFlakeImgA.src = \"./assets/koch2ax.png\"\r\nsmallFlakeImgB.src = \"./assets/koch2bx.png\"\r\nlet osSmallA = new OffscreenCanvas(_global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\nlet osSmallACtx = osSmallA.getContext(\"2d\");\r\nsmallFlakeImgA.onload = () => {\r\n  osSmallACtx.fillStyle = _global__WEBPACK_IMPORTED_MODULE_0__.Global.SmallColor;\r\n  osSmallACtx.fillRect(0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n\r\n  osSmallACtx.globalCompositeOperation = \"destination-in\";\r\n  osSmallACtx.drawImage(smallFlakeImgA, 0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n}\r\n\r\nlet osSmallB = new OffscreenCanvas(_global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\nlet osSmallBCtx = osSmallB.getContext(\"2d\");\r\nsmallFlakeImgB.onload = () => {\r\n  osSmallBCtx.fillStyle = _global__WEBPACK_IMPORTED_MODULE_0__.Global.SmallColor;\r\n  osSmallBCtx.fillRect(0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n\r\n  osSmallBCtx.globalCompositeOperation = \"destination-in\";\r\n  osSmallBCtx.drawImage(smallFlakeImgB, 0, 0, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n}\r\n\r\nclass FlakeIteration {\r\n  constructor(x, y, start) {\r\n    this.start = start;\r\n    this.x = x;\r\n    this.y = y;\r\n    this.done = false;\r\n    this.moveEnd = false;\r\n\r\n    this.x2 = this.x + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist * Math.cos(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallTheta);\r\n    this.y2 = this.y + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist * Math.sin(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallTheta);\r\n\r\n  }\r\n  tick(bgCtx, fgCtx, now) {\r\n    if (this.done) return;\r\n\r\n    const ms = now - this.start;\r\n    if (ms < 0) return;\r\n\r\n    if (ms < _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS) {\r\n      // big fall phase\r\n      const frac = (0,_util__WEBPACK_IMPORTED_MODULE_1__.timeToFrac)(ms, _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS);\r\n      const dist = frac * _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist;\r\n      const dx = dist * Math.cos(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallTheta);\r\n      const dy = dist * Math.sin(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallTheta);\r\n      fgCtx.drawImage(osBig, this.x + dx, this.y + dy, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n\r\n    } else if (ms < _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanMS) {\r\n      // small fan phase\r\n      bgCtx.drawImage(\r\n        osBig,\r\n        this.x2,\r\n        this.y2,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n      bgCtx.drawImage(\r\n        osBig,\r\n        this.x2,\r\n        this.y2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 2,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n\r\n\r\n      const frac = (0,_util__WEBPACK_IMPORTED_MODULE_1__.timeToFrac)(ms - _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS, _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanMS);\r\n      const dist = frac * _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanDist;\r\n      const dx = dist * Math.cos(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta);\r\n      const dy = dist * Math.sin(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta);\r\n\r\n      fgCtx.fillStyle = _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigColor;\r\n      fgCtx.fillRect(\r\n        this.x2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize / 2 - _global__WEBPACK_IMPORTED_MODULE_0__.Global.SmallSize,\r\n        this.y2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize / 2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 2 - _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 4,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.SmallSize * 2,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 2\r\n      );\r\n\r\n\r\n      fgCtx.drawImage(\r\n        osSmallB,\r\n        this.x2 + dx,\r\n        this.y2 + dy,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n      fgCtx.drawImage(\r\n        osSmallA,\r\n        this.x2 - dx,\r\n        this.y2 - dy,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n\r\n    } else if (ms >= _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanMS) {\r\n      // delay\r\n      bgCtx.drawImage(osBig, this.x, this.y, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize, _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize);\r\n\r\n      bgCtx.drawImage(\r\n        osSmallB,\r\n        this.x2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanDist * Math.cos(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta),\r\n        this.y2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanDist * Math.sin(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta),\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n      bgCtx.drawImage(\r\n        osSmallA,\r\n        this.x2 - _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanDist * Math.cos(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta),\r\n        this.y2 - _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanDist * Math.sin(_global__WEBPACK_IMPORTED_MODULE_0__.Global.FanTheta),\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize,\r\n        _global__WEBPACK_IMPORTED_MODULE_0__.Global.ImageSize\r\n      );\r\n\r\n    }\r\n    if (ms >= _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDelay) {\r\n      // this.done = true;\r\n      this.start = this.start + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FanMS + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDelay;\r\n    }\r\n\r\n  }\r\n}\r\n\r\nconst first = 0;\r\nclass KochAnimator {\r\n  constructor(canvas) {\r\n    this.tickables = [];\r\n    this.ctx = canvas.getContext(\"2d\");\r\n    this.w = canvas.width;\r\n    this.h = canvas.height;\r\n    this.outerSize = Math.round(Math.sqrt(this.w * this.w + this.h * this.h)) + 2 * _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize;\r\n    console.log(this.outerSize)\r\n    const bgLayer = new OffscreenCanvas(this.outerSize, this.outerSize);\r\n    const fgLayer = new OffscreenCanvas(this.outerSize, this.outerSize);\r\n    this.bgCtx = bgLayer.getContext(\"2d\");\r\n    this.fgCtx = fgLayer.getContext(\"2d\");\r\n\r\n    // this.ctx.translate(this.w / 2, this.h / 2);\r\n    // this.ctx.rotate(Math.PI / 2);\r\n    // this.ctx.translate(-this.w / 2, -this.h / 2);\r\n\r\n    for (let x = 0; x < this.outerSize; x += _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize * _global__WEBPACK_IMPORTED_MODULE_0__.SQRT3) {\r\n      for (let i = 0, y = 0; y < this.outerSize; i++) {\r\n        y = 0 + (_global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist) * i;\r\n        let t = first - (_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDelay) * i;\r\n        this.tickables.push(new FlakeIteration(x, y, t))\r\n      }\r\n    }\r\n\r\n\r\n    for (let x = -_global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize * _global__WEBPACK_IMPORTED_MODULE_0__.SQRT3 / 2; x < this.outerSize; x += _global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize * _global__WEBPACK_IMPORTED_MODULE_0__.SQRT3) {\r\n      for (let i = 0, y = 0; y < this.outerSize; i++) {\r\n        y = -_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist + (_global__WEBPACK_IMPORTED_MODULE_0__.Global.BigSize / 2 + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDist) * i;\r\n        let t = first + _global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDelay / 2 - (_global__WEBPACK_IMPORTED_MODULE_0__.Global.FallDelay) * i;\r\n\r\n        this.tickables.push(new FlakeIteration(x, y, t))\r\n      }\r\n    }\r\n\r\n\r\n    console.log(this.tickables)\r\n\r\n    requestAnimationFrame(() => this.tick());\r\n\r\n    // temp\r\n    // setTimeout(() => {\r\n    //   let w = this.ctx.canvas.width;\r\n    //   let h = this.ctx.canvas.height;\r\n    //   let osCanvas = new OffscreenCanvas(this.ctx.canvas.width, this.ctx.canvas.height)\r\n    //   const osctx = osCanvas.getContext(\"2d\");\r\n    //   osctx.fillStyle = \"red\";\r\n    //   osctx.fillRect(0, 0, w, h);\r\n    //   osctx.globalCompositeOperation = \"destination-in\"\r\n    //   osctx.drawImage(bigFlakeImg, 0, 0);\r\n\r\n    //   this.ctx.fillRect(0, 0, w, h);\r\n\r\n    //   this.ctx.globalCompositeOperation = \"destination-out\"\r\n    //   this.ctx.save()\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n    //   // this.ctx.translate(Global.FanDist * 6, Global.FanDist * 2 * SQRT3);\r\n    //   this.ctx.translate(Global.BigSize * 1.5 / SQRT3, Global.BigSize / 2);\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n    //   this.ctx.save();\r\n    //   this.ctx.translate(Global.BigSize * 1.5 / SQRT3 * -2, 0);\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n    //   this.ctx.translate(0, -Global.BigSize);\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n    //   this.ctx.restore();\r\n    //   this.ctx.translate(0, -Global.BigSize);\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n\r\n    //   this.ctx.restore()\r\n    //   this.ctx.translate(0, Global.BigSize);\r\n    //   this.ctx.drawImage(osCanvas, 0, 0)\r\n\r\n\r\n    // }, 1000)\r\n  }\r\n\r\n  tick() {\r\n    const now = performance.now();\r\n    for (let i = 0; i < this.tickables.length; i++) {\r\n      const tickable = this.tickables[i];\r\n      tickable.tick(this.bgCtx, this.fgCtx, now);\r\n      if (tickable.done) this.tickables.splice(i--, 1)\r\n    }\r\n\r\n    this.ctx.clearRect(0, 0, this.w, this.h)\r\n    this.ctx.drawImage(this.bgCtx.canvas, (this.w - this.outerSize) / 2, (this.h - this.outerSize) / 2);\r\n    this.ctx.drawImage(this.fgCtx.canvas, (this.w - this.outerSize) / 2, (this.h - this.outerSize) / 2);\r\n\r\n\r\n    this.fgCtx.clearRect(0, 0, this.outerSize, this.outerSize)\r\n    this.bgCtx.clearRect(0, 0, this.outerSize, this.outerSize)\r\n    requestAnimationFrame(() => this.tick());\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://koch-animation/./src/animator.js?");

/***/ }),

/***/ "./src/global.js":
/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Global\": () => (/* binding */ Global),\n/* harmony export */   \"SQRT3\": () => (/* binding */ SQRT3)\n/* harmony export */ });\n/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bezier-easing */ \"./node_modules/bezier-easing/src/index.js\");\n/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bezier_easing__WEBPACK_IMPORTED_MODULE_0__);\n\r\nconst SQRT3 = Math.sqrt(3);\r\n\r\nconst Global = {\r\n  BezierEase: bezier_easing__WEBPACK_IMPORTED_MODULE_0___default()(.52, 0, .36, 1.01),\r\n  BigColor: '#add',\r\n  SmallColor: '#385',\r\n  FallMS: 1600,\r\n  FallDelay: 400,\r\n  FanMS: 1200,\r\n  FallTheta: Math.PI / 2,\r\n  Scale: .3,\r\n  FanTheta: Math.PI,\r\n  get ImageSize() { return this.Scale * 1000 },\r\n  get BigSize() { return this.Scale * 480 },\r\n  get SmallSize() { return this.BigSize / SQRT3 },\r\n  get FanDist() { return this.SmallSize / 2 },\r\n  get FallDist() { return this.BigSize / 2 },\r\n}\r\n\n\n//# sourceURL=webpack://koch-animation/./src/global.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./offscreen-canvas-polyfill */ \"./src/offscreen-canvas-polyfill.js\");\n/* harmony import */ var _offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_offscreen_canvas_polyfill__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _animator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animator */ \"./src/animator.js\");\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global */ \"./src/global.js\");\n\r\n\r\n\r\n\r\nwindow.addEventListener(\"load\", () => {\r\n  startAnimation()\r\n})\r\n\r\nfunction startAnimation() {\r\n  const c = document.getElementById(\"mainCanvas\");\r\n  c.width = c.clientWidth;\r\n  c.height = c.clientHeight;\r\n  c.style.backgroundColor = _global__WEBPACK_IMPORTED_MODULE_2__.Global.SmallColor;\r\n  const k = new _animator__WEBPACK_IMPORTED_MODULE_1__[\"default\"](c);\r\n\r\n}\r\n\r\nlet resizeTimeout = null;\r\nwindow.addEventListener(\"resize\", () => {\r\n  clearTimeout(resizeTimeout);\r\n  resizeTimeout = setTimeout(startAnimation, 500);\r\n});\r\n\n\n//# sourceURL=webpack://koch-animation/./src/main.js?");

/***/ }),

/***/ "./src/offscreen-canvas-polyfill.js":
/*!******************************************!*\
  !*** ./src/offscreen-canvas-polyfill.js ***!
  \******************************************/
/***/ (() => {

eval("if (!window.OffscreenCanvas) {\r\n  window.OffscreenCanvas = class OffscreenCanvas {\r\n    constructor(width, height) {\r\n      let canvas = document.createElement(\"canvas\");\r\n      canvas.width = width;\r\n      canvas.height = height;\r\n      return canvas;\r\n    }\r\n  };\r\n}\r\n\n\n//# sourceURL=webpack://koch-animation/./src/offscreen-canvas-polyfill.js?");

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"get0Offset\": () => (/* binding */ get0Offset),\n/* harmony export */   \"get180Offset\": () => (/* binding */ get180Offset),\n/* harmony export */   \"get240Offset\": () => (/* binding */ get240Offset),\n/* harmony export */   \"get60Offset\": () => (/* binding */ get60Offset),\n/* harmony export */   \"timeToFrac\": () => (/* binding */ timeToFrac)\n/* harmony export */ });\n/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global */ \"./src/global.js\");\n\r\n\r\nfunction timeToFrac(ms, dur) {\r\n  const frac = ms / dur;\r\n  if (frac > 1) return 1;\r\n  if (frac < 0) return 0;\r\n  return _global__WEBPACK_IMPORTED_MODULE_0__.Global.BezierEase(frac);\r\n}\r\n\r\nconst COS60 = Math.cos(Math.PI / 3)\r\nconst SIN60 = Math.sin(Math.PI / 3)\r\nfunction get60Offset(x, y, dist) {\r\n  return [\r\n    x + (dist * COS60),\r\n    y + (dist * SIN60),\r\n  ]\r\n}\r\n\r\nfunction get240Offset(x, y, dist) {\r\n  return [\r\n    x - dist * COS60,\r\n    y - dist * SIN60,\r\n  ]\r\n}\r\n\r\nfunction get0Offset(x, y, dist) {\r\n  return [\r\n    x + dist,\r\n    y,\r\n  ]\r\n}\r\n\r\nfunction get180Offset(x, y, dist) {\r\n  return [\r\n    x - dist,\r\n    y,\r\n  ]\r\n}\n\n//# sourceURL=webpack://koch-animation/./src/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;