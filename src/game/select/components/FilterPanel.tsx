import React from 'react';
import { FilterState } from '../../../shared/types';
import styles from './FilterPanel.module.css';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  songCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  songCount
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchText: e.target.value
    });
  };

  const toggleFavoritesOnly = () => {
    onFiltersChange({
      ...filters,
      showFavoritesOnly: !filters.showFavoritesOnly
    });
  };

  return (
    <div style={{ 
      width: '100%',
      display: 'flex', 
      gap: '16px', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={filters.searchText}
          onChange={handleSearchChange}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)',
            background: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
          className={styles.searchInput}
        />
        <button
          onClick={toggleFavoritesOnly}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)',
            background: filters.showFavoritesOnly ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
        >
          <span style={{ 
            color: filters.showFavoritesOnly ? 'white' : 'rgba(255, 255, 255, 0.3)',
            textShadow: filters.showFavoritesOnly ? '0 0 8px rgba(255, 255, 255, 0.6)' : 'none'
          }}>
            ♥
          </span> Favorites
        </button>
      </div>
      <div style={{ 
        color: 'rgba(255,255,255,0.9)', 
        fontSize: '16px',
        fontWeight: '600',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        minWidth: 'fit-content'
      }}>
        {songCount} Songs
      </div>
    </div>
  );
};

export default FilterPanel;