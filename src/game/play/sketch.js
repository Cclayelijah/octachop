import { Particle } from "src/game/Particle";
import {
  ANALYZE_AUDIO,
  ANCHOR_BEAT,
  CURSOR_COLOR,
  CURSOR_SIZE,
  DELAY,
  DELAY_START,
  IMAGE_TILT,
  NOTE_COLOR,
  NOTE_GLOW,
  OPACITY_FLICKER,
  SHOW_PARTICLES,
  SHOW_SLICES,
  SHOW_WAVEFORM,
  SLICE_COLOR,
  TRACK_NAME,
} from "src/game/Settings";
import { handleStart } from ".";
import { canHandleKeyPress } from "../lib/sketchManager";

// global.p5.disableFriendlyErrors = true; // disables FES to boost performance
let p;
let canvas;
let context;
let started = false;
let volume = 0.5; // Volume control variable
let width = 0;
let height = 0;
let size;
let half;
let px;
let noteSize;
let myFont;
let mobile = 0;
let posX, posY;
let score = 0;
let combo = 0;
let maxCombo = 0;
let notesFinished = false;
let songEnded = false;
let paused = false;
let currBreak = false;
let numPlayedNotes = 0;
let accuracy = 0; // numHits / numHits + numMisses * 2
let numHits = 0;
let numMisses = 0;
let numAttempts = 1;
let currTime; // song.currentTime() - DELAY
let songDuration;
let track = {
  title: "",
  difficulty: 0,
  approachRate: 3,
  notes: [],
  breaks: [],
  bgImage: `/res/songs/${TRACK_NAME}/bg.jpg`,
  audio: `/res/songs/${TRACK_NAME}/audio.mp3`,
};
let approachTime;
let breakData;
let breaksLeft = [];
let noteData;
let notes = [];
let activeNotes = [];
let notesToPlay = []; // array of timing points to play hit sound;
let edgeLength;
let cornerLength;
let anchorPoints = [];
let particles = [];
let landed;
let dateTime;
let fft;
let amp;

// Volume display variables
let showVolumeDisplay = false;
let volumeDisplayTimer = 0;
let volumeDisplayDuration = 2000; // Show for 2 seconds
let mouseX = 0;
let mouseY = 0;

// sound files
let song,
  hitNormal,
  hitWhistle,
  hitFinish,
  hitClap,
  endingCredits,
  applause,
  wedidit,
  comboBreak;
// image files
let opad,
  trackBg,
  defaultBg,
  endbg,
  hitsIcon,
  missesIcon,
  accuracyIcon,
  maxComboIcon,
  btnBack,
  btnContinue,
  btnRetry,
  rankS,
  rankA,
  rankB,
  rankC,
  rankD,
  text0,
  text1,
  text2,
  text3,
  text4,
  text5,
  text6,
  text7,
  text8,
  text9,
  textComma,
  textDot,
  sectionFail,
  sectionPass,
  rightArrow,
  star,
  warningSign;

export const preload = (p5) => {
  myFont = p5.loadFont("res/Inconsolata-Regular.ttf");
  // sound
  p5.soundFormats("mp3", "ogg", "wav");
  song = p5.loadSound(track.audio);
  hitNormal = p5.loadSound("res/sounds/normal-hit.wav");
  hitWhistle = p5.loadSound("res/sounds/normal-hitwhistle.wav");
  hitFinish = p5.loadSound("res/sounds/normal-hitfinish.wav");
  hitClap = p5.loadSound("res/sounds/normal-hitclap.wav");
  endingCredits = p5.loadSound("res/sounds/credits.wav");
  applause = p5.loadSound("res/sounds/applause.wav");
  wedidit = p5.loadSound("res/sounds/wedidit.wav");
  comboBreak = p5.loadSound("res/sounds/combobreakoriginal.wav");
  // dom
  // btnBack = createImg("res/images/pause-back.png");
  // btnContinue = createImg("res/images/pause-continue.png");
  btnRetry = p5.createImg("res/images/pause-retry.png");
  opad = p5.createImg("res/images/opad.png");
  // images
  endbg = p5.loadImage("res/images/space.jpg");
  trackBg = p5.loadImage("res/images/retro-city.jpg");
  hitsIcon = p5.loadImage("res/images/hits.png");
  missesIcon = p5.loadImage("res/images/misses.png");
  accuracyIcon = p5.loadImage("res/images/accuracy.png");
  maxComboIcon = p5.loadImage("res/images/ranking-maxcombo.png");
  rankS = p5.loadImage("res/images/ranking-S.png");
  rankA = p5.loadImage("res/images/ranking-A.png");
  rankB = p5.loadImage("res/images/ranking-B.png");
  rankC = p5.loadImage("res/images/ranking-C.png");
  rankD = p5.loadImage("res/images/ranking-D.png");
  text0 = p5.loadImage("res/images/score-0.png");
  text1 = p5.loadImage("res/images/score-1.png");
  text2 = p5.loadImage("res/images/score-2.png");
  text3 = p5.loadImage("res/images/score-3.png");
  text4 = p5.loadImage("res/images/score-4.png");
  text5 = p5.loadImage("res/images/score-5.png");
  text6 = p5.loadImage("res/images/score-6.png");
  text7 = p5.loadImage("res/images/score-7.png");
  text8 = p5.loadImage("res/images/score-8.png");
  text9 = p5.loadImage("res/images/score-9.png");
  textComma = p5.loadImage("res/images/score-comma.png");
  textDot = p5.loadImage("res/images/score-dot.png");
  sectionFail = p5.loadImage("res/images/section-fail.png");
  sectionPass = p5.loadImage("res/images/section-pass.png");
  rightArrow = p5.loadImage("res/images/right-arrow.png");
  star = p5.loadImage("res/images/star.png");
  warningSign = p5.loadImage("res/images/warning-sign.png");
};

