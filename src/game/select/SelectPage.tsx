/**
 * Main Song Selection Page
 * Beautiful, responsive layout matching the design mockup
 */

import React, { useState, useEffect } from 'react';
import styles from './SelectPage.module.css';
import { PlayerInfo as PlayerInfoComponent, GoPlay } from './components';
import ScoresList from './components/ScoresList/ScoresList';
import SongWheel from './components/SongWheel/SongWheel';
import FilterPanel from './components/FilterPanel/FilterPanel';
import { 
  SongWithLevels, 
  PlayerInfo as PlayerInfoType, 
  FilterState,
  PassResultWithDetails,
  Level
} from '../../shared/types';
import GoBack from './components/GoBack';

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
    difficulty: { min: 1, max: 10 },
    duration: { min: 0, max: 600 },
    showFavoritesOnly: false,
  });
  
  // Audio loading state
  const [loadedAudio, setLoadedAudio] = useState<Map<number, HTMLAudioElement>>(new Map());
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioLoadingQueue, setAudioLoadingQueue] = useState<Set<number>>(new Set());
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      audio.currentTime = 0;
      audio.play();
      setCurrentAudio(audio);
      setIsAudioPlaying(true);
      
      // Add event listeners
      audio.addEventListener('ended', () => setIsAudioPlaying(false));
      audio.addEventListener('pause', () => setIsAudioPlaying(false));
    }
  };

  const pauseCurrentAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsAudioPlaying(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch user info, songs, and scores in parallel
        const [userResponse, songsResponse, scoresResponse] = await Promise.all([
          fetch('/api/user/me'),
          fetch('/api/song'),
          fetch('/api/user/scores')
        ]);

        // Handle user data
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setPlayer(userData.user);
        } else {
          console.error('Failed to fetch user data');
        }

        // Handle songs data
        if (songsResponse.ok) {
          const songsData = await songsResponse.json();
          const processedSongs = songsData.songs.map((song: any) => ({
            ...song,
            maxDifficulty: Math.max(...song.levels.map((l: Level) => l.difficulty)),
            minDifficulty: Math.min(...song.levels.map((l: Level) => l.difficulty)),
            isFavorite: false // TODO: Implement favorites system
          }));
          setSongs(processedSongs);
          setFilteredSongs(processedSongs);
          
          // Set first song as selected if available
          if (processedSongs.length > 0) {
            setSelectedSongId(processedSongs[0].songId);
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

      // Favorites filter
      if (filters.showFavoritesOnly && !song.isFavorite) {
        return false;
      }

      return true;
    });

    setFilteredSongs(filtered);
  }, [songs, filters]);

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
          if (audio) {
            playCurrentAudio();
          }
        }, 500);
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

  return (
    <div className={styles.container}>
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Loading songs and player data...
        </div>
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
            alt={`${selectedSong!.title} background`}
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