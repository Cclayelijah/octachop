import type p5Types from "p5";

let width: number = 0;
let height: number = 0;

export const preload = (p5): void => {};

export const setup = (p5, canvasParentRef: Element): void => {
  width = p5.windowWidth;
  height = p5.windowHeight;
  const canvas = p5.createCanvas(width, height).parent(canvasParentRef);
};

export const windowResized = (p): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  p.resizeCanvas(width, height);
};

export const draw = (p): void => {
  p.background(0);
};
