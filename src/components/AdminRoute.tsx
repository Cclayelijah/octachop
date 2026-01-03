import { useAuth, useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'

interface AdminRouteProps {
  children: React.ReactNode
}

interface UserWithRole {
  userId: number
  email: string
  userTypeName: string
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [userRole, setUserRole] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoaded) return
      
      if (!userId || !user) {
        setLoading(false)
        return
      }

      try {
        console.log('Checking user role for:', user.id)
        
        // Call a simplified endpoint that ensures user exists and returns role
        const response = await fetch('/api/user/role', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            imageUrl: user.imageUrl
          })
        })

        if (response.ok) {
          const userData = await response.json()
          console.log('User role data:', userData)
          setUserRole(userData)
        } else {
          const errorText = await response.text()
          console.error('Role check failed:', errorText)
          setError('Failed to verify user permissions')
        }
      } catch (error) {
        console.error('Error checking user role:', error)
        setError('Authentication error')
      } finally {
        setLoading(false)
      }
    }

    checkUserRole()
  }, [isLoaded, userId, user])

  // Loading state
  if (!isLoaded || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#00ff00' }} />
      </Box>
    )
  }

  // Not authenticated
  if (!userId) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: 6,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            Authentication Required
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, fontSize: '1.1rem' }}>
            You must be signed in to access this area.
          </Typography>
          <Box
            component="a"
            href="/sign-in"
            sx={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(45deg, #00ff00, #00cc00)',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Sign In
          </Box>
        </Box>
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: 6,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            Authentication Error
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4, fontSize: '1.1rem' }}>
            {error}
          </Typography>
        </Box>
      </Box>
    )
  }

  // Check admin permissions
  const isAdmin = userRole?.userTypeName === 'admin' || userRole?.userTypeName === 'superadmin'
  
  if (!isAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: 6,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: 500,
            width: '100%'
          }}
        >
          <Typography variant="h4" sx={{ color: '#8b4513', fontWeight: 'bold', mb: 3 }}>
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b4513', mb: 4, fontSize: '1.1rem', opacity: 0.9 }}>
            You don't have permission to access this area. Admin privileges are required.
          </Typography>
          <Typography variant="body2" sx={{ color: '#8b4513', opacity: 0.7 }}>
            Current role: {userRole?.userTypeName || 'user'}
          </Typography>
        </Box>
      </Box>
    )
  }

  // User has admin access
  return <>{children}</>
}