export const setup = (p5, canvasParentRef) => {
  p = p5;
  width = p.windowWidth;
  height = p.windowHeight;
  size = width >= height ? height : width;
  half = size / 2;
  px = size / 800; // px = 1 if size = 800, adjusts to screen size/resolution;
  noteSize = 12 * px;
  canvas = p.createCanvas(width, mobile ? size : height);
  canvas.parent(canvasParentRef);
  p.ellipseMode(p.RADIUS);
  edgeLength = size / 2 - 75 * px;
  cornerLength =
    Math.sqrt(edgeLength * edgeLength + edgeLength * edgeLength) / 2;
  landed = [false, false, false, false, false, false, false, false];
  if (height > width) {
    mobile = 1;
    if (height > width * 1.5) mobile = 2;
    opad.show();
  } else {
    mobile = 0;
    opad.hide();
  }

  if (ANALYZE_AUDIO && song) {
    try {
      fft = new global.p5.FFT();
      fft.setInput(song);
    } catch (error) {
      console.error('Error setting up FFT:', error);
      fft = null;
    }
  }
  
  // Safety check for audio objects before setting volume
  if (hitNormal && hitNormal.setVolume) hitNormal.setVolume(volume);
  if (hitWhistle && hitWhistle.setVolume) hitWhistle.setVolume(volume);
  if (hitFinish && hitFinish.setVolume) hitFinish.setVolume(volume);
  if (hitClap && hitClap.setVolume) hitClap.setVolume(volume);
  if (song && song.setVolume) song.setVolume(volume);

  p.textFont(myFont);
  p.textSize(24);

  anchorPoints = [
    { x: width / 2, y: half - edgeLength, active: false },
    { x: width / 2 + cornerLength, y: half - cornerLength, active: false },
    { x: width / 2 + edgeLength, y: half, active: false },
    { x: width / 2 + cornerLength, y: half + cornerLength, active: false },
    { x: width / 2, y: half + edgeLength, active: false },
    { x: width / 2 - cornerLength, y: half + cornerLength, active: false },
    { x: width / 2 - edgeLength, y: half, active: false },
    { x: width / 2 - cornerLength, y: half - cornerLength, active: false },
  ];

  btnRetry.size(200 * px, 65 * px);
  btnRetry.position(width / 2 - 100 * px, size - 100 * px);
  btnRetry.hide();
  if (mobile == 2) opad.size(400 * px, 400 * px);
  if (mobile == 1) opad.size(200, 200);
  if (mobile == 2) opad.position(width - 600 * px, height - 450 * px);
  if (mobile == 1) {
    opad.position(width - 220, height - 220);
  }
};

export const windowResized = (p5) => {
  p = p5;
  width = p.windowWidth;
  height = p.windowHeight;
  size = width >= height ? height : width;
  half = size / 2;
  px = size / 800; // px = 1 if size = 800, adjusts to screen size/resolution;
  noteSize = 12 * px;
  edgeLength = size / 2 - 75;
  cornerLength =
    Math.sqrt(edgeLength * edgeLength + edgeLength * edgeLength) / 2;
  canvas = p.resizeCanvas(width, mobile ? size : height);
  if (height > width) {
    mobile = 1;
    if (height > width * 1.5) mobile = 2;
    opad.show();
  } else {
    mobile = 0;
    opad.hide();
  }

  anchorPoints = [
    { x: width / 2, y: half - edgeLength, active: false },
    { x: width / 2 + cornerLength, y: half - cornerLength, active: false },
    { x: width / 2 + edgeLength, y: half, active: false },
    { x: width / 2 + cornerLength, y: half + cornerLength, active: false },
    { x: width / 2, y: half + edgeLength, active: false },
    { x: width / 2 - cornerLength, y: half + cornerLength, active: false },
    { x: width / 2 - edgeLength, y: half, active: false },
    { x: width / 2 - cornerLength, y: half - cornerLength, active: false },
  ];

  btnRetry.size(200 * px, 65 * px);
  btnRetry.position(width / 2 - 100 * px, size - 100 * px);
  if (mobile == 2) opad.size(400 * px, 400 * px);
  if (mobile == 1) opad.size(200, 200);
  if (mobile == 2) opad.position(width - 600 * px, height - 450 * px);
  if (mobile == 1) opad.position(width - 220, height - 220);
};

