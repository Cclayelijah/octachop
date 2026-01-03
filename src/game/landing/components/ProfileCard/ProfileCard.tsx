import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';

interface ProfileCardProps {
  isSettingsOpen: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ isSettingsOpen }) => {
  const { user } = useUser();
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingRank, setIsLoadingRank] = useState(false);

  useEffect(() => {
    const fetchUserRank = async () => {
      if (!user?.id) return;
      
      setIsLoadingRank(true);
      try {
        const response = await fetch(`/api/user/rank?clerkId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setUserRank(data.rank);
        }
      } catch (error) {
        console.error('Error fetching user rank:', error);
      } finally {
        setIsLoadingRank(false);
      }
    };

    fetchUserRank();
  }, [user?.id]);

  return (
    <Box display="flex" justifyContent="space-between" sx={{ paddingTop: 2, paddingRight: 2 }}>
      <Box 
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        sx={{ 
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
          transform: isSettingsOpen ? 'translateX(400px)' : 'translateX(0)',
          '@media (max-width: 900px)': {
            transform: isSettingsOpen ? 'translateX(300px)' : 'translateX(0)',
          },
          '@media (max-width: 600px)': {
            transform: isSettingsOpen ? 'translateX(200px)' : 'translateX(0)',
          },
          '&:hover': {
            transform: isSettingsOpen ? 'translateX(400px) scale(1.02)' : 'scale(1.02)',
            '@media (max-width: 900px)': {
              transform: isSettingsOpen ? 'translateX(300px) scale(1.02)' : 'scale(1.02)',
            },
            '@media (max-width: 600px)': {
              transform: isSettingsOpen ? 'translateX(200px) scale(1.02)' : 'scale(1.02)',
            },
            filter: 'drop-shadow(0 0 10px rgba(190, 183, 223, 0.3))',
          }
        }}
      >
        <Image src="/images/logo.png" alt="Logo Button" width={70} height={120} />
      </Box>
      <Box 
        display="flex" 
        alignItems="top" 
        gap={3}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        sx={{ 
          pointerEvents: 'auto',
          transition: 'all 0.3s ease',
        }}
      >
        {user && (
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                fontWeight: 600,
              }}
            >
              {user.firstName || user.username || 'User'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontStyle: 'italic',
                fontSize: '0.8rem',
                marginTop: '1px'
              }}
            >
              {isLoadingRank ? 'Loading rank...' : userRank ? `Rank #${userRank}` : 'Unranked'}
            </Typography>
          </Box>
        )}
        <Box
          sx={{ 
            transition: 'all 0.3s ease',
            transform: 'scale(1.6)', 
            padding: '2px',
            marginTop: 3.5,
            '&:hover': {
              transform: 'scale(1.8)', // Slightly bigger on hover
              filter: 'drop-shadow(0 0 10px rgba(190, 183, 223, 0.4))',
            },
          }}
        >
          <UserButton />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileCard;