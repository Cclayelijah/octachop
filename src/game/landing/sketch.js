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
let isHandlingPause = false; // Guard against rapid consecutive calls
let lastClickTime = 0; // Debounce mechanism
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

// Button animation variables
let pulseTime = 0;
let hoveredSection = -1;
let animationScale = 1;

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
  
  // Force update window dimensions to ensure full screen coverage
  width = p.windowWidth;
  height = p.windowHeight;
  
  // Additional check to ensure we have valid dimensions
  if (width <= 0 || height <= 0) {
    // Fallback to screen dimensions if window dimensions are invalid
    width = window.innerWidth || document.documentElement.clientWidth || 800;
    height = window.innerHeight || document.documentElement.clientHeight || 600;
  }
  
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.createCanvas(width, height).parent(canvasParentRef);
  
  // Force canvas to take full screen
  if (canvas && canvas.canvas) {
    canvas.canvas.style.width = '100vw';
    canvas.canvas.style.height = '100vh';
    canvas.canvas.style.position = 'absolute';
    canvas.canvas.style.top = '0';
    canvas.canvas.style.left = '0';
  }
  
  console.log(`Landing canvas created: ${width}x${height}`);
  
  // Safety check: ensure we have songs loaded, if not they might have been cleared
  if (songs.length === 0) {
    console.warn('No songs loaded in setup, they may have been cleared during cleanup');
    // Don't return here, let preload handle reloading if needed
  }
  
  // Additional safety: ensure we have a valid songNum and songs array
  if (songs.length > 0) {
    songNum = Math.floor(Math.random() * songTracks.length); 
    
    // Create FFT only if we have valid songs
    try {
      fft = new global.p5.FFT(0.2);
      fft.setInput(songs[songNum]);
      
      for (let i = 0; i < songs.length; i++) {
        if (songs[i] && songs[i].setVolume) {
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
      }
    } catch (error) {
      console.error('Error setting up FFT:', error);
      fft = null;
    }
  } else {
    songNum = -1;
    fft = null;
  }
  
  p.angleMode(p.DEGREES);
  
  // Initialize cursor position
  posX = width / 2;
  posY = height / 2;
};

export const windowResized = (p5) => {
  p = p5;
  
  // Force update window dimensions
  width = p.windowWidth;
  height = p.windowHeight;
  
  // Additional check to ensure we have valid dimensions
  if (width <= 0 || height <= 0) {
    // Fallback to screen dimensions if window dimensions are invalid
    width = window.innerWidth || document.documentElement.clientWidth || 800;
    height = window.innerHeight || document.documentElement.clientHeight || 600;
  }
  
  let size = width >= height ? height : width;
  px = size / 800;
  edgeLength = size / 4;
  canvas = p.resizeCanvas(width, height);
  
  // Force canvas to take full screen after resize
  if (canvas && canvas.canvas) {
    canvas.canvas.style.width = '100vw';
    canvas.canvas.style.height = '100vh';
    canvas.canvas.style.position = 'absolute';
    canvas.canvas.style.top = '0';
    canvas.canvas.style.left = '0';
  }
  
  console.log(`Landing canvas resized: ${width}x${height}`);
};

// Force canvas to full screen - can be called when returning to landing page
export const forceResize = (p5) => {
  if (p5) {
    windowResized(p5);
  } else if (p) {
    windowResized(p);
  }
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
  if (e.keyCode === 27) { // ESC key
    e.preventDefault();
    // Exit fullscreen if currently in fullscreen mode using native API
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement;
    
    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          console.log('Landing page exited fullscreen mode');
        }).catch((error) => {
          console.warn('Exit fullscreen failed:', error.message);
        });
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
        console.log('Landing page exited fullscreen mode (webkit)');
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        console.log('Landing page exited fullscreen mode (moz)');
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
        console.log('Landing page exited fullscreen mode (ms)');
      }
    }
  }
};