export function start(data) {
  console.log("start");
  
  // Wait for p5 instance to be ready
  if (!p) {
    console.log("P5 instance not ready, retrying in 100ms...");
    setTimeout(() => start(data), 100);
    return;
  }
  
  started = true;
  track = data;
  console.log(track);

  // Load new audio file
  if (song) {
    song.stop();
  }
  song = p.loadSound(track.audio, () => {
    console.log("Audio loaded successfully");
    songDuration = song.duration() * 1000;
    song.onended(() => {
      if (!paused) songEnded = true;
    });
  });

  // Handle background image - check if it's a full URL or relative path
  let imageUrl;
  if (track.bgImage.startsWith('http')) {
    imageUrl = track.bgImage;
  } else {
    imageUrl = `res/tracks/${TRACK_NAME}/` + track.bgImage;
  }

  let img = new Image();
  img.src = imageUrl;
  if (img.height != 0) {
    trackBg = p.loadImage(
      imageUrl,
      () => {
        console.log("Background image loaded");
      },
      () => {
        console.log("Failed to load background image, using fallback");
        trackBg = p.loadImage("res/images/retro-city.jpg");
      }
    );
  } else {
    trackBg = p.loadImage("res/images/retro-city.jpg");
  }

  noteData = JSON.stringify(track.notes);
  breakData = JSON.stringify(track.breaks);
  notes = JSON.parse(noteData);
  breaksLeft = JSON.parse(breakData);
  const AR = track.approachRate;
  approachTime = 1800 - (AR < 5 ? 120 * AR : 120 * 5 + 150 * (AR - 5));
  
  // Ensure AudioContext is created and resumed
  if (context == undefined) {
    context = new AudioContext();
  }
  
  context.resume().then(() => {
    if (song && song.isLoaded()) {
      song.play(DELAY_START);
    } else {
      // Wait for song to load then play
      const checkLoaded = setInterval(() => {
        if (song && song.isLoaded()) {
          clearInterval(checkLoaded);
          song.play(DELAY_START);
        }
      }, 100);
    }
  }).catch((error) => {
    console.warn('AudioContext resume failed:', error);
    // Fallback: try to play without context resume
    if (song && song.isLoaded()) {
      song.play(DELAY_START);
    }
  });
}

function retry() {
  btnRetry.hide();
  numAttempts++;
  notes = JSON.parse(noteData);
  breaksLeft = JSON.parse(breakData);
  console.log(track);
  notesToPlay = [];
  activeNotes = [];
  score = 0;
  combo = 0;
  maxCombo = 0;
  paused = false;
  numPlayedNotes = 0;
  accuracy = 0; // numHits / numHits + numMisses * 2
  numHits = 0;
  numMisses = 0;
  notesFinished = false;
  particles = [];
  endingCredits.stop();
  applause.stop();
  wedidit.stop();
  song.stop();
  song.play();
  songEnded = false;
  p.loop();
}

function play() {
  canvas = p.resizeCanvas(width, mobile ? size : height);
  song.play();
  paused = false;
  console.log("play");
  p.loop();
}

function pause() {
  song.pause();
  paused = true;
  console.log("pause");
  p.noLoop();
}

function playSound(hitSound) {
  switch (hitSound) {
    case 0:
      hitNormal.play();
      break;
    case 1:
      hitWhistle.play();
      break;
    case 2:
      hitFinish.play();
      break;
    case 3:
      hitClap.play();
      break;
    default:
      // console.log("hitSound:" + hitSound);
      hitNormal.play();
      break;
  }
}

function adjustAccuracy() {
  accuracy = Math.floor((100 * numHits) / (numHits + numMisses * 2));
}

function hit() {
  numHits++;
  adjustAccuracy();
  score += 5000 + 93 * combo;
  combo++;
  if (combo > maxCombo) maxCombo = combo;
}

function miss() {
  numMisses++;
  adjustAccuracy();
  if (combo > 10) comboBreak.play();
  combo = 0;
}

