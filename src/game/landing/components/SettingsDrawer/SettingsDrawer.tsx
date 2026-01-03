import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  Switch,
  Slider,
  TextField,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

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

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 400,
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '2px solid rgba(190, 183, 223, 0.3)',
    borderRadius: '0 8px 8px 0',
    boxShadow: '0 4px 20px rgba(190, 183, 223, 0.2)',
  },
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'rgba(190, 183, 223, 0.05)',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(190, 183, 223, 0.2)',
  borderRadius: '8px',
}));

const ColorInputBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  marginTop: theme.spacing(1),
}));

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
    <StyledDrawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      variant="temporary"
    >
      <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ color: '#111111ff', fontWeight: 'bold' }}>
            Settings
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#8B7FD6' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Timing Section */}
        <SectionPaper>
          <Typography variant="h6" sx={{ color: '#8B7FD6', mb: 2, borderBottom: '2px solid rgba(190, 183, 223, 0.3)', pb: 1, fontWeight: 600 }}>
            Timing
          </Typography>
          
          <Box mb={2}>
            <Typography variant="body2" sx={{ color: '#333333', mb: 1 }}>
              Delay (ms)
            </Typography>
            <TextField
              type="number"
              value={tempSettings.DELAY}
              onChange={(e) => handleSettingChange('DELAY', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 1000 }}
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(190, 183, 223, 0.05)',
                  color: '#333333',
                  '& fieldset': { borderColor: 'rgba(190, 183, 223, 0.5)' },
                  '&:hover fieldset': { borderColor: '#8B7FD6' },
                  '&.Mui-focused fieldset': { borderColor: '#8B7FD6' },
                }
              }}
            />
          </Box>
        </SectionPaper>

        {/* Visual Section */}
        <SectionPaper>
          <Typography variant="h6" sx={{ color: '#8B7FD6', mb: 2, borderBottom: '2px solid rgba(190, 183, 223, 0.3)', pb: 1, fontWeight: 600 }}>
            Visual
          </Typography>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.SHOW_SLICES}
                  onChange={(e) => handleSettingChange('SHOW_SLICES', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label="Show Slices"
              sx={{ color: '#555555', width: '100%', m: 0 }}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(85,85,85,0.7)', mb: 1 }}>
              Cursor Size: {tempSettings.CURSOR_SIZE}
            </Typography>
            <Slider
              value={tempSettings.CURSOR_SIZE}
              onChange={(_, value) => handleSettingChange('CURSOR_SIZE', value)}
              min={1}
              max={50}
              sx={{
                color: '#8B7FD6',
                '& .MuiSlider-thumb': { backgroundColor: '#8B7FD6' },
                '& .MuiSlider-track': { backgroundColor: '#8B7FD6' },
              }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.ANALYZE_AUDIO}
                  onChange={(e) => handleSettingChange('ANALYZE_AUDIO', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Analyze Audio</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (disable to improve performance)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.ANCHOR_BEAT}
                  onChange={(e) => handleSettingChange('ANCHOR_BEAT', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Anchor Beat</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (circle grows with beat)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.IMAGE_TILT}
                  onChange={(e) => handleSettingChange('IMAGE_TILT', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Image Tilt</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (background tilt on beat)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.SHOW_PARTICLES}
                  onChange={(e) => handleSettingChange('SHOW_PARTICLES', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Show Particles</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (can affect performance)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.OPACITY_FLICKER}
                  onChange={(e) => handleSettingChange('OPACITY_FLICKER', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Opacity Flicker</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (flicker on beat)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tempSettings.SHOW_WAVEFORM}
                  onChange={(e) => handleSettingChange('SHOW_WAVEFORM', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B7FD6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#8B7FD6' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ color: '#555555' }}>Show Waveform</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(85,85,85,0.5)' }}>
                    (beta feature)
                  </Typography>
                </Box>
              }
              sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
            />
          </Box>
        </SectionPaper>

        {/* Colors Section */}
        <SectionPaper>
          <Typography variant="h6" sx={{ color: '#8B7FD6', mb: 2, borderBottom: '2px solid rgba(190, 183, 223, 0.3)', pb: 1, fontWeight: 600 }}>
            Colors
          </Typography>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(85,85,85,0.7)', mb: 1 }}>
              Cursor Color (RGB)
            </Typography>
            <ColorInputBox>
              {['R', 'G', 'B'].map((label, index) => (
                <Box key={label} display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" sx={{ color: '#555555', minWidth: '12px' }}>
                    {label}
                  </Typography>
                  <TextField
                    type="number"
                    value={tempSettings.CURSOR_COLOR[index]}
                    onChange={(e) => handleColorChange('CURSOR_COLOR', index, parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 255 }}
                    size="small"
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(190, 183, 223, 0.05)',
                        color: '#333333',
                        '& fieldset': { borderColor: 'rgba(190, 183, 223, 0.5)' },
                        '&:hover fieldset': { borderColor: '#8B7FD6' },
                        '&.Mui-focused fieldset': { borderColor: '#8B7FD6' },
                      }
                    }}
                  />
                </Box>
              ))}
            </ColorInputBox>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(85,85,85,0.7)', mb: 1 }}>
              Slice Color (RGB)
            </Typography>
            <ColorInputBox>
              {['R', 'G', 'B'].map((label, index) => (
                <Box key={label} display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" sx={{ color: '#555555', minWidth: '12px' }}>
                    {label}
                  </Typography>
                  <TextField
                    type="number"
                    value={tempSettings.SLICE_COLOR[index]}
                    onChange={(e) => handleColorChange('SLICE_COLOR', index, parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 255 }}
                    size="small"
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(190, 183, 223, 0.05)',
                        color: '#333333',
                        '& fieldset': { borderColor: 'rgba(190, 183, 223, 0.5)' },
                        '&:hover fieldset': { borderColor: '#8B7FD6' },
                        '&.Mui-focused fieldset': { borderColor: '#8B7FD6' },
                      }
                    }}
                  />
                </Box>
              ))}
            </ColorInputBox>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(85,85,85,0.7)', mb: 1 }}>
              Note Color (RGB)
            </Typography>
            <ColorInputBox>
              {['R', 'G', 'B'].map((label, index) => (
                <Box key={label} display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" sx={{ color: '#555555', minWidth: '12px' }}>
                    {label}
                  </Typography>
                  <TextField
                    type="number"
                    value={tempSettings.NOTE_COLOR[index]}
                    onChange={(e) => handleColorChange('NOTE_COLOR', index, parseInt(e.target.value) || 0)}
                    inputProps={{ min: 0, max: 255 }}
                    size="small"
                    sx={{
                      width: '80px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(190, 183, 223, 0.05)',
                        color: '#333333',
                        '& fieldset': { borderColor: 'rgba(190, 183, 223, 0.5)' },
                        '&:hover fieldset': { borderColor: '#8B7FD6' },
                        '&.Mui-focused fieldset': { borderColor: '#8B7FD6' },
                      }
                    }}
                  />
                </Box>
              ))}
            </ColorInputBox>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: 'rgba(85,85,85,0.7)', mb: 1 }}>
              Note Glow
            </Typography>
            <TextField
              value={tempSettings.NOTE_GLOW}
              onChange={(e) => handleSettingChange('NOTE_GLOW', e.target.value)}
              placeholder="rgb(190, 183, 223)"
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(190, 183, 223, 0.05)',
                  color: '#333333',
                  '& fieldset': { borderColor: 'rgba(190, 183, 223, 0.5)' },
                  '&:hover fieldset': { borderColor: '#8B7FD6' },
                  '&.Mui-focused fieldset': { borderColor: '#8B7FD6' },
                }
              }}
            />
          </Box>
        </SectionPaper>

        {/* Reset Button */}
        <Box mt={3}>
          <Button
            variant="outlined"
            onClick={handleReset}
            fullWidth
            sx={{
              borderColor: '#8B7FD6',
              color: '#8B7FD6',
              '&:hover': {
                borderColor: '#BEB7DF',
                backgroundColor: 'rgba(190, 183, 223, 0.1)',
              }
            }}
          >
            Reset to Defaults
          </Button>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default SettingsDrawer;