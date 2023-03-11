import { Vector } from "p5";

export class Particle {
  pos;
  vel;
  w;
  acc;
  color;

  constructor() {
    this.pos = Vector.random2D().mult(edgeLength + NOTE_SIZE);
    this.vel = createVector(0, 0);
    this.w = random(2 * PX, 4 * PX);
    this.acc = this.pos.copy().mult(random(0.001, 0.0001) / (this.w * 5));
    this.color = (random(180, 255), random(180, 255), random(180, 255));
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
      this.pos.x > WIDTH ||
      this.pos.x < -WIDTH ||
      this.pos.y > HEIGHT ||
      this.pos.y < -HEIGHT
    ) {
      return true;
    } else return false;
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.w);
  }
}
