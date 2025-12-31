// Global sketch manager to prevent conflicts between landing and play sketches
let activeSketch: 'landing' | 'play' | null = null;
let sketchInstances = new Set<string>();
let lastKeyPressTime = 0;
let lastKeyCode = -1;
const KEY_DEBOUNCE_MS = 100; // Prevent duplicate key events within 100ms

export const setActiveSketch = (sketchType: 'landing' | 'play' | null) => {
  activeSketch = sketchType;
  console.log('Active sketch set to:', sketchType);
  
  // Clear other sketch instances when setting a new active one
  if (sketchType) {
    sketchInstances.clear();
    sketchInstances.add(sketchType);
  }
};

export const getActiveSketch = () => {
  return activeSketch;
};

export const isSketchActive = (sketchType: 'landing' | 'play') => {
  return activeSketch === sketchType;
};

export const registerSketchInstance = (sketchType: 'landing' | 'play') => {
  sketchInstances.add(sketchType);
  console.log('Registered sketch instance:', sketchType, 'Total instances:', sketchInstances.size);
};

export const canHandleKeyPress = (sketchType: 'landing' | 'play', keyCode?: number) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const currentTime = Date.now();
  
  // Debounce duplicate key events
  if (keyCode !== undefined && 
      keyCode === lastKeyCode && 
      (currentTime - lastKeyPressTime) < KEY_DEBOUNCE_MS) {
    console.log(`Debounced duplicate keypress for ${sketchType}: keyCode=${keyCode}`);
    return false;
  }
  
  console.log(`canHandleKeyPress check: sketch="${sketchType}", currentPath="${currentPath}", activeSketch="${activeSketch}"`);
  
  // Strict path-based routing
  if (sketchType === 'landing' && currentPath !== '/') {
    console.log(`Blocking ${sketchType} - wrong path (${currentPath} !== /)`);
    return false;
  }
  
  if (sketchType === 'play' && currentPath !== '/play') {
    console.log(`Blocking ${sketchType} - wrong path (${currentPath} !== /play)`);
    return false;
  }
  
  const canHandle = activeSketch === sketchType;
  console.log(`Final decision for ${sketchType}: ${canHandle} (activeSketch=${activeSketch})`);
  
  // Update last key press info for debouncing if this was approved
  if (canHandle && keyCode !== undefined) {
    lastKeyPressTime = currentTime;
    lastKeyCode = keyCode;
  }
  
  return canHandle;
};