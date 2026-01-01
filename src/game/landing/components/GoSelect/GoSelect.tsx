import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface GoSelectProps {
  isSettingsOpen: boolean;
  onSettingsToggle: () => void;
}

const GoSelect: React.FC<GoSelectProps> = ({ isSettingsOpen, onSettingsToggle }) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onSettingsToggle();
        }} 
        sx={{ 
          cursor: 'pointer', 
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          transform: isSettingsOpen ? 'translateX(400px)' : 'translateX(0)',
          animation: isSettingsOpen ? 'none' : 'settingsPulse 3s ease-in-out infinite',
          '@media (max-width: 900px)': {
            transform: isSettingsOpen ? 'translateX(300px)' : 'translateX(0)',
          },
          '@media (max-width: 600px)': {
            transform: isSettingsOpen ? 'translateX(200px)' : 'translateX(0)',
          },
          '&:hover': {
            transform: isSettingsOpen 
              ? 'translateX(400px) scale(1.1) rotate(15deg)' 
              : 'scale(1.1) rotate(15deg)',
            '@media (max-width: 900px)': {
              transform: isSettingsOpen 
                ? 'translateX(300px) scale(1.1) rotate(15deg)' 
                : 'scale(1.1) rotate(15deg)',
            },
            '@media (max-width: 600px)': {
              transform: isSettingsOpen 
                ? 'translateX(200px) scale(1.1) rotate(15deg)' 
                : 'scale(1.1) rotate(15deg)',
            },
            filter: 'drop-shadow(0 0 15px rgba(190, 183, 223, 0.8))',
            animation: 'none', // Stop pulsing on hover
          },
          '&:active': {
            transform: isSettingsOpen 
              ? 'translateX(400px) scale(0.95)' 
              : 'scale(0.95)',
            '@media (max-width: 900px)': {
              transform: isSettingsOpen 
                ? 'translateX(300px) scale(0.95)' 
                : 'scale(0.95)',
            },
            '@media (max-width: 600px)': {
              transform: isSettingsOpen 
                ? 'translateX(200px) scale(0.95)' 
                : 'scale(0.95)',
            },
          },
          '@keyframes settingsPulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.03)' },
            '100%': { transform: 'scale(1)' },
          }
        }}
      >
        <Image src="/images/settings.png" alt="Settings" width={60} height={60} />
      </Box>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        sx={{ 
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          animation: 'arrowBounce 4s ease-in-out infinite',
          '&:hover': {
            transform: 'scale(1.05) translateX(-5px)',
            filter: 'drop-shadow(0 0 20px rgba(190, 183, 223, 0.6))',
            animation: 'none', // Stop bouncing on hover
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '@keyframes arrowBounce': {
            '0%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-3px)' },
            '50%': { transform: 'translateX(0)' },
            '75%': { transform: 'translateX(-1px)' },
            '100%': { transform: 'translateX(0)' },
          }
        }}
      >
        <Link href="/select">
          <Image src="/images/arrow1.png" alt="Start Button" width={100} height={60} />
        </Link>
      </Box>
    </Box>
  );
};

export default GoSelect;