function endSong() {
  console.log("stage complete");
  songEnded = true;
  song.stop();
}

export const keyPressed = (p5, e) => {
  // Use sketch manager to check if we can handle key press
  if (!canHandleKeyPress('play', p5.keyCode)) {
    console.log('Play sketch cannot handle keypress - blocked by sketch manager');
    return;
  }
  
  // Additional context checks
  if (!song) {
    console.log('Play sketch - no song available');
    return;
  }
  
  console.log('Play keyPressed:', p5.keyCode);
  
  if (p5.keyCode === 32) {
    e.preventDefault();
    if (notesFinished) {
      endSong();
    } else {
      if (context == undefined) {
        context = new AudioContext();
      }
      if (!started) {
        console.log('Starting game...');
        handleStart();
        // Don't execute play/pause logic when starting for the first time
      } else {
        context.resume();
        paused ? play() : pause();
      }
    }
    return false; // prevent scroll
  }
  if (p5.keyCode === 13) {
    if (notesFinished) {
      endSong();
    } else paused ? play() : pause();
  }
  if (p5.keyCode === 27) {
    if (notesFinished) {
      endSong();
    } else paused ? play() : pause();
  }
};

export const doubleClicked = (p) => {
  // Enhanced fullscreen for mobile - also works on desktop
  if (mobile) {
    // On mobile, request fullscreen with better orientation handling
    p.fullscreen(true);
    // Try to lock orientation to landscape on mobile if possible
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Orientation lock not supported, ignore error
      });
    }
  } else {
    p.fullscreen(true);
  }
};

export const mouseClicked = (p) => {
  // Enhanced click handling for mobile touch
  if (context == undefined) {
    context = new AudioContext();
  }
  if (!started) {
    handleStart();
    // On mobile, provide haptic feedback if available
    if (mobile && navigator.vibrate) {
      navigator.vibrate(50); // Short vibration feedback
    }
  } else {
    context.resume();
  }
};

