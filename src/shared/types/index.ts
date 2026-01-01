/**
 * TypeScript interfaces matching the actual Prisma schema
 */

import { LetterGrade } from '../utils/grading';

// Base Prisma model types (matching actual schema)
export interface User {
  userId: number;
  userTypeName: string;
  totalPlayTime: number;
  exp: number;
  pp: number;
}

export interface Auth {
  authId: number;
  userId: number;
  email: string;
  password: string;
  phone: string;
  userName: string;
}

export interface Song {
  songId: number;
  beatmapSetId: number;
  songUrl: string;
  defaultImg: string;
  title: string;
  titleUnicode: string;
  artist: string;
  artistUnicode: string;
  active: boolean;
}

export interface Level {
  levelId: number;
  songId: number;
  beatmapId: number;
  difficulty: number; // Decimal from Prisma
  image: string;
  approachRate: number; // Decimal from Prisma
  noteData: any[]; // Json[] from Prisma
  breakData: any[]; // Json[] from Prisma
  beatmapUrl: string;
  active: boolean;
}

export interface PassResult {
  passResultId: number;
  userId: number;
  levelId: number;
  timestamp: number;
  score: number;
  hits: number;
  misses: number;
  healthBarData: number;
  replayData: number;
}

// Enhanced types with computed properties and relationships
export interface SongWithLevels extends Song {
  levels: Level[];
  isFavorite?: boolean;
  maxDifficulty: number;
  minDifficulty: number;
  duration?: number; // in seconds, calculated from audio
}

export interface LevelWithSong extends Level {
  song: Song;
}

export interface PassResultWithDetails extends PassResult {
  level: LevelWithSong;
  user: User;
  accuracy: number; // computed: hits / (hits + misses)
  grade: LetterGrade;
  formattedDate: string;
}

export interface PlayerInfo extends User {
  username: string; // from Auth table
  rank?: number;
  rankTitle?: string;
  recentScores?: PassResultWithDetails[];
}

export interface ScoreWithDetails extends PassResultWithDetails {
  rank?: number; // position in leaderboard
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