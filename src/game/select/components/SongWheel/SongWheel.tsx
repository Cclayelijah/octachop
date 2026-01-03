import React, { useState, useEffect, useCallback } from 'react';
import { SongWithLevels } from '../../../../shared/types';
import styles from './SongWheel.module.css';

interface SongWheelProps {
  songs: SongWithLevels[];
  selectedSongId: number | null;
  selectedLevelId?: number | null;
  onSongSelect: (song: SongWithLevels) => void;
  onLevelSelect: (levelId: number) => void;
  onToggleFavorite?: (levelId: number) => void;
  userFavorites?: number[];
  loading?: boolean;
}

const SongWheel: React.FC<SongWheelProps> = ({
  songs,
  selectedSongId,
  selectedLevelId,
  onSongSelect,
  onLevelSelect,
  onToggleFavorite,
  userFavorites = [],
  loading = false
}) => {
  const [hoveredSongId, setHoveredSongId] = useState<number | null>(null);
  
  const selectedSong = songs.find(song => song.songId === selectedSongId);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!songs.length) return;
    
    const currentIndex = selectedSongId 
      ? songs.findIndex(song => song.songId === selectedSongId)
      : 0;
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSong && selectedSong.levels.length > 0) {
          onLevelSelect(selectedSong.levels[0].levelId);
        }
        break;
      default:
        return;
    }
    
    if (newIndex !== currentIndex) {
      onSongSelect(songs[newIndex]);
    }
  }, [songs, selectedSongId, selectedSong, onSongSelect, onLevelSelect]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.loadingSkeleton} />
          ))}
        </div>
      </div>
    );
  }
  
  if (!songs.length) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>No songs found</p>
          <p>Try adjusting your filters</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.songList}>
        {songs.map((song, index) => {
          const isSelected = song.songId === selectedSongId;
          const isHovered = song.songId === hoveredSongId;
          
          // Calculate difficulty range
          const difficulties = song.levels.map(level => level.difficulty);
          const minDiff = Math.min(...difficulties);
          const maxDiff = Math.max(...difficulties);
          const difficultyRange = minDiff === maxDiff ? `★${minDiff}` : `★${minDiff}-${maxDiff}`;

          return (
            <div
              key={song.songId}
              className={`${styles.songItem} ${isSelected ? styles.selected : ''} ${isHovered ? styles.hovered : ''}`}
              onClick={() => onSongSelect(song)}
              onMouseEnter={() => setHoveredSongId(song.songId)}
              onMouseLeave={() => setHoveredSongId(null)}
              tabIndex={0}
            >
              <div className={styles.songInfo}>
                <div className={styles.songTitle}>{song.title}</div>
                <div className={styles.songArtist}>{song.artist}</div>
                <div className={styles.songDetails}>
                  <span className={styles.difficulty}>{difficultyRange}</span>
                  <span className={styles.levels}>{song.levels.length} level{song.levels.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              {/* Level selector for selected song */}
              {isSelected && song.levels.length > 0 && (
                <div className={styles.levelSelector}>
                  {song.levels.map(level => {
                    const isFavorited = userFavorites?.includes(level.levelId) || false;
                    const isActiveLevel = selectedLevelId === level.levelId;
                    const difficultyRounded = Math.round(parseFloat(level.difficulty.toString()) * 100) / 100;
                    
                    return (
                      <div key={level.levelId} className={styles.levelButtonContainer}>
                        <button
                          className={`${styles.levelButton} ${isActiveLevel ? styles.activeLevel : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onLevelSelect(level.levelId);
                          }}
                          title={`Difficulty: ★${difficultyRounded}`}
                        >
                          <span className={styles.levelStars}>★{difficultyRounded}</span>
                        </button>
                        
                        {/* Heart icon for level favorites */}
                        {onToggleFavorite && (
                          <button
                            className={styles.levelFavoriteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(level.levelId);
                            }}
                            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                          >
                            <span className={`${styles.levelHeartIcon} ${isFavorited ? styles.favorited : ''} ${isActiveLevel ? styles.activeLevel : ''}`}>
                              ♥
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongWheel;