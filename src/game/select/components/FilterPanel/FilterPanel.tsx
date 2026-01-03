import React, { useState } from 'react';import React, { useState } from 'react';import React, { useState, useRef, useEffect } from 'react';import React, { useState, useRef, useEffect } from 'react';import React, { useState, useRef, useEffect } from 'react';

import { FilterState } from '../../../../shared/types';

import {import { FilterState } from '../../../../shared/types';

  Box,

  TextField,import {import { FilterState } from '../../../../shared/types';

  Button,

  Typography,  Box,

  Card,

  Stack,  TextField,import {import { FilterState } from '../../../../shared/types';import { FilterState } from '../../../../shared/types';

  IconButton,

  InputAdornment,  Button,

  Collapse

} from '@mui/material';  Typography,  Box,

import {

  Search as SearchIcon,  Card,

  Favorite as HeartIcon,

  FavoriteBorder as HeartOutlineIcon,  Stack,  TextField,import {import {

  FilterList as FilterIcon,

  Clear as ClearIcon,  IconButton,

  ExpandMore as ExpandMoreIcon

} from '@mui/icons-material';  InputAdornment,  Button,



interface FilterPanelProps {  Collapse

  filters: FilterState;

  onFiltersChange: (filters: FilterState) => void;} from '@mui/material';  Typography,  Box,  Box,

  songCount: number;

  totalSongs: number;import {

}

  Search as SearchIcon,  Card,

const FilterPanel: React.FC<FilterPanelProps> = ({

  filters,  Favorite as HeartIcon,

  onFiltersChange,

  songCount,  FavoriteBorder as HeartOutlineIcon,  Stack,  TextField,  TextField,

  totalSongs

}) => {  FilterList as FilterIcon,

  const [showAdvanced, setShowAdvanced] = useState(false);

  Clear as ClearIcon,  IconButton,

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    onFiltersChange({  ExpandMore as ExpandMoreIcon

      ...filters,

      searchText: e.target.value} from '@mui/icons-material';  InputAdornment  Button,  Button,

    });

  };



  const toggleFavoritesOnly = () => {interface FilterPanelProps {} from '@mui/material';

    onFiltersChange({

      ...filters,  filters: FilterState;

      showFavoritesOnly: !filters.showFavoritesOnly

    });  onFiltersChange: (filters: FilterState) => void;import {  Slider,  Slider,

  };

  songCount: number;

  const clearAllFilters = () => {

    onFiltersChange({  totalSongs: number;  Search as SearchIcon,

      searchText: '',

      difficulty: { min: 0, max: 10000 },}

      duration: { min: 0, max: 600 },

      showFavoritesOnly: false,  Favorite as HeartIcon,  Typography,  Typography,

    });

  };const FilterPanel: React.FC<FilterPanelProps> = ({



  const hasActiveFilters = filters.searchText.length > 0 ||   filters,  FavoriteBorder as HeartOutlineIcon,

    filters.showFavoritesOnly;

  onFiltersChange,

  return (

    <Box sx={{ position: 'relative', width: '100%', zIndex: 1000 }}>  songCount,  FilterList as FilterIcon,  Card,  Card,

      <Card

        sx={{  totalSongs

          background: 'rgba(139, 90, 150, 0.9)',

          border: '1px solid rgba(139, 90, 150, 0.3)',}) => {  Clear as ClearIcon

          borderRadius: '12px',

          p: 2,  const [showAdvanced, setShowAdvanced] = useState(false);

          backdropFilter: 'blur(10px)',

          boxShadow: '0 8px 32px rgba(139, 90, 150, 0.3)',} from '@mui/icons-material';  Stack,  Stack,

        }}

      >  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        <Stack direction="row" spacing={2} alignItems="center">

          <TextField    onFiltersChange({

            placeholder="Search songs or artists..."

            value={filters.searchText}      ...filters,

            onChange={handleSearchChange}

            size="small"      searchText: e.target.valueinterface FilterPanelProps {  IconButton,  IconButton,

            sx={{

              flex: 1,    });

              '& .MuiOutlinedInput-root': {

                backgroundColor: 'rgba(255, 255, 255, 0.1)',  };  filters: FilterState;

                color: 'white',

                '& fieldset': {

                  borderColor: 'rgba(255, 255, 255, 0.3)',

                },  const toggleFavoritesOnly = () => {  onFiltersChange: (filters: FilterState) => void;  Chip,  Chip,

                '&:hover fieldset': {

                  borderColor: 'rgba(255, 255, 255, 0.5)',    onFiltersChange({

                },

                '&.Mui-focused fieldset': {      ...filters,  songCount: number;

                  borderColor: 'rgba(255, 255, 255, 0.7)',

                },      showFavoritesOnly: !filters.showFavoritesOnly

              },

              '& .MuiInputBase-input::placeholder': {    });  totalSongs: number;  Collapse,  Collapse,

                color: 'rgba(255, 255, 255, 0.7)',

              },  };

            }}

            InputProps={{}

              startAdornment: (

                <InputAdornment position="start">  const clearAllFilters = () => {

                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />

                </InputAdornment>    onFiltersChange({  InputAdornment,  InputAdornment,

              ),

              endAdornment: filters.searchText && (      searchText: '',

                <InputAdornment position="end">

                  <IconButton      difficulty: { min: 0, max: 10000 },const FilterPanel: React.FC<FilterPanelProps> = ({

                    size="small"

                    onClick={() => onFiltersChange({ ...filters, searchText: '' })}      duration: { min: 0, max: 600 },

                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}

                  >      showFavoritesOnly: false,  filters,  Divider  Divider

                    <ClearIcon fontSize="small" />

                  </IconButton>    });

                </InputAdornment>

              ),  };  onFiltersChange,

            }}

          />



          <Button  const hasActiveFilters = filters.searchText.length > 0 ||   songCount,} from '@mui/material';} from '@mui/material';

            variant={filters.showFavoritesOnly ? "contained" : "outlined"}

            startIcon={filters.showFavoritesOnly ? <HeartIcon /> : <HeartOutlineIcon />}    filters.showFavoritesOnly;

            onClick={toggleFavoritesOnly}

            size="small"  totalSongs

            sx={{

              color: 'white',  return (

              borderColor: 'rgba(255, 255, 255, 0.3)',

              backgroundColor: filters.showFavoritesOnly ? 'rgba(255, 255, 255, 0.2)' : 'transparent',    <Box sx={{ position: 'relative', width: '100%', zIndex: 1000 }}>}) => {import {import {

              '&:hover': {

                backgroundColor: 'rgba(255, 255, 255, 0.1)',      <Card

                borderColor: 'rgba(255, 255, 255, 0.5)',

              },        sx={{  const searchInputRef = useRef<HTMLInputElement>(null);

            }}

          >          background: 'rgba(139, 90, 150, 0.9)',

            Favorites

          </Button>          border: '1px solid rgba(139, 90, 150, 0.3)',  Search as SearchIcon,  Search as SearchIcon,



          <Button          borderRadius: '12px',

            variant="outlined"

            startIcon={<FilterIcon />}          p: 2,  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

            endIcon={<ExpandMoreIcon sx={{ 

              transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',          backdropFilter: 'blur(10px)',

              transition: 'transform 0.3s'

            }} />}          boxShadow: '0 8px 32px rgba(139, 90, 150, 0.3)',    onFiltersChange({  Favorite as HeartIcon,  Favorite as HeartIcon,

            onClick={() => setShowAdvanced(!showAdvanced)}

            size="small"        }}

            sx={{

              color: 'white',      >      ...filters,

              borderColor: 'rgba(255, 255, 255, 0.3)',

              '&:hover': {        {/* Main Filter Row */}

                backgroundColor: 'rgba(255, 255, 255, 0.1)',

                borderColor: 'rgba(255, 255, 255, 0.5)',        <Stack direction="row" spacing={2} alignItems="center">      searchText: e.target.value  FavoriteBorder as HeartOutlineIcon,  FavoriteBorder as HeartOutlineIcon,

              },

            }}          <TextField

          >

            Advanced            placeholder="Search songs or artists..."    });

          </Button>

            value={filters.searchText}

          {hasActiveFilters && (

            <IconButton            onChange={handleSearchChange}  };  FilterList as FilterIcon,  FilterList as FilterIcon,

              onClick={clearAllFilters}

              size="small"            size="small"

              sx={{ 

                color: 'rgba(255, 255, 255, 0.7)',            sx={{

                '&:hover': {

                  backgroundColor: 'rgba(255, 255, 255, 0.1)',              flex: 1,

                },

              }}              '& .MuiOutlinedInput-root': {  const toggleFavoritesOnly = () => {  Clear as ClearIcon,  Clear as ClearIcon,

            >

              <ClearIcon />                backgroundColor: 'rgba(255, 255, 255, 0.1)',

            </IconButton>

          )}                color: 'white',    onFiltersChange({

        </Stack>

                '& fieldset': {

        <Box sx={{ mt: 1 }}>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>                  borderColor: 'rgba(255, 255, 255, 0.3)',      ...filters,  ExpandMore as ExpandMoreIcon,  ExpandMore as ExpandMoreIcon,

            Showing {songCount} of {totalSongs} songs

          </Typography>                },

        </Box>

                '&:hover fieldset': {      showFavoritesOnly: !filters.showFavoritesOnly

        <Collapse in={showAdvanced}>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>                  borderColor: 'rgba(255, 255, 255, 0.5)',

            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>

              Advanced filters coming soon...                },    });  ExpandLess as ExpandLessIcon  ExpandLess as ExpandLessIcon

            </Typography>

          </Box>                '&.Mui-focused fieldset': {

        </Collapse>

      </Card>                  borderColor: 'rgba(255, 255, 255, 0.7)',  };

    </Box>

  );                },

};

              },} from '@mui/icons-material';} from '@mui/icons-material';

export default FilterPanel;
              '& .MuiInputBase-input::placeholder': {

                color: 'rgba(255, 255, 255, 0.7)',  const clearAllFilters = () => {

              },

            }}    onFiltersChange({

            InputProps={{

              startAdornment: (      searchText: '',

                <InputAdornment position="start">

                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />      difficulty: { min: 0, max: 10000 },interface FilterPanelProps {interface FilterPanelProps {

                </InputAdornment>

              ),      duration: { min: 0, max: 600 },

              endAdornment: filters.searchText && (

                <InputAdornment position="end">      showFavoritesOnly: false,  filters: FilterState;  filters: FilterState;

                  <IconButton

                    size="small"    });

                    onClick={() => onFiltersChange({ ...filters, searchText: '' })}

                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}  };  onFiltersChange: (filters: FilterState) => void;  onFiltersChange: (filters: FilterState) => void;

                  >

                    <ClearIcon fontSize="small" />

                  </IconButton>

                </InputAdornment>  const hasActiveFilters = filters.searchText.length > 0 ||   songCount: number;  songCount: number;

              ),

            }}    filters.showFavoritesOnly;

          />

  totalSongs: number;  totalSongs: number;

          <Button

            variant={filters.showFavoritesOnly ? "contained" : "outlined"}  return (

            startIcon={filters.showFavoritesOnly ? <HeartIcon /> : <HeartOutlineIcon />}

            onClick={toggleFavoritesOnly}    <Box sx={{ position: 'relative', width: '100%' }}>}}

            size="small"

            sx={{      <Card

              color: 'white',

              borderColor: 'rgba(255, 255, 255, 0.3)',        sx={{

              backgroundColor: filters.showFavoritesOnly ? 'rgba(255, 255, 255, 0.2)' : 'transparent',

              '&:hover': {          background: 'rgba(139, 90, 150, 0.9)',

                backgroundColor: 'rgba(255, 255, 255, 0.1)',

                borderColor: 'rgba(255, 255, 255, 0.5)',          border: '1px solid rgba(139, 90, 150, 0.3)',const FilterPanel: React.FC<FilterPanelProps> = ({const FilterPanel: React.FC<FilterPanelProps> = ({

              },

            }}          borderRadius: '0 0 12px 12px',

          >

            Favorites          p: 2,  filters,  filters,

          </Button>

          backdropFilter: 'blur(10px)',

          <Button

            variant="outlined"          boxShadow: '0 8px 32px rgba(139, 90, 150, 0.3)',  onFiltersChange,  onFiltersChange,

            startIcon={<FilterIcon />}

            endIcon={<ExpandMoreIcon sx={{         }}

              transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',

              transition: 'transform 0.3s'      >  songCount,  songCount,

            }} />}

            onClick={() => setShowAdvanced(!showAdvanced)}        <Stack direction="row" spacing={2} alignItems="center">

            size="small"

            sx={{          <TextField  totalSongs  totalSongs

              color: 'white',

              borderColor: 'rgba(255, 255, 255, 0.3)',            ref={searchInputRef}

              '&:hover': {

                backgroundColor: 'rgba(255, 255, 255, 0.1)',            placeholder="Search songs or artists..."}) => {}) => {

                borderColor: 'rgba(255, 255, 255, 0.5)',

              },            value={filters.searchText}

            }}

          >            onChange={handleSearchChange}  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

            Advanced

          </Button>            size="small"



          {hasActiveFilters && (            sx={{  const searchInputRef = useRef<HTMLInputElement>(null);  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

            <IconButton

              onClick={clearAllFilters}              flex: 1,

              size="small"

              sx={{               '& .MuiOutlinedInput-root': {  const searchInputRef = useRef<HTMLInputElement>(null);

                color: 'rgba(255, 255, 255, 0.7)',

                '&:hover': {                backgroundColor: 'rgba(255, 255, 255, 0.1)',

                  backgroundColor: 'rgba(255, 255, 255, 0.1)',

                },                color: 'white',  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

              }}

            >                '& fieldset': {

              <ClearIcon />

            </IconButton>                  borderColor: 'rgba(255, 255, 255, 0.3)',    onFiltersChange({  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {

          )}

        </Stack>                },



        {/* Song Count */}                '&:hover fieldset': {      ...filters,    onFiltersChange({

        <Box sx={{ mt: 1 }}>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>                  borderColor: 'rgba(255, 255, 255, 0.5)',

            Showing {songCount} of {totalSongs} songs

          </Typography>                },      searchText: e.target.value      ...filters,

        </Box>

                '&.Mui-focused fieldset': {

        {/* Advanced Filters - Collapsible */}

        <Collapse in={showAdvanced}>                  borderColor: 'rgba(255, 255, 255, 0.7)',    });      searchText: e.target.value

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>

            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1 }}>                },

              Advanced filters coming soon...

            </Typography>              },  };    });

          </Box>

        </Collapse>              '& .MuiInputBase-input::placeholder': {

      </Card>

    </Box>                color: 'rgba(255, 255, 255, 0.7)',  };

  );

};              },



