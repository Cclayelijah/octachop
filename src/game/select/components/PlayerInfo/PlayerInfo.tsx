/**
 * PlayerInfo Component - Display username and rank
 */

import React from 'react';
import styles from './PlayerInfo.module.css';
import { PlayerInfoProps } from '../../../../shared/types';

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonSubtext}></div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <span className={styles.username}>Guest User</span>
          <span className={styles.rank}>Unranked</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.playerInfo}>
        <h1 className={styles.username}>{player.username}</h1>
        <span className={styles.rankNumber}>Rank #{player.rank || '---'}</span>
      </div>
    </div>
  );
};

export default PlayerInfo;