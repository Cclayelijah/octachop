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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Panel from '../Panel'
import PageHeading from '../PageHeading'
import { BodyContainer } from '../styles'

interface User {
  userId: number
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  username: string
  imageUrl: string | null
  userTypeName: string
  bannedUntil: string | null
  totalPlayTime: number
  exp: number
  pp: number
  createdAt: string
  updatedAt: string
  rank: number
  userType: {
    userTypeName: string
    userTypeDesc: string
  }
}

interface UsersResponse {
  users: User[]
  totalUsers: number
  currentUser: {
    userId: number
    userTypeName: string
    isSuperAdmin: boolean
  }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    user: User | null
    type: 'ban' | 'role' | null
  }>({ open: false, user: null, type: null })
  const [banDate, setBanDate] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [updating, setUpdating] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search term
    if (!searchTerm) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toString() === searchTerm ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data: UsersResponse = await response.json()
        setUsers(data.users)
        setCurrentUser(data.currentUser)
      } else {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        showAlert('error', `Failed to fetch users: ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      showAlert('error', 'Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const handleEditUser = (user: User, type: 'ban' | 'role') => {
    setEditDialog({ open: true, user, type })
    if (type === 'ban') {
      setBanDate(user.bannedUntil ? user.bannedUntil.split('T')[0] : '')
    } else {
      setSelectedRole(user.userTypeName)
    }
  }

  const handleCloseDialog = () => {
    setEditDialog({ open: false, user: null, type: null })
    setBanDate('')
    setSelectedRole('')
  }

  const handleUpdateUser = async () => {
    if (!editDialog.user) return

    setUpdating(true)
    try {
      const updateData: any = { userId: editDialog.user.userId }
      
      if (editDialog.type === 'ban') {
        updateData.bannedUntil = banDate ? new Date(banDate + 'T23:59:59').toISOString() : null
      } else if (editDialog.type === 'role') {
        updateData.userTypeName = selectedRole
      }

      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        showAlert('success', `User ${editDialog.type === 'ban' ? 'ban status' : 'role'} updated successfully`)
        fetchUsers() // Refresh users list
        handleCloseDialog()
      } else {
        const error = await response.json()
        showAlert('error', error.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      showAlert('error', 'Error updating user')
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getUserStatusChip = (user: User) => {
    if (user.bannedUntil && new Date(user.bannedUntil) > new Date()) {
      return <Chip label="Banned" color="error" size="small" />
    }
    return <Chip label="Active" color="success" size="small" />
  }

  const getRoleChip = (role: string) => {
    const colors: { [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' } = {
      'user': 'default',
      'admin': 'primary',
      'superadmin': 'error'
    }
    return <Chip label={role} color={colors[role] || 'default'} size="small" />
  }

  if (loading) {
    return (
      <Box display="flex" bgcolor="#ffffff" color="#000000">
        <Panel />
        <BodyContainer>
          <PageHeading title="Users" />
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
        <PageHeading title="Users" />
        
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 3 }} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        )}

        {/* Search Bar */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by username, email, or user ID..."
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
          Showing {filteredUsers.length} of {users.length} users
        </Typography>

        {/* Users Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PP</TableCell>
                <TableCell>Play Time</TableCell>
                <TableCell>Date Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>#{user.rank}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {user.imageUrl && (
                        <img 
                          src={user.imageUrl} 
                          alt={user.username} 
                          style={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {user.username}
                        </Typography>
                        {user.firstName && user.lastName && (
                          <Typography variant="caption" color="text.secondary">
                            {user.firstName} {user.lastName}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.userTypeName)}</TableCell>
                  <TableCell>{getUserStatusChip(user)}</TableCell>
                  <TableCell>{user.pp.toLocaleString()}</TableCell>
                  <TableCell>{formatPlayTime(user.totalPlayTime)}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {/* Ban/Unban Button */}
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user, 'ban')}
                        color={user.bannedUntil && new Date(user.bannedUntil) > new Date() ? 'success' : 'error'}
                        title={user.bannedUntil && new Date(user.bannedUntil) > new Date() ? 'Unban user' : 'Ban user'}
                      >
                        {user.bannedUntil && new Date(user.bannedUntil) > new Date() ? <CheckCircleIcon /> : <BlockIcon />}
                      </IconButton>
                      
                      {/* Edit Role Button (only for superadmins) */}
                      {currentUser?.isSuperAdmin && (
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user, 'role')}
                          color="primary"
                          title="Edit user role"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editDialog.type === 'ban' ? 'Manage Ban Status' : 'Change User Role'}
          </DialogTitle>
          <DialogContent>
            {editDialog.user && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Editing: {editDialog.user.username} ({editDialog.user.email})
                </Typography>
                
                {editDialog.type === 'ban' ? (
                  <TextField
                    fullWidth
                    type="date"
                    label="Ban Until (leave empty to unban)"
                    value={banDate}
                    onChange={(e) => setBanDate(e.target.value)}
                    sx={{ mt: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="Select a date when the ban should expire. Leave empty to remove ban."
                  />
                ) : (
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>User Role</InputLabel>
                    <Select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      label="User Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="superadmin">Super Admin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleUpdateUser} 
              variant="contained" 
              disabled={updating}
              startIcon={updating ? <CircularProgress size={16} /> : null}
            >
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </BodyContainer>
    </Box>
  )
}
