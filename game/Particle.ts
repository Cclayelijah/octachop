// import { Vector } from "p5";
import type p5Types from "p5";

let width: number = 0;
let height: number = 0;
let size: number = 0;
let px: number = 0;
let edgeLength: number = 0;
export class Particle {
  pos;
  vel;
  w;
  acc;
  color;
  static edgeLength;

  constructor(w: number, h: number, p: p5Types) {
    width = w;
    height = h;
    size = w >= h ? h : w;
    px = size / 800;
    Particle.edgeLength = size / 2 - 140 * px;
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
      this.pos.x > width ||
      this.pos.x < -width ||
      this.pos.y > height ||
      this.pos.y < -height
    ) {
      return true;
    } else return false;
  }

  show(p: p5Types) {
    p.noStroke();
    p.fill(this.color);
    p.ellipse(this.pos.x, this.pos.y, this.w);
  }
}
