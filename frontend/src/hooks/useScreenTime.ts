import { useState, useEffect, useRef } from 'react'
import { api } from '@/services/api'

interface ScreenTimeStats {
  todayMinutes: number
  goalMinutes: number
  weeklyAverage: number
}

export const useScreenTime = (goal: number = 30) => {
  const [elapsed, setElapsed] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [showBreakReminder, setShowBreakReminder] = useState(false)
  const [stats, setStats] = useState<ScreenTimeStats>({
    todayMinutes: 0,
    goalMinutes: goal,
    weeklyAverage: 0
  })
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden)
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const newElapsed = prev + 1
          // Show break reminder after 25 minutes (for testing, use 1 minute)
          if (newElapsed === 25) { // Change to 1500 for production
            setShowBreakReminder(true)
          }
          return newElapsed
        })
      }, 60000) // Update every minute
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive])

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await api.get('/api/screen/stats')
      // Map snake_case from backend to camelCase for frontend
      setStats({
        todayMinutes: res.data.today_minutes ?? 0,
        goalMinutes: res.data.goal_minutes ?? goal,
        weeklyAverage: res.data.weekly_average ?? 0
      })
    } catch (error) {
      console.error('Failed to fetch screen stats', error)
    }
  }

  // Log session on unmount or when user leaves
  useEffect(() => {
    const logSession = async () => {
      if (elapsed > 0) {
        try {
          await api.post('/api/screen/session', {
            total_minutes: elapsed,
            date: new Date().toISOString().split('T')[0]
          })
          console.log(`Logged ${elapsed} minutes`)
        } catch (error) {
          console.error('Failed to log session', error)
        }
      }
    }

    return () => {
      logSession()
    }
  }, [elapsed])

  // Initialize stats
  useEffect(() => {
    fetchStats()
  }, [])

  const dismissReminder = () => setShowBreakReminder(false)

  return {
    elapsed,
    showBreakReminder,
    dismissReminder,
    stats,
    refreshStats: fetchStats
  }
}