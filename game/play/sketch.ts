import type p5Types from "p5";
import { handleMouseClick } from "game/landing/functions";

let width: number = 0;
let height: number = 0;

export const preload = (p5: p5Types): void => {};

export const setup = (p5: p5Types, canvasParentRef: Element): void => {
  width = p5.windowWidth;
  height = p5.windowHeight;
  const canvas = p5.createCanvas(width, height).parent(canvasParentRef);
};

export const windowResized = (p: p5Types): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  p.resizeCanvas(width, height);
};

export const draw = (p: p5Types): void => {
  p.background(0);
};
