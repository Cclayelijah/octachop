/**
 * Rhythm game grading system utilities
 */

export type LetterGrade = 'SS' | 'S' | 'A' | 'B' | 'C' | 'D';

/**
 * Calculate letter grade based on accuracy percentage
 */
export const calculateGrade = (accuracy: number): LetterGrade => {
  if (accuracy >= 95) return 'SS';
  if (accuracy >= 90) return 'S';
  if (accuracy >= 80) return 'A';
  if (accuracy >= 70) return 'B';
  if (accuracy >= 60) return 'C';
  return 'D';
};

/**
 * Calculate accuracy from hits and misses
 */
export const calculateAccuracy = (hits: number, misses: number): number => {
  const total = hits + misses;
  if (total === 0) return 0;
  return Math.round((hits / total) * 100 * 100) / 100; // Round to 2 decimal places
};

/**
 * Get grade color for visual display
 */
export const getGradeColor = (grade: LetterGrade): string => {
  switch (grade) {
    case 'SS': return '#FFD700'; // Gold
    case 'S':  return '#E6E6FA'; // Lavender
    case 'A':  return '#90EE90'; // Light Green
    case 'B':  return '#87CEEB'; // Sky Blue
    case 'C':  return '#DDA0DD'; // Plum
    case 'D':  return '#F0E68C'; // Khaki
    default:   return '#CCCCCC'; // Gray
  }
};

/**
 * Calculate score from game performance
 */
export const calculateScore = (hits: number, maxCombo: number, accuracy: number): number => {
  const baseScore = hits * 300; // Base points per hit
  const comboBonus = Math.floor(maxCombo / 10) * 100; // Combo multiplier
  const accuracyBonus = Math.floor(accuracy * 10); // Accuracy bonus
  
  return baseScore + comboBonus + accuracyBonus;
};