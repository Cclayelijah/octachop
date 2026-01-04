import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SongWithLevels, Level } from '../../../../shared/types';

interface GoPlayProps {
  disabled?: boolean;
  selectedSong?: SongWithLevels | null;
  selectedLevel?: Level | null;
}

const GoPlay: React.FC<GoPlayProps> = ({ disabled = false, selectedSong, selectedLevel }) => {
  const router = useRouter();
  
  const handlePlayClick = () => {
    if (!selectedSong || !selectedLevel) {
      console.warn('No song or level selected');
      return;
    }
    
    // Navigate to play page with selected data
    router.push({
      pathname: '/play',
      query: {
        songId: selectedSong.songId,
        levelId: selectedLevel.levelId
      }
    });
  };
  return (
    <Box
        onClick={handlePlayClick}
        sx={{ 
          pointerEvents: 'auto',
          cursor: disabled || !selectedSong || !selectedLevel ? 'not-allowed' : 'pointer',
          opacity: disabled || !selectedSong || !selectedLevel ? 0.5 : 1,
          transition: 'all 0.3s ease',
          animation: disabled || !selectedSong || !selectedLevel ? 'none' : 'arrowBounce 4s ease-in-out infinite',
          '&:hover': {
            transform: disabled || !selectedSong || !selectedLevel ? 'none' : 'scale(1.05) translateX(-5px)',
            filter: disabled || !selectedSong || !selectedLevel ? 'none' : 'drop-shadow(0 0 20px rgba(190, 183, 223, 0.6))',
            animation: 'none', // Stop bouncing on hover
          },
          '&:active': {
            transform: disabled || !selectedSong || !selectedLevel ? 'none' : 'scale(0.98)',
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
        <Image src="/images/arrow1.png" alt="Start Button" width={100} height={60} />
      </Box>
  );
};

export default GoPlay;