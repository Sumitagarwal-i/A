import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface UsageData {
  briefCount: number
  lastReset: string // ISO date string
}

const USAGE_STORAGE_KEY = 'pitchintel_usage'
const MAX_FREE_BRIEFS = 1
const RESET_INTERVAL_DAYS = 30 // Reset usage every 30 days

export function useUsageLimit() {
  const { user } = useAuth()
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load usage data from localStorage
  useEffect(() => {
    if (user) {
      // Logged-in users have no limits
      setUsageData(null)
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(USAGE_STORAGE_KEY)
      if (stored) {
        const data: UsageData = JSON.parse(stored)
        
        // Check if we need to reset the usage (monthly reset)
        const lastReset = new Date(data.lastReset)
        const now = new Date()
        const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
        
        if (daysSinceReset >= RESET_INTERVAL_DAYS) {
          // Reset usage
          const resetData: UsageData = {
            briefCount: 0,
            lastReset: now.toISOString()
          }
          localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(resetData))
          setUsageData(resetData)
        } else {
          setUsageData(data)
        }
      } else {
        // First time user
        const initialData: UsageData = {
          briefCount: 0,
          lastReset: new Date().toISOString()
        }
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(initialData))
        setUsageData(initialData)
      }
    } catch (error) {
      console.error('Error loading usage data:', error)
      // Fallback to no usage
      setUsageData({ briefCount: 0, lastReset: new Date().toISOString() })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Check if user can create a brief
  const canCreateBrief = () => {
    if (user) return true // Logged-in users have no limits
    if (!usageData) return false
    return usageData.briefCount < MAX_FREE_BRIEFS
  }

  // Increment usage count
  const incrementUsage = () => {
    if (user) return // Don't track usage for logged-in users
    
    if (!usageData) return
    
    const newData: UsageData = {
      ...usageData,
      briefCount: usageData.briefCount + 1
    }
    
    try {
      localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newData))
      setUsageData(newData)
    } catch (error) {
      console.error('Error saving usage data:', error)
    }
  }

  // Get remaining free briefs
  const getRemainingBriefs = () => {
    if (user) return Infinity // Unlimited for logged-in users
    if (!usageData) return 0
    return Math.max(0, MAX_FREE_BRIEFS - usageData.briefCount)
  }

  // Get usage percentage
  const getUsagePercentage = () => {
    if (user) return 0 // No usage for logged-in users
    if (!usageData) return 100
    return (usageData.briefCount / MAX_FREE_BRIEFS) * 100
  }

  // Get days until reset
  const getDaysUntilReset = () => {
    if (user) return 0 // No reset for logged-in users
    if (!usageData) return RESET_INTERVAL_DAYS
    
    const lastReset = new Date(usageData.lastReset)
    const now = new Date()
    const daysSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(0, RESET_INTERVAL_DAYS - daysSinceReset)
  }

  return {
    isLoading,
    canCreateBrief: canCreateBrief(),
    incrementUsage,
    getRemainingBriefs: getRemainingBriefs(),
    getUsagePercentage: getUsagePercentage(),
    getDaysUntilReset: getDaysUntilReset(),
    isLoggedIn: !!user,
    maxFreeBriefs: MAX_FREE_BRIEFS
  }
} 