/**
 * SongDisplay Component - Song artwork with border, shadow, and info
 */

import React from 'react';
import styles from './SongDisplay.module.css';
import { SongDisplayProps } from '../../../../shared/types';
import { formatDuration } from '../../../../shared/utils/formatting';
import DifficultyStars from '../DifficultyStars/DifficultyStars';

export const SongDisplay: React.FC<SongDisplayProps> = ({ song, selectedLevel }) => {
  if (!song) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderText}>Select a song</div>
        </div>
      </div>
    );
  }

  const backgroundImage = song.defaultImg 
    ? song.defaultImg  // Use full Supabase URL directly
    : '/res/songs/pizza.png';

  return (
    <div className={styles.container}>
      <div className={styles.artworkContainer}>
        <img 
          src={backgroundImage}
          alt={`${song.title} artwork`}
          className={styles.artwork}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-bg.jpg';
          }}
        />
        <div className={styles.overlay}>
          <div className={styles.duration}>
            {song.duration ? formatDuration(song.duration) : '0:00'}
          </div>
        </div>
      </div>
      
      <div className={styles.songInfo}>
        <h2 className={styles.title}>{song.title}</h2>
        <p className={styles.artist}>{song.artist}</p>
        
        {selectedLevel && (
          <div className={styles.levelInfo}>
            <DifficultyStars
              difficulty={selectedLevel.difficulty}
              size="md"
              showNumber={true}
            />
            <span className={styles.levelName}>Level {selectedLevel.levelId}</span>
          </div>
        )}
        
        <div className={styles.difficultyRange}>
          <span className={styles.difficultyLabel}>Difficulties:</span>
          <span className={styles.difficultyValues}>
            {song.minDifficulty.toFixed(2)} - {song.maxDifficulty.toFixed(2)}★
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongDisplay;