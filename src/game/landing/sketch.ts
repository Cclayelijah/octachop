import type p5Types from "p5";
import { Particle } from "../Particle";
import { songTracks } from "./constants";

let p;
let canvas;
let context;
let started = false;
let paused = true;
let songs = [];
let songNum;
let volume = 0.9;
let fft;
let particles = [];
let bg = [];

let width: number = 0;
let height: number = 0;
let px;
let edgeLength;
let arc1;
let arc2;
let arc3;

export const preload = (p5): void => {
  p = p5;
  p5.soundFormats("mp3", "wav", "ogg");
  songTracks.forEach((song) => {
    songs.push(p5.loadSound(`/res/songs/${song.dir}/audio.mp3`));
    bg.push(p5.loadImage(`/res/songs/${song.dir}/${song.bg}`));
  });
};

export const setup = (p, canvasParentRef: Element): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.createCanvas(width, height).parent(canvasParentRef);
  songNum = Math.floor(Math.random() * songTracks.length) + 1; // random song
  fft = new global.p5.FFT(0.2);
  fft.setInput(songs[songNum]);
  for (let i = 0; i < songs.length; i++) {
    songs[i].setVolume(volume);
    songs[i].onended(() => {
      if (!paused) {
        if (i + 1 > songs.length - 1) {
          fft.setInput(songs[0]);
          songNum = 0;
        } else {
          fft.setInput(songs[i + 1]);
          songNum = i + 1;
        }
        songs[songNum].play();
      }
    });
  }
  p.angleMode(p.DEGREES);
  // arc1.mouseOver();
};

export const windowResized = (p): void => {
  width = p.windowWidth;
  height = p.windowHeight;
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.resizeCanvas(width, height);
};

export const keyPressed = (p, e) => {
  if (e.keyCode == 32) {
    e.preventDefault();
    p.fullscreen();
  }
  handlePause();
};

export const mouseClicked = (p, e) => {
  if (!started) {
    context = new AudioContext();
    started = true;
  }
};

const handlePause = () => {
  if (paused) {
    context.resume().then(() => {
      songs[songNum].play();
      console.log("play");
      p.loop();
    });
  } else {
    songs[songNum].pause();
    console.log("pause");
    p.noLoop();
  }
  paused = !paused;
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
  p.image(
    bg[songNum],
    0,
    0,
    width + 20 + p.map(amp, 0, 240, 0, width / 8),
    height + 20 + p.map(amp, 0, 240, 0, height / 8)
  );
  // slice options
  p.rotate(amp / 20);
  p.stroke(190, 183, 223);
  // p.fill(255, 150);
  let alpha = p.map(amp, 240, 0, 120, 30);
  // p.fill(0, 100);
  p.fill(0, alpha);
  arc1 = p.arc(0, 0, width * 2, width * 2, 0, 120 - 8, p.PIE);
  arc2 = p.arc(0, 0, width * 2, width * 2, 120, 240 - 16, p.PIE);
  arc3 = p.arc(0, 0, width * 2, width * 2, 240, 360 - 12, p.PIE);
  p.fill(0);
  // p.noStroke();
  p.ellipse(0, 0, p.map(amp, 0, 250, 10 * px, 24 * px) + (amp > 210 ? 4 : 0));
  p.pop();
  // dark filter
  // p.fill(0, alpha);
  // p.noStroke();
  // p.rect(0, 0, width, height);

  // p.fill(0, alpha);
  p.fill(0, 100);
  p.stroke(255);
  p.strokeWeight(3);
  let wave = fft.waveform();
  if (canvas) canvas.drawingContext.shadowColor = "black";
  if (canvas) canvas.drawingContext.shadowBlur = 100 * px;
  for (let t = -1; t <= 1; t += 2) {
    p.beginShape();
    for (let i = 0; i < width; i += 0.5) {
      let index = p.floor(p.map(i, 0, 180, 0, wave.length - 1));

      let r =
        p.map(wave[index], -1, 1, 30 * px, edgeLength * 2 - 50 * px) *
        (1 - volume) *
        10;
      let x = r * p.sin(i) * t * 1.2 * px;
      let y = r * p.cos(i) * 1.2 * px;
      p.vertex(x, y);
    }
    p.endShape();
  }
  if (canvas) canvas.drawingContext.shadowBlur = 0 * px;

  if (paused) return;
  let particle = new Particle(px, edgeLength, p, canvas);
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
