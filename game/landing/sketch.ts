import type p5Types from "p5";
import { handleMouseClick } from "game/landing/functions";
import { Particle } from "../Particle";

let song;
let volume = 0.1;
let fft;
let particles = [];
let bg;

let width: number = 0;
let height: number = 0;

export const preload = (p): void => {
  let songDir = "";
  let songBg = "";
  let num = Math.floor(Math.random() * 3) + 1; // random number between 1 and 3
  switch (num) {
    case 1:
      songDir = "heaven";
      songBg = "bg.jpg";
      break;
    case 2:
      songDir = "invincible";
      songBg = "bg.png";
      break;
    case 3:
      songDir = "mortals";
      songBg = "bg.jpg";
      break;
  }
  p.soundFormats("mp3", "wav", "ogg");
  song = p.loadSound(`/res/songs/${songDir}/audio.mp3`);
  bg = p.loadImage(`/res/songs/${songDir}/${songBg}`);
};

export const setup = (p, canvasParentRef: Element): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  const canvas = p.createCanvas(width, height).parent(canvasParentRef);
  canvas.mouseClicked(() => handleMouseClick(song, p));
  fft = new global.p5.FFT(0.1);
  song.setVolume(volume);
  p.angleMode(p.DEGREES);
};

export const windowResized = (p): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  p.resizeCanvas(width, height);
};

export const draw = (p): void => {
  p.background(0);
  p.translate(width / 2, height / 2);
  p.imageMode(p.CENTER);
  p.rectMode(p.CENTER);

  fft.analyze();
  let amp = fft.getEnergy(20, 200);
  p.push();
  if (amp > 200) {
    p.rotate(p.random(-0.5, 0.5));
  }
  p.image(bg, 0, 0, width + 20, height + 20);
  p.pop();
  // dark filter
  let alpha = p.map(amp, 0, 255, 180, 150);
  p.fill(0, alpha);
  p.noStroke();
  p.rect(0, 0, width, height);

  p.stroke(255);
  p.strokeWeight(3);
  let wave = fft.waveform();
  for (let t = -1; t <= 1; t += 2) {
    p.beginShape();
    for (let i = 0; i < width; i += 1) {
      let index = p.floor(p.map(i, 0, 180, 0, wave.length - 1));

      let r = p.map(wave[index] * (1 - volume) * 10, -1, 1, 150, 350);
      let x = r * p.sin(i) * t;
      let y = r * p.cos(i);
      p.vertex(x, y);
    }
    p.endShape();
  }

  let particle = new Particle(width, height, p);
  particles.push(particle);
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].edges()) {
      particles.splice(i, 1);
    } else {
      particles[i].update(amp > 210);
      particles[i].show(p);
    }
  }
};