export const mouseWheel = (p5, event) => {
  p = p5;
  
  // Only handle scroll if this is the active sketch
  if (!canHandleKeyPress('play')) {
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
  
  console.log('Play sketch - Volume changed from', oldVolume, 'to', volume);
  
  // Update volume for all audio sources
  if (song) song.setVolume(volume);
  if (hitNormal) hitNormal.setVolume(volume);
  if (hitWhistle) hitWhistle.setVolume(volume);
  if (hitFinish) hitFinish.setVolume(volume);
  if (hitClap) hitClap.setVolume(volume);
  
  // Show volume display
  showVolumeDisplay = true;
  volumeDisplayTimer = p.millis();
  
  // Ensure the sketch is looping so the volume display can update (especially when paused)
  p.loop();
  
  // Prevent default scroll behavior
  if (event.preventDefault) {
    event.preventDefault();
  }
  return false;
};

const activeSlice = () => {
  let slice;
  const up = p.keyIsDown(p.UP_ARROW) ? true : p.keyIsDown(87);
  const right = p.keyIsDown(p.RIGHT_ARROW) ? true : p.keyIsDown(68);
  const down = p.keyIsDown(p.DOWN_ARROW) ? true : p.keyIsDown(83);
  const left = p.keyIsDown(p.LEFT_ARROW) ? true : p.keyIsDown(65);
  // keys overide mouse
  if (up && right) {
    slice = 1;
  } else if (down && right) {
    slice = 3;
  } else if (left && down) {
    slice = 5;
  } else if (left && up) {
    slice = 7;
  } else if (up) {
    slice = 0;
  } else if (right) {
    slice = 2;
  } else if (down) {
    slice = 4;
  } else if (left) {
    slice = 6;
  } else {
    // mouse
    let shortestLength = size;
    anchorPoints.forEach((b, i) => {
      if (mobile) {
        if (mobile == 2) {
          posY = width / 2 + (p.mouseY - height + 250 * px) * 1.5;
          posX = width / 2 + (p.mouseX - width / 2) * 1.5;
        }
        if (mobile == 1) {
          posY = width / 2 + (p.mouseY - height + 120) * 3;
          posX = width / 2 + (p.mouseX - width + 120) * 3;
        }
      } else {
        posX = p.mouseX;
        posY = p.mouseY;
      }
      const d = p.dist(b.x, b.y, posX, posY);
      if (shortestLength > d) {
        shortestLength = d;
        slice = i;
      }
    });
  }

  return slice;
};

const slices = () => {
  let lastAngle = 0;
  for (let i = 0; i < 8; i++) {
    if (i === activeSlice()) {
      // fill(190, 183, 223);
      p.fill(...SLICE_COLOR);
      if (currBreak || notesFinished) p.fill(0);
      p.strokeWeight(0);
      p.arc(
        0,
        0,
        edgeLength - noteSize - 3 * px,
        edgeLength - noteSize - 3 * px,
        lastAngle,
        lastAngle + p.radians(45)
      );
    } else {
      p.fill(0);
      p.strokeWeight(0);
      p.arc(
        0,
        0,
        edgeLength - noteSize - 3 * px,
        edgeLength - noteSize - 3 * px,
        lastAngle,
        lastAngle + p.radians(45)
      );
    }
    lastAngle += p.radians(45);
  }
};

const landingRegion = () => {
  let lastAngle = 0;
  for (let i = 0; i < 8; i++) {
    if (landed[i]) {
      p.fill(0, 255, 51); // green
      p.arc(
        0,
        0,
        edgeLength + noteSize,
        edgeLength + noteSize,
        lastAngle,
        lastAngle + p.radians(45)
      );
    } else {
      p.fill(190, 183, 223); // white-purple
      p.arc(
        0,
        0,
        edgeLength + noteSize,
        edgeLength + noteSize,
        lastAngle,
        lastAngle + p.radians(45)
      );
    }
    p.erase();
    p.arc(
      0,
      0,
      edgeLength - noteSize,
      edgeLength - noteSize,
      lastAngle,
      lastAngle + p.radians(45)
    );
    p.noErase();
    lastAngle += p.radians(45);
  }
};

const barNote = (radius, notePath) => {
  const angle = p.radians(45 * notePath);
  p.arc(0, 0, radius, radius, angle, angle + p.radians(45));
};

const flashGetReady = (endTime) => {
  const time = endTime - approachTime;
  if (currTime > time - 500) {
    // do nothing
  } else if (currTime > time - 1000) {
    // show warning
    p.image(warningSign, half - 50 * px, half - 50 * px, 100 * px, 100 * px);
  } else if (currTime > time - 1500) {
    // do nothing
  } else if (currTime > time - 2000) {
    // show warning
    p.image(warningSign, half - 50 * px, half - 50 * px, 100 * px, 100 * px);
  } else if (currTime > time - 2500) {
    // do nothing
  } else if (currTime > time - 3000) {
    // show warning
    p.image(warningSign, half - 50 * px, half - 50 * px, 100 * px, 100 * px);
  }
};

function displayResults() {
  p.noLoop();
  dateTime = new Date();
  endingCredits.play();
  applause.play();
  applause.onended(() => wedidit.play());
  if (canvas) canvas.drawingContext.shadowBlur = 0;
  btnRetry.mousePressed(retry);
  btnRetry.show();
  p.background(0);
  p.imageMode(p.CORNER);
  p.rectMode(p.CORNER);
  p.image(endbg, 0, 0, width, height, 0, 0, width, height, p.COVER);
  // dark background
  p.noStroke();
  p.fill(0, 0, 0, 80);
  p.rect(0, 0, width, height);
  p.fill(0, 0, 0, 100);
  p.rect(width / 2 - 100 * px, size - 120 * px, 200 * px, 100 * px, 10 * px);
  if (accuracy == 100) {
    p.image(rankS, 100 * px, 145 * px, 280 * px, 330 * px);
  } else if (accuracy > 93) {
    p.image(rankA, 105 * px, 145 * px, 280 * px, 330 * px);
  } else if (accuracy > 83) {
    p.image(rankB, 115 * px, 145 * px, 280 * px, 330 * px);
  } else if (accuracy > 73) {
    p.image(rankC, 105 * px, 145 * px, 270 * px, 330 * px);
  } else {
    p.image(rankD, 105 * px, 145 * px, 270 * px, 330 * px);
  }
  p.image(
    hitsIcon,
    mobile == 0 ? width / 2 + 60 * px : width - 340 * px,
    200 * px,
    60 * px,
    60 * px
  );
  p.image(
    missesIcon,
    mobile == 0 ? width / 2 + 60 * px : width - 340 * px,
    280 * px,
    60 * px,
    60 * px
  );
  p.image(
    accuracyIcon,
    mobile == 0 ? width / 2 + 60 * px : width - 340 * px,
    360 * px,
    60 * px,
    60 * px
  );
  p.fill(255);
  // fill(241, 241, 241);
  p.fill(242, 242, 242);
  p.stroke(0);
  p.strokeWeight(3 * px);
  p.textAlign(p.LEFT);
  p.textSize(40 * px);
  p.text(track.title, 90 * px, 80 * px);
  p.textSize(12 * px);
  p.text(dateTime.toString(), 90 * px, 105 * px);
  p.textAlign(p.RIGHT);
  p.textSize(56 * px);
  p.text(p.nfc(numHits), width - 90 * px, 243 * px);
  p.text(p.nfc(numMisses), width - 90 * px, 323 * px);
  p.text(accuracy + "%", width - 90 * px, 403 * px);
  p.textAlign(p.CENTER);
  p.textSize(80 * px);
  p.text(p.nfc(score), width / 2, 545 * px);
  p.textAlign(p.RIGHT);
  p.textSize(48 * px);
  p.image(maxComboIcon, width / 2 - 200 * px, 575 * px, 200 * px, 80 * px);
  p.text(p.nfc(maxCombo), width / 2 + 130 * px, 630 * px);
  p.textSize(20 * px);
  p.text("x" + p.nfc(numAttempts), width - 90 * px, 780 * px);
  p.textAlign(p.LEFT);
  let seconds = Math.floor((songDuration / 1000) % 60);
  let minutes = Math.floor(songDuration / 1000 / 60);
  const textSeconds = seconds < 10 ? "0" + seconds : "" + seconds;
  const textMinutes = minutes < 10 ? "0" + minutes : "" + minutes;
  p.text(textMinutes + ":" + textSeconds, 90 * px, 780 * px); // todo fix formatting
  const numStars = Math.floor(track.difficulty);
  //stars
  for (let i = 0; i < numStars; i++) {
    p.image(star, width - 220 * px - i * 30 * px, 85 * px, 30 * px, 30 * px);
  }
  p.image(
    star,
    width - 190 * px,
    85 * px,
    (track.difficulty - numStars) * 30 * px,
    30 * px,
    0,
    0,
    40 * px,
    40 * px,
    p.COVER,
    p.LEFT
  );
  p.textSize(30 * px);
  p.textAlign(p.RIGHT);
  p.text(track.difficulty, width - 90 * px, 110 * px);
}

export const draw = (p) => {
  if (notesFinished && songEnded) {
    p.clear();
    displayResults();
    return;
  }
  
  // Safety check for song object before accessing currentTime
  if (!song || !song.currentTime) {
    console.warn('Song object not available or currentTime method missing');
    return;
  }
  
  let currentTimeValue = 0;
  try {
    currentTimeValue = song.currentTime();
  } catch (error) {
    console.warn('Error getting song currentTime:', error);
    return;
  }
  
  currTime = Math.floor(currentTimeValue * 1000) - DELAY;
  p.background(0);
  p.translate(width / 2, half);
  p.imageMode(p.CENTER);
  p.rectMode(p.CENTER);
  
  if (ANALYZE_AUDIO && fft) {
    try {
      fft.analyze();
      amp = fft.getEnergy(20, 200);
    } catch (error) {
      console.warn('FFT analysis failed:', error);
      amp = 0; // Use default value
    }
    p.push();
    if (amp > 225 && IMAGE_TILT) {
      p.rotate(p.random(p.radians(-0.5), p.radians(0.5)));
    }
  } else if (ANALYZE_AUDIO) {
    // FFT not available, use default values
    amp = 0;
  }

  p.image(
    trackBg,
    0,
    0,
    width + 20 * px,
    height + 20 * px,
    0,
    0,
    width,
    height,
    p.COVER
  );
  if (ANALYZE_AUDIO) {
    p.pop();
  }

  p.translate(-width / 2, -half);
  // dark filter
  let alpha =
    OPACITY_FLICKER && ANALYZE_AUDIO ? p.map(amp, 0, 255, 150, 200) : 160;
  p.fill(0, alpha);
  p.noStroke();
  p.rect(width / 2, half, width, height);

  // text
  let fps = p.frameRate();
  if (canvas) canvas.drawingContext.shadowBlur = 0;
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(3 * px);
  p.textAlign(p.LEFT);
  p.textSize(60 * px);
  p.text(p.nfc(combo), 10 * px, (mobile ? size : height) - 10 * px);
  p.textSize(30 * px);
  p.text(p.nfc(accuracy) + "%", 10 * px, 40 * px);
  p.textAlign(p.RIGHT);
  p.textSize(30 * px);
  p.text(p.nfc(score), width - 10 * px, 40 * px);
  p.textSize(12 * px);
  p.text(
    "FPS: " + fps.toFixed(2),
    width - 10 * px,
    (mobile ? size : height) - 10 * px
  );
  // progress bar
  if (canvas) canvas.drawingContext.shadowColor = "black";
  if (canvas) canvas.drawingContext.shadowBlur = 12 * px;
  p.stroke(255, 0, 0);
  p.strokeWeight(18 * px);
  let x = p.map(currTime, 0, songDuration, 0, width);
  p.line(0, 0, x, 0);

  // PIE GLOW
  p.fill(255);
  p.strokeWeight(0);
  p.translate(width / 2, half);
  if (canvas) canvas.drawingContext.shadowColor = "white";
  if (canvas) canvas.drawingContext.shadowBlur = 50 * px;
  p.ellipse(0, 0, edgeLength + noteSize);
  if (canvas) canvas.drawingContext.shadowBlur = 0;
  p.rotate(p.radians(-90 - 45 / 2));
  // HIT ZONE
  p.noFill();
  p.strokeWeight(0);
  p.stroke(255);
  landingRegion();
  // pie slices
  p.strokeWeight(0);
  if (canvas) canvas.drawingContext.shadowBlur = 2 * px;
  if (SHOW_SLICES) {
    if (canvas) canvas.drawingContext.shadowColor = "rgb(190, 183, 223)";
  } else {
    if (canvas) canvas.drawingContext.shadowColor = "rgb(0, 0, 0)";
  }
  slices();
  if (canvas) canvas.drawingContext.shadowBlur = 0;

  // audio visualization
  if (SHOW_WAVEFORM && ANALYZE_AUDIO && fft) {
    p.push();
    p.rotate(p.radians(90 + 45 / 2));
    p.stroke(...SLICE_COLOR);
    p.noFill();
    p.strokeWeight(3);
    p.angleMode(p.DEGREES);
    
    let wave = [];
    try {
      wave = fft.waveform();
    } catch (error) {
      console.warn('Error getting waveform data:', error);
      wave = new Array(1024).fill(0); // Default empty waveform
    }
    
    for (let t = -1; t <= 1; t += 2) {
      p.beginShape();
      for (let i = 0; i < width; i += 0.5) {
        let index = p.floor(p.map(i, 0, 180, 0, wave.length - 1));

        let r = p.map(wave[index], -1, 1, edgeLength, 0);
        let x = r * p.sin(i) * t;
        let y = r * p.cos(i);
        p.vertex(x, y);
      }
      p.endShape();
    }
    p.angleMode(p.RADIANS);
    p.pop();
  }

  // NOTES
  p.noFill();
  p.strokeWeight(noteSize * 2);
  p.stroke(...NOTE_COLOR);
  if (canvas) canvas.drawingContext.shadowBlur = 50 * px;
  if (canvas) canvas.drawingContext.shadowColor = NOTE_GLOW;
  try {
    if (
      notes.length === 0 &&
      activeNotes.length === 0 &&
      notesToPlay.length === 0 &&
      numPlayedNotes > 0
    ) {
      notesFinished = true;
    }
    // notesToPlay
    if (notesToPlay.length > 0) {
      let note = notesToPlay[0];
      if (note.time < currTime) {
        playSound(note.sound);
        landed[note.path] = true; // turn green
        setTimeout(() => {
          landed[note.path] = false;
        }, 100);
        notesToPlay.shift();
      }
    }
    // breaks
    if (breaksLeft.length > 0) {
      const nextBreak = breaksLeft[0];
      if (currTime > nextBreak.startTime) {
        currBreak = true;
        const halftime =
          nextBreak.startTime + nextBreak.endTime - nextBreak.startTime;
        if (currTime > halftime && currTime < halftime + 2000) {
          // todo add health mechanics
          // todo play section pass/fail sound
          // todo show section pass/fail icon
          if (accuracy > 83) {
            p.image(sectionPass, width / 2, half - 100 * px, 50 * px, 50 * px);
            console.log("section passed");
          } else {
            p.image(sectionFail, width / 2, half - 100 * px, 50 * px, 50 * px);
            console.log("section failed");
          }
        }
        flashGetReady(nextBreak.endTime);
        if (currTime > nextBreak.endTime - approachTime) {
          breaksLeft.shift();
          currBreak = false;
        }
      }
    }
    // notes
    if (notes.length > 0) {
      const nextNote = notes[0];
      if (currTime > nextNote.time - approachTime) {
        numPlayedNotes++;
        activeNotes.push(nextNote);
        notes.shift();
      }
    }
    // activeNotes
    if (activeNotes.length > 0) {
      for (let i = activeNotes.length - 1; i >= 0; i--) {
        const life = (activeNotes[i].time - currTime) / approachTime; // (.52) percent of life the note has left;
        const radius = edgeLength - Math.floor(edgeLength * life); // where the note should be based on the timestamp
        barNote(radius, activeNotes[i].path);
        //collision check
        if (
          edgeLength - radius > -(noteSize * 2) &&
          edgeLength - radius < noteSize * 2 &&
          activeNotes[i].path === activeSlice()
        ) {
          // stroke of note is touching stroke of landing region
          notesToPlay.push({
            time: activeNotes[i].time,
            sound: activeNotes[i].hitSound,
            path: activeNotes[i].path,
          });
          hit();
          activeNotes.splice(i, 1);
        }
        //exit check
        if (radius > edgeLength + noteSize * 4) {
          activeNotes.splice(i, 1);
          miss();
        }
      }
    }
  } catch (e) {
    console.log(e);
    pause();
  }

  // particles
  if (fps > 30 && SHOW_PARTICLES && ANALYZE_AUDIO) {
    let p1 = new Particle(px, edgeLength, p, canvas);
    particles.push(p1);
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].edges()) {
        particles.splice(i, 1);
      } else {
        particles[i].update(amp > 210);
        particles[i].show(p);
      }
    }
  }
  p.rotate(p.radians(90 + 45 / 2));
  p.translate(-width / 2, -half);
  if (canvas) canvas.drawingContext.shadowColor = "white";
  if (canvas) canvas.drawingContext.shadowBlur = 30 * px;
  // MOBILE DPAD
  if (mobile) {
    p.fill(...SLICE_COLOR);
    p.strokeWeight(noteSize * 2);
    p.stroke(...CURSOR_COLOR);
    p.ellipse(width / 2, height - edgeLength - noteSize);
  }
  // MOUSE LINE
  p.strokeWeight(CURSOR_SIZE * px);
  p.stroke(...CURSOR_COLOR);
  let pPosX, pPosY;
  if (mobile) {
    if (mobile == 2) {
      pPosY = width / 2 + (p.pmouseY - height + 250 * px) * 1.5;
      pPosX = width / 2 + (p.pmouseX - width / 2) * 1.5;
    }
    if (mobile == 1) {
      pPosY = width / 2 + (p.pmouseY - height + 120) * 3;
      pPosX = width / 2 + (p.pmouseX - width + 120) * 3;
    }
  } else {
    pPosY = p.pmouseY;
    pPosX = p.pmouseX;
  }
  p.line(posX, posY, pPosX, pPosY);
  // ANCHOR CIRCLE
  if (!notesFinished) {
    if (canvas) canvas.drawingContext.shadowBlur = 0;
    p.noStroke();
    p.fill(255, 255, 255);
    p.ellipse(
      width / 2,
      half,
      ANCHOR_BEAT && ANALYZE_AUDIO
        ? p.map(amp, 0, 250, 8 * px, 16 * px) + (amp > 210 ? 2 : 0)
        : 10 * px
    );
  }

  if (!started) {
    p.textSize(18);
    p.textAlign(p.CENTER);
    // p.fill(0, 102, 153);
    p.fill(255);
    p.text('Press [space] to start.', width / 2, height / 2 - 30 * px);
  }
  
  // Draw volume display if active
  drawVolumeDisplay(p);
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
      // Map volume to 0-TWO_PI radians (play sketch uses default RADIANS mode)
      const volumeAngle = p.map(volume, 0, 1, 0, p.TWO_PI);
      // Start from top (-HALF_PI) and draw clockwise
      p.arc(mouseX, mouseY, displaySize, displaySize, -p.HALF_PI, -p.HALF_PI + volumeAngle);
    }
    
    // Reset shadow
    p.drawingContext.shadowBlur = 0;
    
    p.pop();
  } else if (showVolumeDisplay && (p.millis() - volumeDisplayTimer >= volumeDisplayDuration)) {
    // Hide the volume display after duration
    showVolumeDisplay = false;
  }
};

