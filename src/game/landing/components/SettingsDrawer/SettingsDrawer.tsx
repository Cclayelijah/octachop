import React, { useState } from 'react';
import styles from './SettingsDrawer.module.css';

export interface SettingsConfig {
  // Timing
  DELAY: number;
  // Visual
  SHOW_SLICES: boolean;
  CURSOR_SIZE: number;
  ANALYZE_AUDIO: boolean;
  ANCHOR_BEAT: boolean;
  IMAGE_TILT: boolean;
  SHOW_PARTICLES: boolean;
  OPACITY_FLICKER: boolean;
  SHOW_WAVEFORM: boolean;
  // Colors
  CURSOR_COLOR: [number, number, number];
  SLICE_COLOR: [number, number, number];
  NOTE_COLOR: [number, number, number];
  NOTE_GLOW: string;
}

export const defaultSettings: SettingsConfig = {
  DELAY: 0,
  // Visual
  SHOW_SLICES: false,
  CURSOR_SIZE: 14,
  ANALYZE_AUDIO: true,
  ANCHOR_BEAT: true,
  IMAGE_TILT: true,
  SHOW_PARTICLES: false,
  OPACITY_FLICKER: true,
  SHOW_WAVEFORM: false,
  // Colors
  CURSOR_COLOR: [35, 116, 171],
  SLICE_COLOR: [51, 51, 51],
  NOTE_COLOR: [255, 255, 255],
  NOTE_GLOW: "rgb(190, 183, 223)",
};

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: SettingsConfig;
  onSettingsChange?: (settings: SettingsConfig) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings = defaultSettings,
  onSettingsChange,
}) => {
  const [tempSettings, setTempSettings] = useState<SettingsConfig>(settings);

  const handleSettingChange = (key: keyof SettingsConfig, value: any) => {
    const updatedSettings = { ...tempSettings, [key]: value };
    setTempSettings(updatedSettings);
    if (onSettingsChange) {
      onSettingsChange(updatedSettings);
    }
  };

  const handleColorChange = (colorKey: 'CURSOR_COLOR' | 'SLICE_COLOR' | 'NOTE_COLOR', index: number, value: number) => {
    const currentColor = [...tempSettings[colorKey]] as [number, number, number];
    currentColor[index] = value;
    handleSettingChange(colorKey, currentColor);
  };

  const handleReset = () => {
    setTempSettings(defaultSettings);
    if (onSettingsChange) {
      onSettingsChange(defaultSettings);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          {/* Timing Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Timing</h3>
            <div className={styles.setting}>
              <label className={styles.label}>Delay (ms)</label>
              <input
                type="number"
                className={styles.numberInput}
                value={tempSettings.DELAY}
                onChange={(e) => handleSettingChange('DELAY', parseInt(e.target.value) || 0)}
                min="0"
                max="1000"
              />
            </div>
          </div>

          {/* Visual Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Visual</h3>
            
            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.SHOW_SLICES}
                  onChange={(e) => handleSettingChange('SHOW_SLICES', e.target.checked)}
                />
                Show Slices
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>Cursor Size</label>
              <input
                type="range"
                className={styles.slider}
                min="1"
                max="50"
                value={tempSettings.CURSOR_SIZE}
                onChange={(e) => handleSettingChange('CURSOR_SIZE', parseInt(e.target.value))}
              />
              <span className={styles.value}>{tempSettings.CURSOR_SIZE}</span>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.ANALYZE_AUDIO}
                  onChange={(e) => handleSettingChange('ANALYZE_AUDIO', e.target.checked)}
                />
                Analyze Audio <span className={styles.note}>(disable to improve performance)</span>
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.ANCHOR_BEAT}
                  onChange={(e) => handleSettingChange('ANCHOR_BEAT', e.target.checked)}
                />
                Anchor Beat <span className={styles.note}>(circle grows with beat)</span>
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.IMAGE_TILT}
                  onChange={(e) => handleSettingChange('IMAGE_TILT', e.target.checked)}
                />
                Image Tilt <span className={styles.note}>(background tilt on beat)</span>
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.SHOW_PARTICLES}
                  onChange={(e) => handleSettingChange('SHOW_PARTICLES', e.target.checked)}
                />
                Show Particles <span className={styles.note}>(can affect performance)</span>
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.OPACITY_FLICKER}
                  onChange={(e) => handleSettingChange('OPACITY_FLICKER', e.target.checked)}
                />
                Opacity Flicker <span className={styles.note}>(flicker on beat)</span>
              </label>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={tempSettings.SHOW_WAVEFORM}
                  onChange={(e) => handleSettingChange('SHOW_WAVEFORM', e.target.checked)}
                />
                Show Waveform <span className={styles.note}>(beta feature)</span>
              </label>
            </div>
          </div>

          {/* Colors Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Colors</h3>
            
            <div className={styles.setting}>
              <label className={styles.label}>Cursor Color (RGB)</label>
              <div className={styles.colorInputs}>
                {['R', 'G', 'B'].map((label, index) => (
                  <div key={label} className={styles.colorInput}>
                    <span className={styles.colorLabel}>{label}</span>
                    <input
                      type="number"
                      className={styles.colorNumber}
                      min="0"
                      max="255"
                      value={tempSettings.CURSOR_COLOR[index]}
                      onChange={(e) => handleColorChange('CURSOR_COLOR', index, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>Slice Color (RGB)</label>
              <div className={styles.colorInputs}>
                {['R', 'G', 'B'].map((label, index) => (
                  <div key={label} className={styles.colorInput}>
                    <span className={styles.colorLabel}>{label}</span>
                    <input
                      type="number"
                      className={styles.colorNumber}
                      min="0"
                      max="255"
                      value={tempSettings.SLICE_COLOR[index]}
                      onChange={(e) => handleColorChange('SLICE_COLOR', index, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>Note Color (RGB)</label>
              <div className={styles.colorInputs}>
                {['R', 'G', 'B'].map((label, index) => (
                  <div key={label} className={styles.colorInput}>
                    <span className={styles.colorLabel}>{label}</span>
                    <input
                      type="number"
                      className={styles.colorNumber}
                      min="0"
                      max="255"
                      value={tempSettings.NOTE_COLOR[index]}
                      onChange={(e) => handleColorChange('NOTE_COLOR', index, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.setting}>
              <label className={styles.label}>Note Glow</label>
              <input
                type="text"
                className={styles.textInput}
                value={tempSettings.NOTE_GLOW}
                onChange={(e) => handleSettingChange('NOTE_GLOW', e.target.value)}
                placeholder="rgb(190, 183, 223)"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className={styles.actions}>
            <button className={styles.resetButton} onClick={handleReset}>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;