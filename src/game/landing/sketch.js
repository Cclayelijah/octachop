import { Particle } from "../Particle";
import { songTracks } from "./constants";
import { canHandleKeyPress } from "../lib/sketchManager";
import { CURSOR_COLOR, CURSOR_SIZE } from "../Settings";


let p;
let canvas;
let context;
let started = false;
let contextStarted = false;
let paused = true;
let songs = [];
let songNum;
let volume = 0.5;
let fft;
let particles = [];
let bg = [];

let width = 0;
let height = 0;
let px;
let edgeLength;
let arc1;
let arc2;
let arc3;

// Volume display variables
let showVolumeDisplay = false;
let volumeDisplayTimer = 0;
let volumeDisplayDuration = 2000; // Show for 2 seconds
let mouseX = 0;
let mouseY = 0;

// Cursor tracking variables
let posX, posY;

export const preload = (p5) => {
  p = p5;
  p5.soundFormats("mp3", "wav", "ogg");
  songTracks.forEach((song) => {
    songs.push(p5.loadSound(`/res/songs/${song.dir}/audio.mp3`));
    bg.push(p5.loadImage(`/res/songs/${song.dir}/${song.bg}`));
  });
};

export const setup = (p5, canvasParentRef) => {
  p = p5;
  width = p.windowWidth;
  height = p.windowHeight;
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.createCanvas(width, height).parent(canvasParentRef);
  
  // Safety check: ensure we have songs loaded
  if (songs.length === 0) {
    console.warn('No songs loaded in setup');
    return;
  }
  
  songNum = Math.floor(Math.random() * songTracks.length); 
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
  
  // Initialize cursor position
  posX = width / 2;
  posY = height / 2;
  // arc1.mouseOver();
};

export const windowResized = (p5) => {
  p = p5;
  width = p.windowWidth;
  height = p.windowHeight;
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.resizeCanvas(width, height);
};

export const keyPressed = (p5, e) => {
  // Use sketch manager to check if we can handle key press
  if (!canHandleKeyPress('landing', p5.keyCode)) {
    console.log('Landing sketch cannot handle keypress - blocked by sketch manager');
    return;
  }
  
  // Additional context checks
  if (!songs || songs.length === 0) {
    console.log('Landing sketch - no songs available');
    return;
  }
  
  console.log('Landing keyPressed:', p5.keyCode);
  p = p5;
  
  if (!contextStarted) {
    context = new AudioContext();
    contextStarted = true;
  }
  if (!started) {
    started = true;
  }
  if (e.keyCode === 32) {
    e.preventDefault();
    handlePause();
  }
};

export const mouseClicked = (p5, e) => {
  p = p5;
  if (!contextStarted) {
    context = new AudioContext();
    contextStarted = true;
  }
};

export const mouseWheel = (p5, event) => {
  p = p5;
  
  // Only handle scroll if this is the active sketch
  if (!canHandleKeyPress('landing')) {
    return;
  }

  // Update mouse position for volume display
  mouseX = p5.mouseX;
  mouseY = p5.mouseY;
  
  // Adjust volume based on scroll direction (much smaller increments for gradual change)
  const scrollSensitivity = 0.002; // Much smaller - now requires ~50 scroll units to go from 0 to 1
  const deltaY = event.delta || event.deltaY || 0;
  
  // Normalize scroll delta (different browsers/devices have different scales)
  let normalizedDelta = deltaY;
  if (Math.abs(deltaY) > 10) {
    // Large deltas (like from trackpad), scale them down
    normalizedDelta = deltaY / 10;
  }
  
  // Scroll down = decrease volume, scroll up = increase volume
  const volumeChange = normalizedDelta * scrollSensitivity;
  const oldVolume = volume;
  volume = p.constrain(volume - volumeChange, 0, 1);
  
  console.log('Scroll event - deltaY:', deltaY, 'normalizedDelta:', normalizedDelta, 'volumeChange:', volumeChange);
  console.log('Volume changed from', oldVolume, 'to', volume);
  
  // Update volume for all songs
  if (songs && songs.length > 0) {
    for (let i = 0; i < songs.length; i++) {
      songs[i].setVolume(volume);
    }
  }
  
  // Show volume display
  showVolumeDisplay = true;
  volumeDisplayTimer = p.millis();
  
  // Ensure the sketch is looping so the volume display can update
  if (!started || paused) {
    p.loop();
  }
  
  // Prevent default scroll behavior
  if (event.preventDefault) {
    event.preventDefault();
  }
  return false;
};

