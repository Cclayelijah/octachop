// import { Vector } from "p5";
import type p5Types from "p5";

let px: number = 0;
let p;
let canvas;
export class Particle {
  pos;
  vel;
  w;
  acc;
  color;
  static edgeLength;

  constructor(pixel, edgeLength, p5: p5Types, c) {
    canvas = c;
    p = p5;
    px = pixel;
    Particle.edgeLength = edgeLength;
    this.pos = global.p5.Vector.random2D().mult(Particle.edgeLength + 12 * px);
    this.vel = p.createVector(0, 0);
    this.w = p.random(3 * px, 5 * px);
    this.acc = this.pos.copy().mult(p.random(0.001, 0.0001) / (this.w * 5));
    this.color = (p.random(180, 255), p.random(180, 255), p.random(180, 255));
  }

  update(condition) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (condition) {
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if (
      this.pos.x > p.windowWidth ||
      this.pos.x < -p.windowWidth ||
      this.pos.y > p.windowHeight ||
      this.pos.y < -p.windowHeight
    ) {
      return true;
    } else return false;
  }

  show() {
    p.noStroke();
    if (canvas) canvas.drawingContext.shadowBlur = 2 * px;
    if (canvas) canvas.drawingContext.shadowColor = "rgb(0, 0, 0)";
    p.fill(this.color);
    p.ellipse(this.pos.x, this.pos.y, this.w);
  }
}
