import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

interface GoPlayProps {
  disabled?: boolean;
}

const GoPlay: React.FC<GoPlayProps> = ({ disabled = false }) => {
  return (
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
        <Link href="/play">
          <Image src="/images/arrow1.png" alt="Start Button" width={100} height={60} />
        </Link>
      </Box>
  );
};

export default GoPlay;