export default FilterPanel;            }}  const handleDifficultyChange = (_: Event, value: number | number[]) => {

            InputProps={{

              startAdornment: (    const [min, max] = value as number[];  const handleDifficultyChange = (_: Event, value: number | number[]) => {

                <InputAdornment position="start">

                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />    onFiltersChange({    const [min, max] = value as number[];

                </InputAdornment>

              ),      ...filters,    onFiltersChange({

              endAdornment: filters.searchText && (

                <InputAdornment position="end">      difficulty: { min, max }      ...filters,

                  <IconButton

                    size="small"    });      difficulty: { min, max }

                    onClick={() => onFiltersChange({ ...filters, searchText: '' })}

                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}  };    });

                  >

                    <ClearIcon fontSize="small" />  };

                  </IconButton>

                </InputAdornment>  const handleDurationChange = (_: Event, value: number | number[]) => {

              ),

            }}    const [min, max] = value as number[];  const handleDurationChange = (_: Event, value: number | number[]) => {

          />

    onFiltersChange({    const [min, max] = value as number[];

          <Button

            variant={filters.showFavoritesOnly ? "contained" : "outlined"}      ...filters,    onFiltersChange({

            startIcon={filters.showFavoritesOnly ? <HeartIcon /> : <HeartOutlineIcon />}

            onClick={toggleFavoritesOnly}      duration: { min, max }      ...filters,

            size="small"

            sx={{    });      duration: { min, max }

              color: 'white',

              borderColor: 'rgba(255, 255, 255, 0.3)',  };    });

              backgroundColor: filters.showFavoritesOnly ? 'rgba(255, 255, 255, 0.2)' : 'transparent',

              '&:hover': {  };

                backgroundColor: 'rgba(255, 255, 255, 0.1)',

                borderColor: 'rgba(255, 255, 255, 0.5)',  const toggleFavoritesOnly = () => {

              },

            }}    onFiltersChange({  const toggleFavoritesOnly = () => {

          >

            Favorites      ...filters,    onFiltersChange({

          </Button>

      showFavoritesOnly: !filters.showFavoritesOnly      ...filters,

          {hasActiveFilters && (

            <IconButton    });      showFavoritesOnly: !filters.showFavoritesOnly

              onClick={clearAllFilters}

              size="small"  };    });

              sx={{ 

                color: 'rgba(255, 255, 255, 0.7)',  };

                '&:hover': {

                  backgroundColor: 'rgba(255, 255, 255, 0.1)',  const clearAllFilters = () => {

                },

              }}    onFiltersChange({  const clearAllFilters = () => {

            >

              <ClearIcon />      searchText: '',    onFiltersChange({

            </IconButton>

          )}      difficulty: { min: 0, max: 10000 },      searchText: '',

        </Stack>

      duration: { min: 0, max: 600 },      difficulty: { min: 0, max: 10000 },

        <Box sx={{ mt: 1 }}>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>      showFavoritesOnly: false,      duration: { min: 0, max: 600 },

            Showing {songCount} of {totalSongs} songs

          </Typography>    });      showFavoritesOnly: false,

        </Box>

      </Card>  };    });

    </Box>

  );  };

};

  const hasActiveFilters = filters.searchText.length > 0 || 

