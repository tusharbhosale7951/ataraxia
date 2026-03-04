import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPeriodOverview } from '@/services/insights'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export const WeeklyInsightCard = () => {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchInsight = async () => {
    setLoading(true)
    try {
      const data = await getPeriodOverview('week')
      setInsight(data.insight)
    } catch (err) {
      setInsight('Could not load insight. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsight()
  }, [])

  return (
    <Card className="glass-card border-none bg-linear-to-br from-white/5 to-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sage-400" />
          <span className="font-serif">Seren's Insight</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchInsight}
          disabled={loading}
          className="text-white hover:bg-white/20"
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-300">
            <div className="w-4 h-4 border-2 border-sage-400 border-t-transparent rounded-full animate-spin" />
            <p>Generating your insight...</p>
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-200 leading-relaxed italic border-l-4 border-sage-400/50 pl-4"
          >
            {insight}
          </motion.p>
        )}
      </CardContent>
    </Card>
  )
}