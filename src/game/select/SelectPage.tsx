/**
 * Main Song Selection Page
 * Beautiful, responsive layo  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    difficulty: { min: 0, max: 10000 }, // Expanded range to include all difficulties
    duration: { min: 0, max: 600 },
    showFavoritesOnly: false
  });ching the design mockup
 */

import React, { useState, useEffect } from 'react';
import styles from './SelectPage.module.css';
import { PlayerInfo as PlayerInfoComponent, GoPlay } from './components';
import ScoresList from './components/ScoresList/ScoresList';
import SongWheel from './components/SongWheel/SongWheel';
import FilterPanel from './components/FilterPanel';
import { 
  SongWithLevels, 
  PlayerInfo as PlayerInfoType, 
  FilterState,
  PassResultWithDetails,
  Level
} from '../../shared/types';
import GoBack from './components/GoBack';
import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  Card,
  LinearProgress,
  Fade,
  ThemeProvider,
  createTheme,
  Stack,
  Avatar
} from '@mui/material';

// Create a dark theme with the project's purple colors
const loadingTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5a96',
      light: '#beb7df',
      dark: '#5a3a6b'
    },
    background: {
      default: '#1a1a2e',
      paper: 'rgba(255, 255, 255, 0.05)'
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)'
    }
  }
});

const defaultSongImg = 'pizza.png';

const SelectPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [player, setPlayer] = useState<PlayerInfoType | null>(null);
  const [songs, setSongs] = useState<SongWithLevels[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<SongWithLevels[]>([]);
  const [scores, setScores] = useState<PassResultWithDetails[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    difficulty: { min: 0, max: 10000 }, // Expanded range to include all difficulties
    duration: { min: 0, max: 600 },
    showFavoritesOnly: false,
  });
  
  // Audio loading state
  const [loadedAudio, setLoadedAudio] = useState<Map<number, HTMLAudioElement>>(new Map());
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLoadingQueue, setAudioLoadingQueue] = useState<Set<number>>(new Set());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Dynamic background colors
  const [backgroundGradient, setBackgroundGradient] = useState<string>('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
  
  // User favorites (now for levels instead of songs)
  const [userFavorites, setUserFavorites] = useState<number[]>([]);

  // Extract dominant colors from image
  const extractColorsFromImage = (imageUrl: string): Promise<string[]> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(['#1a1a2e', '#16213e', '#0f3460']); // fallback
          return;
        }

        // Scale down image for faster processing
        const scale = Math.min(100 / img.width, 100 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colors = extractDominantColors(imageData.data, 3);
          resolve(colors);
        } catch (error) {
          console.warn('Could not extract colors from image:', error);
          resolve(['#1a1a2e', '#16213e', '#0f3460']); // fallback
        }
      };

      img.onerror = () => {
        resolve(['#1a1a2e', '#16213e', '#0f3460']); // fallback
      };

      img.src = imageUrl;
    });
  };

  // Color clustering algorithm to find dominant colors
  const extractDominantColors = (imageData: Uint8ClampedArray, numColors: number): string[] => {
    const pixels: number[][] = [];
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < imageData.length; i += 16) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const alpha = imageData[i + 3];
      
      // Skip transparent pixels and very bright/dark pixels for better results
      if (alpha > 128 && !(r > 240 && g > 240 && b > 240) && !(r < 15 && g < 15 && b < 15)) {
        pixels.push([r, g, b]);
      }
    }

    if (pixels.length === 0) {
      return ['#1a1a2e', '#16213e', '#0f3460'];
    }

    // Simple k-means clustering to find dominant colors
    const clusters = kMeansColors(pixels, numColors);
    
    // Convert to hex and darken for background use
    return clusters.map(color => {
      const [r, g, b] = color.map(c => Math.max(20, Math.floor(c * 0.4))); // Darken for background
      return `rgb(${r}, ${g}, ${b})`;
    });
  };

  // Simple k-means clustering for color analysis
  const kMeansColors = (pixels: number[][], k: number, maxIterations: number = 10): number[][] => {
    if (pixels.length === 0) return [];
    
    // Initialize centroids randomly
    let centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
      centroids.push([...randomPixel]);
    }

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      const clusters: number[][][] = Array(k).fill(null).map(() => []);
      
      // Assign pixels to nearest centroid
      pixels.forEach(pixel => {
        let minDistance = Infinity;
        let closestCentroid = 0;
        
        centroids.forEach((centroid, index) => {
          const distance = Math.sqrt(
            Math.pow(pixel[0] - centroid[0], 2) +
            Math.pow(pixel[1] - centroid[1], 2) +
            Math.pow(pixel[2] - centroid[2], 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCentroid = index;
          }
        });
        
        clusters[closestCentroid].push(pixel);
      });

      // Update centroids
      const newCentroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0]; // fallback
        
        const avgR = cluster.reduce((sum, pixel) => sum + pixel[0], 0) / cluster.length;
        const avgG = cluster.reduce((sum, pixel) => sum + pixel[1], 0) / cluster.length;
        const avgB = cluster.reduce((sum, pixel) => sum + pixel[2], 0) / cluster.length;
        
        return [Math.round(avgR), Math.round(avgG), Math.round(avgB)];
      });

      centroids = newCentroids;
    }

    return centroids;
  };

  // Generate audio URL based on the same pattern as images
  const generateAudioUrl = (song: SongWithLevels): string => {
    if (song.songUrl) {
      // If songUrl is already a full URL, use it directly
      if (song.songUrl.startsWith('http')) {
        return song.songUrl;
      }
      // Otherwise construct Supabase URL using the same pattern as images
      // Use beatmapSetId if available, otherwise use sanitized song title
      const folderId = song.beatmapSetId || sanitizeSongTitle(song.title);
      return `https://pxoisppgfuifvywwcvwt.supabase.co/storage/v1/object/public/songs/${folderId}/${song.songUrl}`;
    }
    return '';
  };

  // Helper function to sanitize song title for folder names (same as backend)
  const sanitizeSongTitle = (title: string): string => {
    return title
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();
  };

  // Background audio loading function
  const loadAudioInBackground = async (song: SongWithLevels): Promise<void> => {
    if (loadedAudio.has(song.songId) || audioLoadingQueue.has(song.songId)) {
      return; // Already loaded or loading
    }

    setAudioLoadingQueue(prev => new Set([...prev, song.songId]));

    try {
      const audioUrl = generateAudioUrl(song);
      if (!audioUrl) {
        console.warn(`No audio URL for song: ${song.title}`);
        return;
      }

      const audio = new Audio();
      audio.preload = 'auto';
      audio.volume = 0.7; // Set default volume
      
      await new Promise((resolve, reject) => {
        const onCanPlay = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          resolve(void 0);
        };
        
        const onError = () => {
          audio.removeEventListener('canplaythrough', onCanPlay);
          audio.removeEventListener('error', onError);
          reject(new Error(`Failed to load audio for ${song.title}`));
        };

        audio.addEventListener('canplaythrough', onCanPlay);
        audio.addEventListener('error', onError);
        audio.src = audioUrl;
      });

      setLoadedAudio(prev => new Map([...prev, [song.songId, audio]]));
      console.log(`✅ Audio loaded for: ${song.title}`);
    } catch (error) {
      console.error(`❌ Failed to load audio for ${song.title}:`, error);
    } finally {
      setAudioLoadingQueue(prev => {
        const newQueue = new Set(prev);
        newQueue.delete(song.songId);
        return newQueue;
      });
    }
  };

  // Load audio for current song and next 2-3 songs
  const loadSurroundingAudio = (currentIndex: number) => {
    if (!filteredSongs.length) return;

    // Load current song and next 2-3 songs
    const songsToLoad = [];
    for (let i = 0; i < 4; i++) { // Current + next 3
      const index = (currentIndex + i) % filteredSongs.length;
      songsToLoad.push(filteredSongs[index]);
    }

    // Load audio in background
    songsToLoad.forEach(song => {
      loadAudioInBackground(song);
    });
  };

  // Play/pause current audio
  const playCurrentAudio = () => {
    if (!selectedSongId) return;
    
    const audio = loadedAudio.get(selectedSongId);
    if (audio) {
      // Stop and reset any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      // If the same audio is already current and playing, don't restart it
      if (currentAudio === audio && !audio.paused) {
        return;
      }
      
      // Reset audio and play
      audio.currentTime = 0;
      
      // Remove any existing event listeners first
      const oldOnEnded = audio.onended;
      const oldOnPause = audio.onpause;
      
      audio.play().catch(console.error);
      setCurrentAudio(audio);
      setIsAudioPlaying(true);
      
      // Set event handlers (this overwrites any previous ones)
      audio.onended = () => setIsAudioPlaying(false);
      audio.onpause = () => setIsAudioPlaying(false);
    }
  };

  const pauseCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsAudioPlaying(false);
    }
    
    // Also pause any other potentially playing audio as a safety measure
    loadedAudio.forEach((audio, songId) => {
      if (!audio.paused) {
        audio.pause();
      }
    });
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user info, songs, scores, and favorites in parallel
        const [userResponse, songsResponse, scoresResponse, favoritesResponse] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/song'),
          fetch('/api/user/scores'),
          fetch('/api/user/favorites')
        ]);

        // Handle user data
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setPlayer(userData.user);
        } else {
          console.error('Failed to fetch user data');
        }

        // Handle favorites data
        let favoriteIds: number[] = [];
        if (favoritesResponse.ok) {
          favoriteIds = await favoritesResponse.json();
          setUserFavorites(favoriteIds); // These are now level IDs
        } else {
          console.error('Failed to fetch favorites');
        }

        // Handle songs data
        if (songsResponse.ok) {
          const songsData = await songsResponse.json();
          const processedSongs = songsData.songs.map((song: any) => ({
            ...song,
            maxDifficulty: Math.max(...song.levels.map((l: Level) => l.difficulty)),
            minDifficulty: Math.min(...song.levels.map((l: Level) => l.difficulty)),
          }));
          setSongs(processedSongs);
          setFilteredSongs(processedSongs);
          
          // Set first song as selected if available
          if (processedSongs.length > 0) {
            const firstSong = processedSongs[0];
            setSelectedSongId(firstSong.songId);
            
            // Auto-select first level of the first song
            if (firstSong.levels && firstSong.levels.length > 0) {
              setSelectedLevel(firstSong.levels[0]);
            }
          }
        } else {
          console.error('Failed to fetch songs');
        }

        // Handle scores data
        if (scoresResponse.ok) {
          const scoresData = await scoresResponse.json();
          setScores(scoresData.scores);
        } else {
          console.error('Failed to fetch scores');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedSong = songs.find(song => song.songId === selectedSongId) || null;

  // Update background when selected song changes
  useEffect(() => {
    if (selectedSong?.defaultImg) {
      extractColorsFromImage(selectedSong.defaultImg)
        .then(colors => {
          const gradient = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
          setBackgroundGradient(gradient);
        })
        .catch(() => {
          // Fallback to original gradient
          setBackgroundGradient('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
        });
    } else {
      // No image, use default gradient
      setBackgroundGradient('linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
    }
  }, [selectedSong?.defaultImg]);

  // Filter songs based on current filters
  useEffect(() => {
    let filtered = songs.filter(song => {
      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!song.title.toLowerCase().includes(searchLower) &&
            !song.artist.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Difficulty filter
      if (song.minDifficulty > filters.difficulty.max || 
          song.maxDifficulty < filters.difficulty.min) {
        return false;
      }

      // Duration filter
      if (song.duration && (song.duration < filters.duration.min || 
          song.duration > filters.duration.max)) {
        return false;
      }

      // Favorites filter (now checks if any level in the song is favorited)
      if (filters.showFavoritesOnly) {
        const hasAnyFavoritedLevel = song.levels.some(level => 
          userFavorites.includes(level.levelId)
        );
        if (!hasAnyFavoritedLevel) {
          return false;
        }
      }

      return true;
    });

    setFilteredSongs(filtered);
  }, [songs, filters, userFavorites]);

  // Keyboard navigation for difficulty selection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!selectedSong || selectedSong.levels.length <= 1) return;

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        
        const currentLevelIndex = selectedLevel 
          ? selectedSong.levels.findIndex(l => l.levelId === selectedLevel.levelId)
          : 0;
        
        let newIndex: number;
        
        if (event.key === 'ArrowLeft') {
          // Go to previous difficulty
          newIndex = currentLevelIndex > 0 ? currentLevelIndex - 1 : selectedSong.levels.length - 1;
        } else {
          // Go to next difficulty  
          newIndex = currentLevelIndex < selectedSong.levels.length - 1 ? currentLevelIndex + 1 : 0;
        }
        
        const newLevel = selectedSong.levels[newIndex];
        if (newLevel) {
          setSelectedLevel(newLevel);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedSong, selectedLevel]);

  // Load audio when filtered songs change
  useEffect(() => {
    if (filteredSongs.length > 0 && selectedSongId) {
      const currentIndex = filteredSongs.findIndex(song => song.songId === selectedSongId);
      if (currentIndex >= 0) {
        loadSurroundingAudio(currentIndex);
      }
    }
  }, [filteredSongs, selectedSongId]);

  // Load audio when song selection changes
  useEffect(() => {
    if (selectedSongId && filteredSongs.length > 0) {
      const currentIndex = filteredSongs.findIndex(song => song.songId === selectedSongId);
      if (currentIndex >= 0) {
        // Load audio for current and next songs
        loadSurroundingAudio(currentIndex);
        
        // Auto-play current song preview after a short delay
        setTimeout(() => {
          const audio = loadedAudio.get(selectedSongId);
          if (audio && !isAudioPlaying && (!currentAudio || currentAudio.paused)) {
            playCurrentAudio();
          }
        }, 300);
      }
    }
  }, [selectedSongId, loadedAudio]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause();
      }
      
      // Cleanup all loaded audio
      loadedAudio.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      setLoadedAudio(new Map());
    };
  }, []);

  const handleSongSelect = (song: SongWithLevels) => {
    // Pause current audio before switching
    pauseCurrentAudio();
    
    setSelectedSongId(song.songId);
    // Auto-select first level
    if (song.levels.length > 0) {
      setSelectedLevel(song.levels[0]);
    }
  };

  const handleLevelSelect = (levelId: number) => {
    if (selectedSong) {
      const level = selectedSong.levels.find(l => l.levelId === levelId);
      if (level) {
        setSelectedLevel(level);
        // Navigate to play page with selected level
        console.log('Starting level:', level);
      }
    }
  };

  const handleToggleFavorite = async (levelId: number) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ levelId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.favorited) {
          setUserFavorites(prev => [...prev, levelId]);
        } else {
          setUserFavorites(prev => prev.filter(id => id !== levelId));
        }
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div 
      className={styles.container}
      style={{
        background: backgroundGradient,
        transition: 'background 1s ease-in-out'
      }}
    >
      {isLoading ? (
        <ThemeProvider theme={loadingTheme}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              zIndex: 9999
            }}
          >
            <Fade in={isLoading} timeout={500}>
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(139, 90, 150, 0.2)',
                  borderRadius: 4,
                  p: 5,
                  minWidth: 400,
                  maxWidth: 500,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  textAlign: 'center'
                }}
              >
                <Stack spacing={4} alignItems="center">
                  {/* Logo/Title */}
                  <Typography 
                    variant="h3" 
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #8b5a96 30%, #beb7df 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(139, 90, 150, 0.3)',
                      mb: 1
                    }}
                  >
                    OctaChop
                  </Typography>

                  {/* Animated Progress Circle */}
                  <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                      size={100}
                      thickness={4}
                      sx={{
                        color: '#8b5a96',
                        filter: 'drop-shadow(0 0 15px rgba(139, 90, 150, 0.6))',
                        animation: 'spin 2s linear infinite'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2rem'
                      }}
                    >
                      ♪
                    </Box>
                  </Box>

                  {/* Loading Message */}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 300,
                      letterSpacing: 1
                    }}
                  >
                    Loading your musical journey
                  </Typography>

                  {/* Progress Bar */}
                  <LinearProgress
                    sx={{
                      width: '100%',
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #8b5a96, #beb7df)',
                        boxShadow: '0 0 20px rgba(139, 90, 150, 0.8)'
                      }
                    }}
                  />

                  {/* Content Preview Skeletons */}
                  <Stack spacing={2} sx={{ width: '100%', mt: 2 }}>
                    {/* Player Info Skeleton */}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Skeleton 
                        variant="circular" 
                        width={50} 
                        height={50}
                        sx={{ 
                          bgcolor: 'rgba(139, 90, 150, 0.2)',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                      />
                      <Stack spacing={1} sx={{ flex: 1 }}>
                        <Skeleton 
                          variant="text" 
                          width="70%" 
                          height={24}
                          sx={{ bgcolor: 'rgba(139, 90, 150, 0.2)' }}
                        />
                        <Skeleton 
                          variant="text" 
                          width="50%" 
                          height={20}
                          sx={{ bgcolor: 'rgba(139, 90, 150, 0.15)' }}
                        />
                      </Stack>
                    </Stack>

                    {/* Song Preview Skeleton */}
                    <Skeleton 
                      variant="rectangular" 
                      width="100%" 
                      height={120}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: 'rgba(139, 90, 150, 0.1)',
                        animation: 'pulse 1.8s ease-in-out infinite'
                      }}
                    />

                    {/* Level Buttons Skeleton */}
                    <Stack direction="row" spacing={1} justifyContent="center">
                      {[1, 2, 3].map((i) => (
                        <Skeleton 
                          key={i}
                          variant="rectangular" 
                          width={70} 
                          height={35}
                          sx={{ 
                            borderRadius: 1,
                            bgcolor: 'rgba(139, 90, 150, 0.2)',
                            animation: `pulse ${1.2 + i * 0.2}s ease-in-out infinite`
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  {/* Loading Steps */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontStyle: 'italic',
                      mt: 2
                    }}
                  >
                    Preparing songs, levels, and your progress...
                  </Typography>
                </Stack>
              </Card>
            </Fade>
          </Box>
        </ThemeProvider>
      ) : (
        <>
          {/* Player Info - Top Left Corner */}
          <div className={styles.playerInfo}>
            <PlayerInfoComponent 
              player={player}
              isLoading={false}
            />
          </div>

          {/* Filter Bar - Top Right */}
          <div className={styles.filterBar}>
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              songCount={filteredSongs.length}
              totalSongs={songs.length}
            />
          </div>

      {/* Song Artwork - Left Side Large Display */}
      <div 
        className={styles.songArtwork} 
        onClick={() => {
          if (currentAudio && !currentAudio.paused) {
            pauseCurrentAudio();
          } else {
            playCurrentAudio();
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {selectedSong?.defaultImg ? (
          <img 
            src={selectedSong.defaultImg} 
            alt={`${selectedSong.title} background`}
            className={styles.backgroundImage}
          />
        ) : (
          <img 
            src={`/res/songs/${defaultSongImg}`} 
            alt={`${selectedSong?.title || 'Default'} background`}
            className={styles.backgroundImage}
          />
        )}
        {selectedSong && (
          <div className={styles.songOverlay}>
            <h2>{selectedSong.title}</h2>
            <p>{selectedSong.artist}</p>
            {selectedLevel && (
              <div className={styles.selectedLevelInfo}>
                <span>★{selectedLevel.difficulty}</span>
                <span>AR {selectedLevel.approachRate}</span>
                {/* Audio loading indicator */}
                {selectedSongId && audioLoadingQueue.has(selectedSongId) && (
                  <span style={{ color: '#8B7FD6', fontSize: '0.8rem', marginLeft: '8px' }}>
                    🎵 Loading...
                  </span>
                )}
                {selectedSongId && loadedAudio.has(selectedSongId) && !audioLoadingQueue.has(selectedSongId) && (
                  <span style={{ color: '#4CAF50', fontSize: '0.8rem', marginLeft: '8px' }}>
                    {isAudioPlaying ? '🎵 Playing' : '🎵 Click to play'}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scores List - Bottom Left */}
      <div className={styles.scoresList}>
        <ScoresList
          scores={scores}
          isLoading={isLoading}
          selectedSong={selectedSong}
        />
      </div>

      {/* Song Wheel - Right Side */}
      <div className={styles.songWheel}>
        <SongWheel
          songs={filteredSongs}
          selectedSongId={selectedSongId}
          onSongSelect={handleSongSelect}
          onLevelSelect={handleLevelSelect}
          onToggleFavorite={handleToggleFavorite}
          userFavorites={userFavorites}
          loading={isLoading}
        />
      </div>

      {/* Bottom Tray */}
      <div className={styles.bottomTray}>
        <div className={styles.backButton}>
          <GoBack />
        </div>
        <div className={styles.sketch}></div>
        <div className={styles.playButton}>
          <GoPlay />
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default SelectPage;