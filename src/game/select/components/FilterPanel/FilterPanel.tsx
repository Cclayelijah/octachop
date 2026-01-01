import React, { useState, useRef, useEffect } from 'react';
import { FilterState } from '../../../../shared/types';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  songCount: number;
  totalSongs: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  songCount,
  totalSongs
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchText: e.target.value
    });
  };

  const handleDifficultyChange = (type: 'min' | 'max', value: number) => {
    const newDifficulty = {
      ...filters.difficulty,
      [type]: value
    };
    
    // Ensure min doesn't exceed max
    if (type === 'min' && value > filters.difficulty.max) {
      newDifficulty.max = value;
    }
    if (type === 'max' && value < filters.difficulty.min) {
      newDifficulty.min = value;
    }
    
    onFiltersChange({
      ...filters,
      difficulty: newDifficulty
    });
  };

  const handleDurationChange = (type: 'min' | 'max', value: number) => {
    const newDuration = {
      ...filters.duration,
      [type]: value
    };
    
    // Ensure min doesn't exceed max
    if (type === 'min' && value > filters.duration.max) {
      newDuration.max = value;
    }
    if (type === 'max' && value < filters.duration.min) {
      newDuration.min = value;
    }
    
    onFiltersChange({
      ...filters,
      duration: newDuration
    });
  };

  const toggleFavoritesOnly = () => {
    onFiltersChange({
      ...filters,
      showFavoritesOnly: !filters.showFavoritesOnly
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchText: '',
      difficulty: { min: 1, max: 10 },
      duration: { min: 0, max: 600 },
      showFavoritesOnly: false,
    });
  };

  const hasActiveFilters = filters.searchText.length > 0 || 
    filters.difficulty.min > 1 || 
    filters.difficulty.max < 10 || 
    filters.duration.min > 0 || 
    filters.duration.max < 600 ||
    filters.showFavoritesOnly;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search with Ctrl+F or F3
      if ((e.ctrlKey && e.key === 'f') || e.key === 'F3') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // Clear search with Escape when search is focused
      if (e.key === 'Escape' && isSearchFocused) {
        if (filters.searchText) {
          onFiltersChange({ ...filters, searchText: '' });
        } else {
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters, isSearchFocused, onFiltersChange]);

  return (
    <div className={styles.container}>
      <div className={styles.mainFilters}>
        {/* Search bar */}
        <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ''}`}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search songs..."
            value={filters.searchText}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>🔍</div>
        </div>

        {/* Quick filters */}
        <div className={styles.quickFilters}>
          <button
            onClick={toggleFavoritesOnly}
            className={`${styles.quickFilter} ${filters.showFavoritesOnly ? styles.active : ''}`}
            title="Show favorites only"
          >
            ⭐ Favorites
          </button>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`${styles.quickFilter} ${showAdvancedFilters ? styles.active : ''}`}
            title="Show advanced filters"
          >
            ⚙️ Advanced
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className={`${styles.quickFilter} ${styles.clear}`}
              title="Clear all filters"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvancedFilters && (
        <div className={styles.advancedFilters}>
          {/* Difficulty range */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Difficulty Range</label>
            <div className={styles.rangeSliders}>
              <div className={styles.rangeInput}>
                <label>Min: ★{filters.difficulty.min}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={filters.difficulty.min}
                  onChange={(e) => handleDifficultyChange('min', parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.rangeInput}>
                <label>Max: ★{filters.difficulty.max}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={filters.difficulty.max}
                  onChange={(e) => handleDifficultyChange('max', parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
          </div>

          {/* Duration range */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Duration Range</label>
            <div className={styles.rangeSliders}>
              <div className={styles.rangeInput}>
                <label>Min: {Math.floor(filters.duration.min / 60)}:{(filters.duration.min % 60).toString().padStart(2, '0')}</label>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="15"
                  value={filters.duration.min}
                  onChange={(e) => handleDurationChange('min', parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>
              <div className={styles.rangeInput}>
                <label>Max: {Math.floor(filters.duration.max / 60)}:{(filters.duration.max % 60).toString().padStart(2, '0')}</label>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="15"
                  value={filters.duration.max}
                  onChange={(e) => handleDurationChange('max', parseInt(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results counter */}
      <div className={styles.resultsCounter}>
        Showing {songCount} of {totalSongs} songs
        {hasActiveFilters && (
          <span className={styles.filteredIndicator}>
            (filtered)
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;