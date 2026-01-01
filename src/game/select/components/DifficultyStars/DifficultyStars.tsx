import React from 'react';
import styles from './DifficultyStars.module.css';

interface DifficultyStarsProps {
  difficulty: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

const DifficultyStars: React.FC<DifficultyStarsProps> = ({
  difficulty,
  maxStars = 5,
  size = 'md',
  showNumber = false
}) => {
  const stars = [];
  const fullStars = Math.floor(difficulty);
  const hasHalfStar = difficulty % 1 >= 0.5;

  // Create full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span 
        key={`full-${i}`} 
        className={`${styles.star} ${styles[size]} ${styles.full}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }

  // Add half star if needed
  if (hasHalfStar && fullStars < maxStars) {
    stars.push(
      <span 
        key="half" 
        className={`${styles.star} ${styles[size]} ${styles.half}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  }

  // Fill remaining with empty stars
  const remainingStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(
      <span 
        key={`empty-${i}`} 
        className={`${styles.star} ${styles[size]} ${styles.empty}`}
        aria-hidden="true"
      >
        ☆
      </span>
    );
  }

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div 
        className={styles.stars}
        role="img"
        aria-label={`Difficulty: ${difficulty} out of ${maxStars} stars`}
      >
        {stars}
      </div>
      {showNumber && (
        <span className={styles.number}>
          {difficulty.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default DifficultyStars;