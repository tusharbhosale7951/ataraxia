import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Moon, Sun, AlertCircle, CheckCircle2, Coffee } from 'lucide-react'
import { api } from '@/services/api'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface SleepData {
  debt_hours: number
  avg_hours: number
  recommended: number
  feedback: string
  stability_score: number
}

export const SleepWidget = () => {
  const [sleepData, setSleepData] = useState<SleepData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSleepData()
  }, [])

  const fetchSleepData = async () => {
    try {
      const response = await api.get('/api/sleep/debt')
      setSleepData(response.data)
    } catch (error) {
      console.error('Failed to fetch sleep data', error)
      toast.error('Could not load sleep insights')
    } finally {
      setLoading(false)
    }
  }

  const getDebtColor = (debt: number) => {
    if (debt <= 0) return 'text-emerald-400'
    if (debt <= 1) return 'text-amber-400'
    return 'text-rose-400'
  }

  const getDebtIcon = (debt: number) => {
    if (debt <= 0) return <CheckCircle2 className="h-5 w-5 text-emerald-400" />
    if (debt <= 1) return <AlertCircle className="h-5 w-5 text-amber-400" />
    return <Coffee className="h-5 w-5 text-rose-400" />
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="py-8">
          <div className="animate-pulse flex items-center justify-center">
            <Moon className="h-8 w-8 text-sage-400 animate-bounce" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!sleepData) {
    return (
      <Card className="glass-card">
        <CardContent className="py-6 text-center text-gray-400">
          No sleep data available
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden">
        <div className="h-2 bg-linear-to-r from-indigo-500 to-purple-500" /> {/* Fixed */}
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-400" />
            Sleep Hygiene •
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Debt Card */}
          <div className="bg-white/5 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getDebtIcon(sleepData.debt_hours)}
              <span className={`text-3xl font-light ${getDebtColor(sleepData.debt_hours)}`}>
                {sleepData.debt_hours > 0 ? '+' : ''}{sleepData.debt_hours}h
              </span>
            </div>
            <p className="text-sm text-gray-400">Sleep Debt</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Sun className="h-5 w-5 text-amber-400 mx-auto mb-1" />
              <p className="text-2xl font-light">{sleepData.avg_hours}h</p>
              <p className="text-xs text-gray-400">Average</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <Moon className="h-5 w-5 text-indigo-400 mx-auto mb-1" />
              <p className="text-2xl font-light">{sleepData.recommended}h</p>
              <p className="text-xs text-gray-400">Goal</p>
            </div>
          </div>

          {/* Stability Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sleep Stability</span>
              <span className="text-white">{sleepData.stability_score}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-indigo-400 to-purple-400"
                animate={{ width: `${sleepData.stability_score}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>

          {/* Personalized Feedback */}
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-sm text-indigo-200 italic">
              "{sleepData.feedback}"
            </p>
            <p className="text-xs text-indigo-400/70 mt-2 text-right">
              — Tokyo University Sleep Research
            </p>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
              Wind-down Routine
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/5">
              Sleep Sounds
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-2">
            Based on Japanese sleep research •
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}