const handlePause = () => {
  // Safety check: ensure we have valid songs and songNum
  if (!songs || songs.length === 0 || songNum < 0 || songNum >= songs.length || !songs[songNum]) {
    console.warn('Cannot handle pause: invalid songs or songNum', { songsLength: songs?.length, songNum });
    return;
  }
  
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

export const draw = (p5) => {
  p = p5;
  p.background(0);
  p.rectMode(p.CENTER);
  
  if (started) {
    // Safety check: ensure we have valid songNum and loaded assets
    if (songNum < 0 || songNum >= bg.length || !bg[songNum]) {
      console.warn('Invalid songNum or background not loaded:', songNum);
      return;
    }
    
    p.translate(width / 2, height / 2);
    p.imageMode(p.CENTER);

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
          p.map(wave[index], -1, 1, 30 * px, edgeLength * 2 - 50 * px); // Removed volume dependency
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
  } else {
    p.textSize(32);
    p.textAlign(p.CENTER);
    p.fill(0, 102, 153);
    p.text('Press [space] to play music.', width / 2, height / 2);
  }
  
  // Update cursor position
  posX = p.mouseX;
  posY = p.mouseY;
  
  // Draw custom cursor line (like in play sketch)
  p.push();
  p.resetMatrix(); // Don't apply the main transformation for the cursor
  p.strokeWeight(CURSOR_SIZE * px);
  p.stroke(...CURSOR_COLOR);
  p.line(posX, posY, p.pmouseX, p.pmouseY);
  p.pop();
  
  // Draw volume display if active
  drawVolumeDisplay(p5);
};

// Elegant volume display function - simple pie chart that follows mouse
const drawVolumeDisplay = (p5) => {
  p = p5;
  
  // Check if we should show the volume display
  if (showVolumeDisplay && (p.millis() - volumeDisplayTimer < volumeDisplayDuration)) {
    p.push();
    
    // Don't apply the main transformation for the volume display
    p.resetMatrix();
    
    // Update mouse position to follow current mouse location
    mouseX = p5.mouseX;
    mouseY = p5.mouseY;
    
    // Calculate fade out effect
    const timeElapsed = p.millis() - volumeDisplayTimer;
    const fadeStart = volumeDisplayDuration * 0.5; // Start fading at 50% of duration
    let alpha = 255;
    if (timeElapsed > fadeStart) {
      alpha = p.map(timeElapsed, fadeStart, volumeDisplayDuration, 255, 0);
    }
    
    // Volume display properties - much smaller, like the old center circle
    const displaySize = 24 * px; // Much smaller - about the size of the old center circle
    const strokeWidth = 4 * px; // Thickness of the donut
    
    // Subtle glow effect
    p.drawingContext.shadowColor = `rgba(190, 183, 223, ${alpha / 255 * 0.8})`;
    p.drawingContext.shadowBlur = 8 * px;
    
    // Volume donut arc - hollow with rounded edges
    if (volume > 0) {
      p.noFill();
      p.stroke(190, 183, 223, alpha); // Purple stroke
      p.strokeWeight(strokeWidth);
      p.strokeCap(p.ROUND); // Rounded edges
      // Since we're in DEGREES mode, map volume to 0-360 degrees
      const volumeAngle = p.map(volume, 0, 1, 0, 360);
      // Start from top (-90 degrees) and draw clockwise - no p.PIE mode for stroke arcs
      p.arc(mouseX, mouseY, displaySize, displaySize, -90, -90 + volumeAngle);
    }
    
    // Reset shadow
    p.drawingContext.shadowBlur = 0;
    
    p.pop();
  } else if (showVolumeDisplay && (p.millis() - volumeDisplayTimer >= volumeDisplayDuration)) {
    // Hide the volume display after duration
    showVolumeDisplay = false;
    
    // If music was paused and not started, go back to paused state
    if (paused && started) {
      p.noLoop();
    }
  }
};
