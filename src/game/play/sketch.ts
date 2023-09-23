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
import type p5Types from "p5";
import { handleStart } from ".";

// global.p5.disableFriendlyErrors = true; // disables FES to boost performance
let p: p5Types;
let canvas;
let context;
let started = false;
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

export const preload = (p5): void => {
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

export const setup = (p5, canvasParentRef: Element): void => {
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

  if (ANALYZE_AUDIO) {
    fft = new global.p5.FFT();
    fft.setInput(song);
  }
  hitNormal.setVolume(0.5);
  hitWhistle.setVolume(0.5);
  hitFinish.setVolume(0.5);
  hitClap.setVolume(0.5);
  song.setVolume(0.5);

  p.noCursor();
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

export const windowResized = (p5): void => {
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
  started = true;
  track = data;
  console.log(track);

  let img = new Image();
  img.src = `res/tracks/${TRACK_NAME}/` + track.bgImage;
  if (img.height != 0)
    trackBg = p.loadImage(
      `res/tracks/${TRACK_NAME}/` + track.bgImage,
      () => {
        console.log("loaded");
      },
      () => {
        console.log("failed to load image");
        trackBg = p.loadImage("res/images/retro-city.jpg");
      }
    );
  noteData = JSON.stringify(track.notes);
  breakData = JSON.stringify(track.breaks);
  notes = JSON.parse(noteData);
  breaksLeft = JSON.parse(breakData);
  const AR = track.approachRate;
  approachTime = 1800 - (AR < 5 ? 120 * AR : 120 * 5 + 150 * (AR - 5));
  song.stop();
  songDuration = song.duration() * 1000;
  song.onended(() => {
    if (!paused) songEnded = true;
  });
  context.resume().then(() => {
    song.play(DELAY_START);
  });
}

function retry() {
  p.noCursor();
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
  p.noCursor();
}

function pause() {
  song.pause();
  paused = true;
  console.log("pause");
  p.noLoop();
  p.cursor(p.ARROW);
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
  console.log(p5.keyCode);
  if (p5.keyCode === 32) {
    e.preventDefault();
    if (notesFinished) {
      endSong();
    } else {
      if (context == undefined) {
        context = new AudioContext();
      }
      if (!started) {
        handleStart();
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
  p.fullscreen(true);
};

export const mouseClicked = (p) => {
  if (context == undefined) {
    context = new AudioContext();
  }
  if (!started) {
    handleStart();
  } else {
    context.resume();
  }
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
  p.cursor(p.ARROW);
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

export const draw = (p): void => {
  if (notesFinished && songEnded) {
    p.clear();
    displayResults();
    return;
  }
  currTime = Math.floor(song.currentTime() * 1000) - DELAY;
  p.background(0);
  p.translate(width / 2, half);
  p.imageMode(p.CENTER);
  p.rectMode(p.CENTER);
  if (ANALYZE_AUDIO) {
    fft.analyze();
    amp = fft.getEnergy(20, 200);
    p.push();
    if (amp > 225 && IMAGE_TILT) {
      p.rotate(p.random(p.radians(-0.5), p.radians(0.5)));
    }
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
  if (SHOW_WAVEFORM && ANALYZE_AUDIO) {
    p.push();
    p.rotate(p.radians(90 + 45 / 2));
    p.stroke(...SLICE_COLOR);
    p.noFill();
    p.strokeWeight(3);
    p.angleMode(p.DEGREES);
    let wave = fft.waveform();
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
};