export default FilterPanel;
    filters.difficulty.min > 0 ||   const hasActiveFilters = filters.searchText.length > 0 || 

    filters.difficulty.max < 10000 ||     filters.difficulty.min > 0 || 

    filters.duration.min > 0 ||     filters.difficulty.max < 10000 || 

    filters.duration.max < 600 ||    filters.duration.min > 0 || 

    filters.showFavoritesOnly;    filters.duration.max < 600 ||

    filters.showFavoritesOnly;

  const toggleAdvancedFilters = () => {

    setShowAdvancedFilters(!showAdvancedFilters);  const toggleAdvancedFilters = (event: React.MouseEvent<HTMLButtonElement>) => {

  };    setAnchorEl(event.currentTarget);

    setShowAdvancedFilters(!showAdvancedFilters);

  // Handle keyboard shortcuts  };

  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {  // Handle keyboard shortcuts

      // Focus search with Ctrl+F or F3  useEffect(() => {

      if ((e.ctrlKey && e.key === 'f') || e.key === 'F3') {    const handleKeyDown = (e: KeyboardEvent) => {

        e.preventDefault();      // Focus search with Ctrl+F or F3

        searchInputRef.current?.focus();      if ((e.ctrlKey && e.key === 'f') || e.key === 'F3') {

      }        e.preventDefault();

              searchInputRef.current?.focus();

      // Clear filters with Escape      }

      if (e.key === 'Escape' && hasActiveFilters) {      

        clearAllFilters();      // Clear filters with Escape

      }      if (e.key === 'Escape' && hasActiveFilters) {

    };        clearAllFilters();

      }

    window.addEventListener('keydown', handleKeyDown);    };

    return () => window.removeEventListener('keydown', handleKeyDown);

  }, [hasActiveFilters]);    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);

  return (  }, [hasActiveFilters]);

    <Box sx={{ position: 'relative', width: '100%' }}>

      {/* Main Filter Bar */}  return (

      <Card    <Box sx={{ position: 'relative', width: '100%' }}>

        sx={{      {/* Main Filter Bar */}

          background: 'rgba(139, 90, 150, 0.9)',      <Card

          border: '1px solid rgba(139, 90, 150, 0.3)',        sx={{

          borderRadius: '0 0 12px 12px',          background: 'rgba(139, 90, 150, 0.9)',

          p: 2,          border: '1px solid rgba(139, 90, 150, 0.3)',

          backdropFilter: 'blur(10px)',          borderRadius: '0 0 12px 12px',

          boxShadow: '0 8px 32px rgba(139, 90, 150, 0.3)',          p: 2,

        }}          backdropFilter: 'blur(10px)',

      >          boxShadow: '0 8px 32px rgba(139, 90, 150, 0.3)',

        <Stack direction="row" spacing={2} alignItems="center">        }}

          {/* Search Input */}      >

          <TextField        <Stack direction="row" spacing={2} alignItems="center">

            ref={searchInputRef}          {/* Search Input */}

            placeholder="Search songs or artists..."          <TextField

            value={filters.searchText}            ref={searchInputRef}

            onChange={handleSearchChange}            placeholder="Search songs or artists..."

            size="small"            value={filters.searchText}

            sx={{            onChange={handleSearchChange}

              flex: 1,            size="small"

              '& .MuiOutlinedInput-root': {            sx={{

                backgroundColor: 'rgba(255, 255, 255, 0.1)',              flex: 1,

                color: 'white',              '& .MuiOutlinedInput-root': {

                '& fieldset': {                backgroundColor: 'rgba(255, 255, 255, 0.1)',

                  borderColor: 'rgba(255, 255, 255, 0.3)',                color: 'white',

                },                '& fieldset': {

                '&:hover fieldset': {                  borderColor: 'rgba(255, 255, 255, 0.3)',

                  borderColor: 'rgba(255, 255, 255, 0.5)',                },

                },                '&:hover fieldset': {

                '&.Mui-focused fieldset': {                  borderColor: 'rgba(255, 255, 255, 0.5)',

                  borderColor: 'rgba(255, 255, 255, 0.7)',                },

                },                '&.Mui-focused fieldset': {

              },                  borderColor: 'rgba(255, 255, 255, 0.7)',

              '& .MuiInputBase-input::placeholder': {                },

                color: 'rgba(255, 255, 255, 0.7)',              },

              },              '& .MuiInputBase-input::placeholder': {

            }}                color: 'rgba(255, 255, 255, 0.7)',

            InputProps={{              },

              startAdornment: (            }}

                <InputAdornment position="start">            InputProps={{

                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />              startAdornment: (

                </InputAdornment>                <InputAdornment position="start">

              ),                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />

              endAdornment: filters.searchText && (                </InputAdornment>

                <InputAdornment position="end">              ),

                  <IconButton              endAdornment: filters.searchText && (

                    size="small"                <InputAdornment position="end">

                    onClick={() => onFiltersChange({ ...filters, searchText: '' })}                  <IconButton

                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}                    size="small"

                  >                    onClick={() => onFiltersChange({ ...filters, searchText: '' })}

                    <ClearIcon fontSize="small" />                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}

                  </IconButton>                  >

                </InputAdornment>                    <ClearIcon fontSize="small" />

              ),                  </IconButton>

            }}                </InputAdornment>

          />              ),

            }}

          {/* Favorites Toggle */}          />

          <Button

            variant={filters.showFavoritesOnly ? "contained" : "outlined"}          {/* Favorites Toggle */}

            startIcon={filters.showFavoritesOnly ? <HeartIcon /> : <HeartOutlineIcon />}          <Button

            onClick={toggleFavoritesOnly}            variant={filters.showFavoritesOnly ? "contained" : "outlined"}

            size="small"            startIcon={filters.showFavoritesOnly ? <HeartIcon /> : <HeartOutlineIcon />}

            sx={{            onClick={toggleFavoritesOnly}

              color: 'white',            size="small"

              borderColor: 'rgba(255, 255, 255, 0.3)',            sx={{

              backgroundColor: filters.showFavoritesOnly ? 'rgba(255, 255, 255, 0.2)' : 'transparent',              color: 'white',

              '&:hover': {              borderColor: 'rgba(255, 255, 255, 0.3)',

                backgroundColor: 'rgba(255, 255, 255, 0.1)',              backgroundColor: filters.showFavoritesOnly ? 'rgba(255, 255, 255, 0.2)' : 'transparent',

                borderColor: 'rgba(255, 255, 255, 0.5)',              '&:hover': {

              },                backgroundColor: 'rgba(255, 255, 255, 0.1)',

            }}                borderColor: 'rgba(255, 255, 255, 0.5)',

          >              },

            Favorites            }}

          </Button>          >

            Favorites

          {/* Advanced Filters Toggle */}          </Button>

          <Button

            variant={showAdvancedFilters ? "contained" : "outlined"}          {/* Advanced Filters Toggle */}

            startIcon={<FilterIcon />}          <Button

            endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}            variant={showAdvancedFilters ? "contained" : "outlined"}

            onClick={toggleAdvancedFilters}            startIcon={<FilterIcon />}

            size="small"            endIcon={showAdvancedFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}

            sx={{            onClick={toggleAdvancedFilters}

              color: 'white',            size="small"

              borderColor: 'rgba(255, 255, 255, 0.3)',            sx={{

              backgroundColor: showAdvancedFilters ? 'rgba(255, 255, 255, 0.2)' : 'transparent',              color: 'white',

              '&:hover': {              borderColor: 'rgba(255, 255, 255, 0.3)',

                backgroundColor: 'rgba(255, 255, 255, 0.1)',              backgroundColor: showAdvancedFilters ? 'rgba(255, 255, 255, 0.2)' : 'transparent',

                borderColor: 'rgba(255, 255, 255, 0.5)',              '&:hover': {

              },                backgroundColor: 'rgba(255, 255, 255, 0.1)',

            }}                borderColor: 'rgba(255, 255, 255, 0.5)',

          >              },

            Advanced            }}

          </Button>          >

            Advanced

          {/* Clear Filters */}          </Button>

          {hasActiveFilters && (

            <IconButton          {/* Clear Filters */}

              onClick={clearAllFilters}          {hasActiveFilters && (

              size="small"            <IconButton

              sx={{               onClick={clearAllFilters}

                color: 'rgba(255, 255, 255, 0.7)',              size="small"

                '&:hover': {              sx={{ 

                  backgroundColor: 'rgba(255, 255, 255, 0.1)',                color: 'rgba(255, 255, 255, 0.7)',

                },                '&:hover': {

              }}                  backgroundColor: 'rgba(255, 255, 255, 0.1)',

            >                },

              <ClearIcon />              }}

            </IconButton>            >

          )}              <ClearIcon />

        </Stack>            </IconButton>

          )}

        {/* Results Counter */}        </Stack>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>        {/* Results Counter */}

            Showing {songCount} of {totalSongs} songs        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {hasActiveFilters && (          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>

              <Chip             Showing {songCount} of {totalSongs} songs

                label="filtered"             {hasActiveFilters && (

                size="small"               <Chip 

                sx={{                 label="filtered" 

                  ml: 1,                 size="small" 

                  height: 18,                sx={{ 

                  backgroundColor: 'rgba(255, 255, 255, 0.2)',                  ml: 1, 

                  color: 'white',                  height: 18,

                  fontSize: '0.7rem'                  backgroundColor: 'rgba(255, 255, 255, 0.2)',

                }}                   color: 'white',

              />                  fontSize: '0.7rem'

            )}                }} 

          </Typography>              />

        </Box>            )}

      </Card>          </Typography>

        </Box>

      {/* Advanced Filters Overlay */}      </Card>

      <Collapse in={showAdvancedFilters}>

        <Card      {/* Advanced Filters Overlay */}

          sx={{      <Collapse in={showAdvancedFilters}>

            position: 'absolute',        <Card

            top: '100%',          sx={{

            left: 0,            position: 'absolute',

            right: 0,            top: '100%',

            zIndex: 1000,            left: 0,

            mt: 1,            right: 0,

            background: 'rgba(139, 90, 150, 0.95)',            zIndex: 1000,

            border: '1px solid rgba(139, 90, 150, 0.4)',            mt: 1,

            borderRadius: 2,            background: 'rgba(139, 90, 150, 0.95)',

            p: 3,            border: '1px solid rgba(139, 90, 150, 0.4)',

            backdropFilter: 'blur(20px)',            borderRadius: 2,

            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',            p: 3,

          }}            backdropFilter: 'blur(20px)',

        >            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',

          <Stack spacing={3}>          }}

            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>        >

              Advanced Filters          <Stack spacing={3}>

            </Typography>            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>

              Advanced Filters

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />            </Typography>



            {/* Difficulty Range */}            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            <Box>

              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>            {/* Difficulty Range */}

                Difficulty Range: {filters.difficulty.min.toFixed(1)} - {filters.difficulty.max.toFixed(1)}            <Box>

              </Typography>              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>

              <Slider                Difficulty Range: {filters.difficulty.min.toFixed(1)} - {filters.difficulty.max.toFixed(1)}

                value={[filters.difficulty.min, filters.difficulty.max]}              </Typography>

                onChange={handleDifficultyChange}              <Slider

                min={0}                value={[filters.difficulty.min, filters.difficulty.max]}

                max={10000}                onChange={handleDifficultyChange}

                step={0.1}                min={0}

                valueLabelDisplay="auto"                max={10000}

                sx={{                step={0.1}

                  color: 'white',                valueLabelDisplay="auto"

                  '& .MuiSlider-thumb': {                sx={{

                    backgroundColor: 'white',                  color: 'white',

                    border: '2px solid rgba(139, 90, 150, 1)',                  '& .MuiSlider-thumb': {

                  },                    backgroundColor: 'white',

                  '& .MuiSlider-track': {                    border: '2px solid rgba(139, 90, 150, 1)',

                    backgroundColor: 'white',                  },

                  },                  '& .MuiSlider-track': {

                  '& .MuiSlider-rail': {                    backgroundColor: 'white',

                    backgroundColor: 'rgba(255, 255, 255, 0.3)',                  },

                  },                  '& .MuiSlider-rail': {

                  '& .MuiSlider-valueLabel': {                    backgroundColor: 'rgba(255, 255, 255, 0.3)',

                    backgroundColor: 'rgba(139, 90, 150, 0.9)',                  },

                  },                  '& .MuiSlider-valueLabel': {

                }}                    backgroundColor: 'rgba(139, 90, 150, 0.9)',

              />                  },

            </Box>                }}

              />

            {/* Duration Range */}            </Box>

            <Box>

              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>            {/* Duration Range */}

                Duration Range: {Math.floor(filters.duration.min / 60)}:{(filters.duration.min % 60).toString().padStart(2, '0')} - {Math.floor(filters.duration.max / 60)}:{(filters.duration.max % 60).toString().padStart(2, '0')}            <Box>

              </Typography>              <Typography variant="body2" sx={{ color: 'white', mb: 2 }}>

              <Slider                Duration Range: {Math.floor(filters.duration.min / 60)}:{(filters.duration.min % 60).toString().padStart(2, '0')} - {Math.floor(filters.duration.max / 60)}:{(filters.duration.max % 60).toString().padStart(2, '0')}

                value={[filters.duration.min, filters.duration.max]}              </Typography>

                onChange={handleDurationChange}              <Slider

                min={0}                value={[filters.duration.min, filters.duration.max]}

                max={600}                onChange={handleDurationChange}

                step={15}                min={0}

                valueLabelDisplay="auto"                max={600}

                valueLabelFormat={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}                step={15}

                sx={{                valueLabelDisplay="auto"

                  color: 'white',                valueLabelFormat={(value) => `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`}

                  '& .MuiSlider-thumb': {                sx={{

                    backgroundColor: 'white',                  color: 'white',

                    border: '2px solid rgba(139, 90, 150, 1)',                  '& .MuiSlider-thumb': {

                  },                    backgroundColor: 'white',

                  '& .MuiSlider-track': {                    border: '2px solid rgba(139, 90, 150, 1)',

                    backgroundColor: 'white',                  },

                  },                  '& .MuiSlider-track': {

                  '& .MuiSlider-rail': {                    backgroundColor: 'white',

                    backgroundColor: 'rgba(255, 255, 255, 0.3)',                  },

                  },                  '& .MuiSlider-rail': {

                  '& .MuiSlider-valueLabel': {                    backgroundColor: 'rgba(255, 255, 255, 0.3)',

                    backgroundColor: 'rgba(139, 90, 150, 0.9)',                  },

                  },                  '& .MuiSlider-valueLabel': {

                }}                    backgroundColor: 'rgba(139, 90, 150, 0.9)',

              />                  },

            </Box>                }}

              />

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />            </Box>



            {/* Actions */}            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">

              <Button            {/* Actions */}

                variant="outlined"            <Stack direction="row" spacing={2} justifyContent="flex-end">

                onClick={clearAllFilters}              <Button

                disabled={!hasActiveFilters}                variant="outlined"

                sx={{                onClick={clearAllFilters}

                  color: 'white',                disabled={!hasActiveFilters}

                  borderColor: 'rgba(255, 255, 255, 0.3)',                sx={{

                  '&:hover': {                  color: 'white',

                    backgroundColor: 'rgba(255, 255, 255, 0.1)',                  borderColor: 'rgba(255, 255, 255, 0.3)',

                    borderColor: 'rgba(255, 255, 255, 0.5)',                  '&:hover': {

                  },                    backgroundColor: 'rgba(255, 255, 255, 0.1)',

                }}                    borderColor: 'rgba(255, 255, 255, 0.5)',

              >                  },

                Clear All                }}

              </Button>              >

              <Button                Clear All

                variant="contained"              </Button>

                onClick={() => setShowAdvancedFilters(false)}              <Button

                sx={{                variant="contained"

                  backgroundColor: 'rgba(255, 255, 255, 0.2)',                onClick={() => setShowAdvancedFilters(false)}

                  color: 'white',                sx={{

                  '&:hover': {                  backgroundColor: 'rgba(255, 255, 255, 0.2)',

                    backgroundColor: 'rgba(255, 255, 255, 0.3)',                  color: 'white',

                  },                  '&:hover': {

                }}                    backgroundColor: 'rgba(255, 255, 255, 0.3)',

              >                  },

                Apply                }}

              </Button>              >

            </Stack>                Apply

          </Stack>              </Button>

        </Card>            </Stack>

      </Collapse>          </Stack>

    </Box>        </Card>

  );      </Collapse>

};    </Box>

  );

export default FilterPanel;};

export default FilterPanel;
      
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