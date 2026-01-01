/**
 * Formatting utilities for dates, numbers, and time
 */

/**
 * Format date for score display (e.g., "January 21, 2023, 4:19 PM")
 */
export const formatScoreDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

/**
 * Format song duration in MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format large numbers with commas (e.g., 1,234,567)
 */
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

/**
 * Format accuracy percentage with proper decimals
 */
export const formatAccuracy = (accuracy: number): string => {
  return `${accuracy.toFixed(2)}%`;
};

/**
 * Format difficulty rating to one decimal place
 */
export const formatDifficulty = (difficulty: number): string => {
  return difficulty.toFixed(2);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};