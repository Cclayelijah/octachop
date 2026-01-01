/**
 * TypeScript interfaces for the song selection page
 */

import { LetterGrade } from '../utils/grading';

// Base Prisma model types (matching your schema)
export interface User {
  userId: number;
  userTypeName: string;
  totalPlayTime: number;
  exp: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Auth {
  userId: number;
  username: string;
  email?: string;
}

export interface Song {
  songId: number;
  songTitle: string;
  songArtist: string;
  audioFileName: string;
  backgroundFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Level {
  levelId: number;
  songId: number;
  difficulty: number;
  beatmapFileName: string;
  levelName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PassResult {
  passResultId: number;
  userId: number;
  levelId: number;
  score: number;
  hits: number;
  misses: number;
  maxCombo: number;
  createdAt: Date;
}

// Enhanced types with computed properties
export interface SongWithLevels extends Song {
  levels: Level[];
  isFavorite?: boolean;
  maxDifficulty: number;
  minDifficulty: number;
  duration?: number; // in seconds
  previewUrl?: string;
}

export interface ScoreWithDetails extends PassResult {
  letterGrade: LetterGrade;
  accuracy: number;
  level: Level;
  rank?: number; // position in leaderboard
}

export interface PlayerInfo extends User {
  username: string;
  rank?: number;
  rankTitle?: string;
}

// Component prop interfaces
export interface FilterState {
  searchText: string;
  difficulty: {
    min: number;
    max: number;
  };
  duration: {
    min: number; // in seconds
    max: number;
  };
  showFavoritesOnly: boolean;
  selectedPlaylist?: string;
}

export interface SongWheelProps {
  songs: SongWithLevels[];
  selectedIndex: number;
  onSongSelect: (index: number) => void;
  onScroll: (direction: 'up' | 'down') => void;
}

export interface SongDisplayProps {
  song: SongWithLevels | null;
  selectedLevel?: Level | null;
}

export interface ScoresListProps {
  scores: ScoreWithDetails[];
  isLoading: boolean;
  selectedSong: SongWithLevels | null;
}

export interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  songCount: number;
  totalSongs: number;
}

export interface PlayerInfoProps {
  player: PlayerInfo | null;
  isLoading: boolean;
}

export interface DifficultyStarsProps {
  difficulty: number;
  maxStars?: number;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
}

// Hook return types
export interface UseSongSelectionReturn {
  // Data
  songs: SongWithLevels[];
  filteredSongs: SongWithLevels[];
  selectedSong: SongWithLevels | null;
  selectedLevel: Level | null;
  scores: ScoreWithDetails[];
  player: PlayerInfo | null;
  
  // State
  selectedIndex: number;
  filters: FilterState;
  isLoading: boolean;
  
  // Actions
  setSelectedIndex: (index: number) => void;
  setFilters: (filters: FilterState) => void;
  toggleFavorite: (songId: number) => Promise<void>;
  selectLevel: (level: Level) => void;
}

export interface UseKeyboardNavigationReturn {
  handleKeyPress: (event: KeyboardEvent) => void;
  isSearchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
}