import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  InputAdornment,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Panel from '../Panel'
import PageHeading from '../PageHeading'
import { BodyContainer } from '../styles'

interface Song {
  songId: number
  beatmapSetId: number
  title: string
  titleUnicode: string
  artist: string
  artistUnicode: string
  songUrl: string
  defaultImg: string
  active: boolean
  disabledOn: string | null
  levelCount: number
  status: 'active' | 'disabled'
}

interface SongsResponse {
  songs: Song[]
  totalSongs: number
  currentUser: {
    userId: number
    userTypeName: string
  }
}

export default function AdminSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    song: Song | null
    action: 'disable' | 'enable' | null
  }>({ open: false, song: null, action: null })
  const [updating, setUpdating] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchSongs()
  }, [])

  useEffect(() => {
    // Filter songs based on search term (client-side for instant feedback)
    if (!searchTerm) {
      setFilteredSongs(songs)
    } else {
      const filtered = songs.filter(song => {
        const lowerSearch = searchTerm.toLowerCase()
        return (
          song.title?.toLowerCase().includes(lowerSearch) ||
          song.artist?.toLowerCase().includes(lowerSearch) ||
          song.titleUnicode?.toLowerCase().includes(lowerSearch) ||
          song.artistUnicode?.toLowerCase().includes(lowerSearch) ||
          song.songId.toString() === searchTerm
        )
      })
      setFilteredSongs(filtered)
    }
  }, [searchTerm, songs])

  const fetchSongs = async (search?: string) => {
    try {
      const url = search ? `/api/admin/songs?search=${encodeURIComponent(search)}` : '/api/admin/songs'
      const response = await fetch(url)
      
      if (response.ok) {
        const data: SongsResponse = await response.json()
        setSongs(data.songs)
        setCurrentUser(data.currentUser)
      } else {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        showAlert('error', `Failed to fetch songs: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
      showAlert('error', 'Error fetching songs')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleToggleSong = (song: Song, action: 'disable' | 'enable') => {
    setConfirmDialog({ open: true, song, action })
  }

  const handleCloseDialog = () => {
    setConfirmDialog({ open: false, song: null, action: null })
  }

  const handleConfirmToggle = async () => {
    if (!confirmDialog.song || !confirmDialog.action) return

    setUpdating(true)
    try {
      const response = await fetch('/api/admin/songs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: confirmDialog.song.songId,
          disable: confirmDialog.action === 'disable'
        })
      })

      if (response.ok) {
        const actionText = confirmDialog.action === 'disable' ? 'disabled' : 'enabled'
        showAlert('success', `Song "${confirmDialog.song.title}" has been ${actionText}`)
        fetchSongs() // Refresh songs list
        handleCloseDialog()
      } else {
        const error = await response.json()
        showAlert('error', error.error || 'Failed to update song')
      }
    } catch (error) {
      console.error('Error updating song:', error)
      showAlert('error', 'Error updating song')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusChip = (song: Song) => {
    if (song.status === 'disabled') {
      return <Chip label="Disabled" color="error" size="small" />
    }
    return <Chip label="Active" color="success" size="small" />
  }

  if (loading) {
    return (
      <Box display="flex" bgcolor="#ffffff" color="#000000">
        <Panel />
        <BodyContainer>
          <PageHeading title="Songs" addButtonLink="/admin/songs/add" />
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </BodyContainer>
      </Box>
    )
  }

  return (
    <Box display="flex" bgcolor="#ffffff" color="#000000">
      <Panel />
      <BodyContainer>
        <PageHeading title="Songs" addButtonLink="/admin/songs/add" />
        
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by song ID, title, or artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Typography variant="body1" sx={{ mb: 2 }}>
          Showing {filteredSongs.length} of {songs.length} songs
        </Typography>

        {/* Songs Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Artist</TableCell>
                <TableCell>Levels</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Disabled On</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSongs.map((song) => (
                <TableRow key={song.songId}>
                  <TableCell>{song.songId}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <img 
                        src={song.defaultImg} 
                        alt={song.title} 
                        style={{ width: 40, height: 40, borderRadius: '4px' }}
                        onError={(e) => {
                          e.currentTarget.src = '/images/logo.png' // fallback image
                        }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {song.title}
                        </Typography>
                        {song.titleUnicode && song.titleUnicode !== song.title && (
                          <Typography variant="caption" color="text.secondary">
                            {song.titleUnicode}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {song.artist}
                    </Typography>
                    {song.artistUnicode && song.artistUnicode !== song.artist && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {song.artistUnicode}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{song.levelCount}</TableCell>
                  <TableCell>{getStatusChip(song)}</TableCell>
                  <TableCell>{formatDate(song.disabledOn)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleSong(song, song.status === 'active' ? 'disable' : 'enable')}
                      color={song.status === 'active' ? 'error' : 'success'}
                      title={song.status === 'active' ? 'Disable song' : 'Enable song'}
                    >
                      {song.status === 'active' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {confirmDialog.action === 'disable' ? 'Disable Song' : 'Enable Song'}
          </DialogTitle>
          <DialogContent>
            {confirmDialog.song && (
              <Typography variant="body1">
                Are you sure you want to {confirmDialog.action} &quot;{confirmDialog.song.title}&quot; by {confirmDialog.song.artist}?
                {confirmDialog.action === 'disable' && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="warning.main">
                      ⚠️ Disabling this song will make it unavailable to players.
                    </Typography>
                  </Box>
                )}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleConfirmToggle} 
              variant="contained" 
              color={confirmDialog.action === 'disable' ? 'error' : 'success'}
              disabled={updating}
              startIcon={updating ? <CircularProgress size={16} /> : null}
            >
              {updating ? 'Updating...' : confirmDialog.action === 'disable' ? 'Disable' : 'Enable'}
            </Button>
          </DialogActions>
        </Dialog>
      </BodyContainer>
    </Box>
  )
}
