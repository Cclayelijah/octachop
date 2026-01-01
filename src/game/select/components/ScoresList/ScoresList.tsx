import React from 'react';
import { PassResultWithDetails } from '../../../../shared/types';
import { calculateGrade, calculateAccuracy } from '../../../../shared/utils/grading';
import { formatDuration } from '../../../../shared/utils/formatting';
import styles from './ScoresList.module.css';

interface ScoresListProps {
  scores: PassResultWithDetails[];
  isLoading?: boolean;
  selectedSong?: any;
}

const ScoresList: React.FC<ScoresListProps> = ({ 
  scores, 
  isLoading = false,
  selectedSong 
}) => {
  // Calculate accuracy and format scores
  const formattedScores = scores.map(score => {
    const accuracy = calculateAccuracy(score.hits, score.misses);
    return {
      ...score,
      accuracy,
      grade: calculateGrade(accuracy),
      formattedDate: new Date(score.timestamp * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric', 
        year: 'numeric'
      })
    };
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Recent Scores</h3>
        <div className={styles.loading}>
          <div className={styles.loadingSkeleton}></div>
          <div className={styles.loadingSkeleton}></div>
          <div className={styles.loadingSkeleton}></div>
        </div>
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Recent Scores</h3>
        <div className={styles.empty}>
          <p>No scores yet</p>
          <p>Play this song to see your results here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Scores</h3>
      <div className={styles.scoresList}>
        {formattedScores.slice(0, 5).map((score) => (
          <div key={score.passResultId} className={styles.scoreItem}>
            <div className={styles.scoreHeader}>
              <span className={`${styles.grade} ${styles[`grade${score.grade}`]}`}>
                {score.grade}
              </span>
              <span className={styles.scoreNumber}>
                {score.score.toLocaleString()}
              </span>
              <span className={styles.accuracy}>
                {score.accuracy}%
              </span>
            </div>
            <div className={styles.scoreDetails}>
              <span className={styles.date}>
                {score.formattedDate}
              </span>
              <span className={styles.stats}>
                {score.hits} hits • {score.misses} misses
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoresList;