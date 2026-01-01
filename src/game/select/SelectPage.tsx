/**
 * Main Song Selection Page
 * Beautiful, responsive layout matching the design mockup
 */

import React, { useState } from 'react';
import styles from './SelectPage.module.css';
import { PlayerInfo as PlayerInfoComponent, SongDisplay } from './components';
import { SongWithLevels, PlayerInfo as PlayerInfoType } from '../../shared/types';

// Mock data for demo purposes - replace with actual API calls
const mockPlayer: PlayerInfoType = {
  userId: 1,
  userTypeName: "Player",
  totalPlayTime: 1200,
  exp: 5500,
  username: "TestPlayer",
  rank: 15,
  rankTitle: "Rising Star",
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockSong: SongWithLevels = {
  songId: 1,
  songTitle: "Example Song",
  songArtist: "Test Artist",
  audioFileName: "example.mp3",
  backgroundFileName: "default-bg.jpg",
  createdAt: new Date(),
  updatedAt: new Date(),
  levels: [],
  maxDifficulty: 4.5,
  minDifficulty: 2.1,
  duration: 180,
  isFavorite: false
};

const SelectPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongWithLevels | null>(mockSong);
  const [player] = useState<PlayerInfoType>(mockPlayer);

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
        <div className={styles.placeholder}>
          <p>Search and filter controls</p>
        </div>
      </div>

      {/* Song Artwork - Left Side Large Display */}
      <div className={styles.songArtwork}>
        {selectedSong?.backgroundFileName ? (
          <img 
            src={`/res/images/${selectedSong.backgroundFileName}`} 
            alt={`${selectedSong.songTitle} background`}
          />
        ) : (
          <div className={styles.placeholder}>
            <p>Song Background Image</p>
          </div>
        )}
      </div>

      {/* Scores List - Bottom Left */}
      <div className={styles.scoresList}>
        <div className={styles.placeholder}>
          <h3>Recent Scores</h3>
          <p>A • 00137462837 • 97%</p>
          <p>January 21, 2023, 4:19 PM, UTC-6</p>
        </div>
      </div>

      {/* Song Wheel - Right Side */}
      <div className={styles.songWheel}>
        {/* Current Song Card - Purple Center Card */}
        <div className={styles.currentSongCard}>
          <h2>{selectedSong?.songTitle || "Big Black"}</h2>
          <p>{selectedSong?.songArtist || "The Quick Brown Fox"}</p>
          
          <div className={styles.songDuration}>01:24</div>
          
          <div className={styles.difficultyLevels}>
            <div className={styles.difficultyLevel}>
              <div className={styles.difficultyStars}>
                <span>★★★★</span>
              </div>
              <div className={styles.difficultyNumber}>3.96</div>
            </div>
            <div className={styles.difficultyLevel}>
              <div className={styles.difficultyStars}>
                <span>★★★★★</span>
              </div>
              <div className={styles.difficultyNumber}>4.99</div>
            </div>
            <div className={styles.difficultyLevel}>
              <div className={styles.difficultyStars}>
                <span>★★★★★★</span>
              </div>
              <div className={styles.difficultyNumber}>6.06</div>
            </div>
          </div>
        </div>

        {/* Other song items would go above and below */}
        <div className={styles.placeholder}>
          <p>Other songs in wheel...</p>
        </div>
      </div>

      {/* Back Arrow - Bottom Left Corner */}
      <div className={styles.backArrow}>
        <span>‹‹‹</span>
      </div>
    </div>
  );
};

export default SelectPage;