/**
 * Main Song Selection Page
 * Beautiful, responsive layout matching the design mockup
 */

import React, { useState, useEffect } from 'react';
import styles from './SelectPage.module.css';
import { PlayerInfo as PlayerInfoComponent } from './components';
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

// Mock data for demo purposes - replace with actual API calls
const mockPlayer: PlayerInfoType = {
  userId: 1,
  userTypeName: "Player",
  totalPlayTime: 1200,
  exp: 5500,
  pp: 1250,
  username: "TestPlayer",
  rank: 15,
  rankTitle: "Rising Star",
};

const mockSongs: SongWithLevels[] = [
  {
    songId: 1,
    beatmapSetId: 101,
    songUrl: "example.mp3",
    defaultImg: "default-bg.jpg",
    title: "Big Black",
    titleUnicode: "Big Black",
    artist: "The Quick Brown Fox",
    artistUnicode: "The Quick Brown Fox",
    active: true,
    levels: [
      {
        levelId: 1,
        songId: 1,
        beatmapId: 201,
        difficulty: 3.96,
        image: "level1.jpg",
        approachRate: 9,
        noteData: [],
        breakData: [],
        beatmapUrl: "level1.osu",
        active: true
      },
      {
        levelId: 2,
        songId: 1,
        beatmapId: 202,
        difficulty: 4.99,
        image: "level2.jpg",
        approachRate: 9.5,
        noteData: [],
        breakData: [],
        beatmapUrl: "level2.osu",
        active: true
      }
    ],
    maxDifficulty: 4.99,
    minDifficulty: 3.96,
    duration: 84,
    isFavorite: false
  },
  {
    songId: 2,
    beatmapSetId: 102,
    songUrl: "example2.mp3",
    defaultImg: "default-bg2.jpg",
    title: "Freedom Dive",
    titleUnicode: "Freedom Dive",
    artist: "xi",
    artistUnicode: "xi",
    active: true,
    levels: [
      {
        levelId: 3,
        songId: 2,
        beatmapId: 203,
        difficulty: 6.83,
        image: "level3.jpg",
        approachRate: 10,
        noteData: [],
        breakData: [],
        beatmapUrl: "level3.osu",
        active: true
      }
    ],
    maxDifficulty: 6.83,
    minDifficulty: 6.83,
    duration: 268,
    isFavorite: true
  }
];

const mockScores: PassResultWithDetails[] = [
  {
    passResultId: 1,
    userId: 1,
    levelId: 1,
    timestamp: Date.now() - 86400000, // 1 day ago
    score: 987654321,
    hits: 1234,
    misses: 56,
    healthBarData: 0,
    replayData: 0,
    level: {
      levelId: 1,
      songId: 1,
      beatmapId: 201,
      difficulty: 3.96,
      image: "level1.jpg",
      approachRate: 9,
      noteData: [],
      breakData: [],
      beatmapUrl: "level1.osu",
      active: true,
      song: mockSongs[0]
    },
    user: mockPlayer,
    accuracy: 95.65,
    grade: 'A' as any,
    formattedDate: 'Jan 21, 2023'
  }
];

const SelectPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(1);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [player] = useState<PlayerInfoType>(mockPlayer);
  const [songs] = useState<SongWithLevels[]>(mockSongs);
  const [filteredSongs, setFilteredSongs] = useState<SongWithLevels[]>(mockSongs);
  const [scores] = useState<PassResultWithDetails[]>(mockScores);
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    difficulty: { min: 1, max: 10 },
    duration: { min: 0, max: 600 },
    showFavoritesOnly: false,
  });

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

  const handleSongSelect = (song: SongWithLevels) => {
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
      {/* Player Info - Top Left Corner */}
      <div className={styles.playerInfo}>
        <PlayerInfoComponent 
          player={player}
          isLoading={isLoading}
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
      <div className={styles.songArtwork}>
        {selectedSong?.defaultImg ? (
          <img 
            src={`/res/images/${selectedSong.defaultImg}`} 
            alt={`${selectedSong.title} background`}
            className={styles.backgroundImage}
          />
        ) : (
          <div className={styles.placeholder}>
            <p>Song Background Image</p>
          </div>
        )}
        {selectedSong && (
          <div className={styles.songOverlay}>
            <h2>{selectedSong.title}</h2>
            <p>{selectedSong.artist}</p>
            {selectedLevel && (
              <div className={styles.selectedLevelInfo}>
                <span>★{selectedLevel.difficulty}</span>
                <span>AR {selectedLevel.approachRate}</span>
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

      {/* Back Arrow - Bottom Left Corner */}
      <div className={styles.backArrow}>
        <button
          onClick={() => window.history.back()}
          title="Go back"
        >
          ‹‹‹
        </button>
      </div>
    </div>
  );
};

export default SelectPage;