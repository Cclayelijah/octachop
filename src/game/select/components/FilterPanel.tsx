import React from 'react';
import { FilterState } from '../../../shared/types';

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
      background: 'rgba(139, 90, 150, 0.9)', 
      padding: '16px', 
      borderRadius: '12px', 
      marginBottom: '16px' 
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={filters.searchText}
          onChange={handleSearchChange}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px'
          }}
        />
        <button
          onClick={toggleFavoritesOnly}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.3)',
            background: filters.showFavoritesOnly ? 'rgba(255,255,255,0.2)' : 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
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
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
        Showing {songCount} of {totalSongs} songs
      </div>
    </div>
  );
};

export default FilterPanel;