export const mouseClicked = (p5, e) => {
  // Prevent default behavior and stop event propagation
  if (e) {
    // Check if the click came from a UI element (not the canvas)
    if (e.target && e.target.tagName !== 'CANVAS') {
      return; // Don't handle clicks on UI elements
    }
    e.preventDefault();
    e.stopPropagation();
  }
  
  const currentTime = Date.now();
  
  // Debounce: ignore clicks that happen within 300ms of the last click
  if (currentTime - lastClickTime < 300) {
    return;
  }
  lastClickTime = currentTime;
  
  p = p5;
  if (!contextStarted) {
    context = new AudioContext();
    contextStarted = true;
  }
  if (!started) {
    started = true;
  }
  
  // Always handle play/pause on mouse click (same as spacebar)
  handlePause();
};

export const mouseWheel = (p5, event, isSettingsOpen) => {
  p = p5;
  
  // Only handle scroll if this is the active sketch
  if (!canHandleKeyPress('landing')) {
    return;
  }

  // If settings drawer is open, don't interfere with its scrolling
  if (isSettingsOpen) {
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
  
  // Update volume for all songs
  if (songs && songs.length > 0) {
    for (let i = 0; i < songs.length; i++) {
      songs[i].setVolume(volume);
    }
  }
  
  // Show volume display
  showVolumeDisplay = true;
  volumeDisplayTimer = p.millis();
  
  // Visual loop should always be running now
  
  // Prevent default scroll behavior only when settings drawer is closed
  if (event.preventDefault) {
    event.preventDefault();
  }
  return false;
};

// Double-click handler for fullscreen functionality
export const doubleClicked = (p5) => {
  try {
    // Check if we can handle key press (sketch manager integration)
    if (!canHandleKeyPress('landing')) {
      return;
    }
    
    // Use browser's native fullscreen API instead of p5's fullscreen method
    if (typeof document !== 'undefined' && document.documentElement) {
      const elem = document.documentElement;
      
      // Check if already in fullscreen
      const isFullscreen = document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement || 
                          document.msFullscreenElement;
      
      if (!isFullscreen) {
        // Try different fullscreen methods for cross-browser compatibility
        if (elem.requestFullscreen) {
          elem.requestFullscreen().then(() => {
            console.log('Landing page entered fullscreen mode');
          }).catch((error) => {
            console.warn('Fullscreen request failed:', error.message);
          });
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
          console.log('Landing page entered fullscreen mode (webkit)');
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
          console.log('Landing page entered fullscreen mode (moz)');
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
          console.log('Landing page entered fullscreen mode (ms)');
        } else {
          console.warn('Fullscreen API not supported in this browser');
          return;
        }
        
        // Try to lock orientation to landscape on mobile if possible (with safer checks)
        setTimeout(() => {
          try {
            if (typeof window !== 'undefined' && 
                window.screen && 
                window.screen.orientation && 
                typeof window.screen.orientation.lock === 'function') {
              window.screen.orientation.lock('landscape').catch((error) => {
                // Orientation lock not supported or permission denied, ignore error
                console.log('Orientation lock not supported or permission denied:', error.message);
              });
            }
          } catch (orientationError) {
            // Additional safety catch for orientation lock
            console.log('Orientation lock failed:', orientationError.message);
          }
        }, 100); // Small delay to let fullscreen activate first
      } else {
        console.log('Already in fullscreen mode');
      }
    } else {
      console.warn('Document or documentElement not available');
    }
    
  } catch (error) {
    console.error('Error in doubleClicked handler:', error);
    // Don't throw the error, just log it to prevent crashes
  }
};

const handlePause = () => {
  // Prevent multiple rapid calls
  if (isHandlingPause) {
    return;
  }
  isHandlingPause = true;
  
  // Safety check: ensure we have valid songs and songNum
  if (!songs || songs.length === 0 || songNum < 0 || songNum >= songs.length || !songs[songNum]) {
    console.warn('Cannot handle pause: invalid songs or songNum', { songsLength: songs?.length, songNum });
    isHandlingPause = false;
    return;
  }
  
  if (paused) {
    context.resume().then(() => {
      songs[songNum].play();
      // Keep visual loop running - removed p.loop()
      isHandlingPause = false; // Reset guard after operation completes
    }).catch((error) => {
      console.error('Error resuming context:', error);
      isHandlingPause = false;
    });
  } else {
    songs[songNum].pause();
    // Keep visual loop running - removed p.noLoop()
    isHandlingPause = false; // Reset guard immediately for pause
  }
  paused = !paused;
};

// Button functions for each section
const handleSection1Click = () => {
  console.log('Section 1 clicked - Navigate to Song Selection');
  // Navigate to song selection page
  if (typeof window !== 'undefined') {
    window.location.href = '/select';
  }
};

const handleSection2Click = () => {
  console.log('Section 2 clicked - Navigate to Song Selection');
  // Navigate to song selection page
  if (typeof window !== 'undefined') {
    window.location.href = '/select';
  }
};

const handleSection3Click = () => {
  console.log('Section 3 clicked - Navigate to User Profile');
  // Navigate to user profile
  if (typeof window !== 'undefined') {
    window.location.href = '/user';
  }
};

export const draw = (p5) => {
  p = p5;
  p.background(0);
  p.rectMode(p.CENTER);
  
  if (started) {
    // Safety check: ensure we have valid songNum and loaded assets
    if (songNum < 0 || songNum >= bg.length || !bg[songNum] || !fft) {
      console.warn('Invalid songNum, background not loaded, or FFT not available:', { songNum, bgLength: bg.length, fftExists: !!fft });
      return;
    }
    
    // Additional safety check for FFT and audio connection
    if (!songs[songNum] || songs[songNum].isLoaded && !songs[songNum].isLoaded()) {
      console.warn('Song not loaded or FFT connection invalid');
      return;
    }
    
    p.translate(width / 2, height / 2);
    p.imageMode(p.CENTER);

    let amp = 0;
    let wave = [];
    
    try {
      fft.analyze();
      amp = fft.getEnergy(20, 200);
      wave = fft.waveform();
    } catch (error) {
      console.warn('FFT analysis failed, using default values:', error);
      amp = 0;
      wave = new Array(1024).fill(0); // Default empty waveform
    }
    
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
    
    // Store the arc rotation amount
    let arcRotation = amp / 20; // This is in radians
    
    // slice options
    p.rotate(arcRotation);
    p.stroke(190, 183, 223);
    
    // Mouse section detection for interactive highlighting
    // Calculate mouse position relative to canvas center
    let mouseXFromCenter = p.mouseX - width / 2;
    let mouseYFromCenter = p.mouseY - height / 2;
    
    // Calculate mouse angle in screen space (0-360 degrees)
    let mouseAngle = Math.atan2(mouseYFromCenter, mouseXFromCenter) * 180 / Math.PI;
    if (mouseAngle < 0) mouseAngle += 360;
    
    // Use the raw mouse angle without rotation compensation (this was working)
    let testAngle = mouseAngle;
    
    // Determine which section contains the mouse (0-120°=1, 120-240°=2, 240-360°=3)
    let mouseInSection = -1;
    if (testAngle >= 0 && testAngle < 120) mouseInSection = 1;
    else if (testAngle >= 120 && testAngle < 240) mouseInSection = 2; 
    else if (testAngle >= 240 && testAngle < 360) mouseInSection = 3;
    
    // Update hovered section for click handling
    hoveredSection = mouseInSection;
    
    // Update pulse animation
    if (mouseInSection !== -1) {
      pulseTime += 0.15; // Animation speed
      animationScale = 1 + Math.sin(pulseTime) * 0.1; // Pulse between 0.9 and 1.1
    } else {
      pulseTime = 0;
      animationScale = 1;
    }
    
    // Default audio-reactive alpha for sections
    let alpha = p.map(amp, 240, 0, 120, 30);
    
    // Calculate animated size for hovered sections
    let arcSize = width * 2;
    let animatedArcSize = arcSize * animationScale;
    
    // Draw arc sections with mouse-based highlighting and animation
    if (mouseInSection === 1) {
      // Highlight section 1 with full black opacity and animation, others with audio-reactive alpha
      p.fill(0, 255);
      arc1 = p.arc(0, 0, animatedArcSize, animatedArcSize, 0, 120 - 8, p.PIE);
      p.fill(0, alpha);
      arc2 = p.arc(0, 0, arcSize, arcSize, 120, 240 - 16, p.PIE);
      arc3 = p.arc(0, 0, arcSize, arcSize, 240, 360 - 12, p.PIE);
    } else if (mouseInSection === 2) {
      // Highlight section 2 with full black opacity and animation, others with audio-reactive alpha
      p.fill(0, alpha);
      arc1 = p.arc(0, 0, arcSize, arcSize, 0, 120 - 8, p.PIE);
      p.fill(0, 255);
      arc2 = p.arc(0, 0, animatedArcSize, animatedArcSize, 120, 240 - 16, p.PIE);
      p.fill(0, alpha);
      arc3 = p.arc(0, 0, arcSize, arcSize, 240, 360 - 12, p.PIE);
    } else if (mouseInSection === 3) {
      // Highlight section 3 with full black opacity and animation, others with audio-reactive alpha
      p.fill(0, alpha);
      arc1 = p.arc(0, 0, arcSize, arcSize, 0, 120 - 8, p.PIE);
      arc2 = p.arc(0, 0, arcSize, arcSize, 120, 240 - 16, p.PIE);
      p.fill(0, 255);
      arc3 = p.arc(0, 0, animatedArcSize, animatedArcSize, 240, 360 - 12, p.PIE);
    } else {
      // No section highlighted - draw all with audio-reactive alpha
      p.fill(0, alpha);
      arc1 = p.arc(0, 0, arcSize, arcSize, 0, 120 - 8, p.PIE);
      arc2 = p.arc(0, 0, arcSize, arcSize, 120, 240 - 16, p.PIE);
      arc3 = p.arc(0, 0, arcSize, arcSize, 240, 360 - 12, p.PIE);
    }
    // Center circle (audio visualizer core)
    p.fill(0);
    p.ellipse(0, 0, p.map(amp, 0, 250, 10 * px, 24 * px) + (amp > 210 ? 4 : 0));
    p.pop();

    // Audio waveform visualization
    p.fill(0, 100);
    p.stroke(255);
    p.strokeWeight(3);
    // wave variable already declared above in the try-catch block
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

    // Always render existing particles, even when paused
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].edges()) {
        particles.splice(i, 1);
      } else {
        // Only update particles if not paused (they freeze in place when paused)
        if (!paused) {
          particles[i].update(amp > 210);
        }
        particles[i].show(p);
      }
    }
    
    // Only create new particles when not paused
    if (!paused) {
      let particle = new Particle(px, edgeLength, p, canvas);
      particles.push(particle);
    }
  } else {
    p.textSize(32);
    p.textAlign(p.CENTER);
    p.fill(255, 255, 255);
    p.text('Click me ^_^', width / 2, height / 2);
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
    // Hide the volume display after duration expires
    showVolumeDisplay = false;
  }
};

// Cleanup function to stop music and reset everything when leaving the page
export const cleanup = () => {
  try {
    // Stop all currently playing songs
    if (songs && songs.length > 0) {
      songs.forEach((song, index) => {
        if (song && song.isPlaying && song.isPlaying()) {
          song.stop();
        }
      });
    }
    
    // Stop the specific current song if it exists
    if (songNum >= 0 && songs[songNum]) {
      songs[songNum].stop();
    }
    
    // Clear and reset FFT
    if (fft) {
      fft = null;
    }
    
    // Clear particles array
    particles = [];
    
    // Reset state variables
    started = false;
    paused = true;
    isHandlingPause = false;
    showVolumeDisplay = false;
    hoveredSection = -1;
    contextStarted = false;
    
    // Reset song arrays to force reload on next visit
    songs = [];
    bg = [];
    songNum = -1;
    
    // Suspend audio context if it exists
    if (context && context.state === 'running') {
      context.suspend().catch(() => {
        // Ignore errors during cleanup
      });
    }
    
    console.log('Landing page cleanup completed');
  } catch (error) {
    console.error('Error during landing page cleanup:', error);
  }
};
