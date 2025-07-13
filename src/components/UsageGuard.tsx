import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsageLimit } from '../hooks/useUsageLimit'
import { LoadingSpinner } from './LoadingSpinner'

interface UsageGuardProps {
  children: React.ReactNode
}

export function UsageGuard({ children }: UsageGuardProps) {
  const { isLoading, canCreateBrief, isLoggedIn } = useUsageLimit()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're not loading and the user can't create briefs
    if (!isLoading && !canCreateBrief && !isLoggedIn) {
      // Redirect to landing page with a query parameter to show sign-up prompt
      navigate('/?signup=true', { replace: true })
    }
  }, [isLoading, canCreateBrief, isLoggedIn, navigate])

  // Show loading spinner while checking usage
  if (isLoading) {
    return <LoadingSpinner />
  }

  // If user can't create briefs and isn't logged in, don't render children
  if (!canCreateBrief && !isLoggedIn) {
    return null
  }

  // Otherwise, render the protected content
  return <>{children}</>
} 