// Cleanup function to stop music and reset everything when leaving the page
export const cleanup = () => {
  try {
    // Stop the song if it's playing
    if (song && song.isPlaying && song.isPlaying()) {
      song.stop();
    }
    
    // Clear and reset FFT
    if (fft) {
      fft = null;
    }
    
    // Clear particles array
    if (particles && particles.length > 0) {
      particles = [];
    }
    
    // Reset all game state variables
    started = false;
    paused = false;
    notesFinished = false;
    songEnded = false;
    currBreak = false;
    
    // Reset scoring variables
    score = 0;
    combo = 0;
    maxCombo = 0;
    numPlayedNotes = 0;
    accuracy = 0;
    numHits = 0;
    numMisses = 0;
    numAttempts = 1;
    
    // Reset volume display
    showVolumeDisplay = false;
    volumeDisplayTimer = 0;
    
    // Reset time variables
    currTime = 0;
    songDuration = 0;
    
    // Clear notes and game objects if they exist
    if (typeof notes !== 'undefined') {
      notes = [];
    }
    if (typeof breaks !== 'undefined') {
      breaks = [];
    }
    
    // Reset song reference
    song = null;
    
    // Suspend audio context if it exists
    if (context && context.state === 'running') {
      context.suspend().catch(() => {
        // Ignore errors during cleanup
      });
    }
    
    console.log('Play page cleanup completed');
  } catch (error) {
    console.error('Error during play page cleanup:', error);
  }
};
