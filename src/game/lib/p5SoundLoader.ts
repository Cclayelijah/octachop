// Utility to safely load p5.sound and prevent AudioWorklet duplicate registration
let p5SoundLoaded = false;
let errorSuppressionActive = false;

// Extend window interface
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    p5SoundLoaded?: boolean;
    audioContextCreated?: boolean;
  }
}

// Set up global error suppression IMMEDIATELY
const setupGlobalErrorSuppression = () => {
  if (typeof window === 'undefined' || errorSuppressionActive) return;
  
  errorSuppressionActive = true;
  
  // Store originals
  const originalError = window.console.error;
  const originalWarn = window.console.warn;
  
  // Override console.error globally
  window.console.error = (...args: any[]) => {
    const errorMessage = String(args[0] || '');
    
    // Completely suppress AudioWorklet errors
    if (errorMessage.includes('registerProcessor') || 
        errorMessage.includes('AudioWorkletProcessor') ||
        errorMessage.includes('already registered') ||
        errorMessage.includes('AudioWorkletGlobalScope')) {
      return;
    }
    
    // Allow other errors through
    originalError.apply(console, args);
  };
  
  // Override console.warn globally  
  window.console.warn = (...args: any[]) => {
    const warnMessage = String(args[0] || '');
    
    if (warnMessage.includes('AudioWorklet') ||
        warnMessage.includes('registerProcessor')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
  
  console.log('Global AudioWorklet error suppression activated');
};

// Call this immediately when the module loads
if (typeof window !== 'undefined') {
  setupGlobalErrorSuppression();
}

export const loadP5Sound = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  
  return new Promise<void>((resolve) => {
    // Check if already loaded
    if (window.p5SoundLoaded || p5SoundLoaded) {
      resolve();
      return;
    }

    // Ensure error suppression is active before loading
    setupGlobalErrorSuppression();

    try {
      console.log('Loading p5.sound...');
      
      // Mark as loading to prevent concurrent loads
      p5SoundLoaded = true;
      window.p5SoundLoaded = true;
      
      // Load p5.sound (this is where AudioWorklet errors occur)
      require('../lib/p5.sound');
      
      console.log('p5.sound loaded successfully');
      
      // Give p5.sound time to initialize completely
      setTimeout(() => {
        resolve();
      }, 300);
      
    } catch (error) {
      console.warn('Failed to load p5.sound:', error);
      resolve();
    }
  });
};

export const resetP5Sound = () => {
  // Only reset in development to avoid re-registration issues
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    p5SoundLoaded = false;
    if (window.p5SoundLoaded !== undefined) {
      window.p5SoundLoaded = false;
    }
  }
};