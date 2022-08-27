import './offscreen-canvas-polyfill';
import KochAnimator from './animator';
import { Global } from './global';

window.addEventListener("load", () => {
  startAnimation()
})

function startAnimation() {
  const c = document.getElementById("mainCanvas");
  c.width = c.clientWidth;
  c.height = c.clientHeight;
  c.style.backgroundColor = Global.SmallColor;
  const k = new KochAnimator(c);

}

let resizeTimeout = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(startAnimation, 500);
});
