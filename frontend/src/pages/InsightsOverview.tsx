import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPeriodOverview, OverviewResponse } from '@/services/insights'
import { StackedMoodChart } from '@/components/StackedMoodChart'
import { ScreenBarChart } from '@/components/ScreenBarChart'
import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { Sparkles, Calendar, Clock, Activity, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function InsightsOverview() {
  const { period = 'week' } = useParams<{ period: string }>()
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData(period as 'week' | 'month' | 'year')
  }, [period])

  const fetchData = async (p: 'week' | 'month' | 'year') => {
    setLoading(true)
    try {
      const result = await getPeriodOverview(p)
      setData(result)
    } catch (error) {
      console.error('Failed to fetch insights', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = (value: string) => {
    navigate(`/insights/${value}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A2A1F] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xl animate-pulse">Loading insights...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#1A2A1F] text-white flex items-center justify-center">
        <p className="text-xl">No data available</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-[#1A2A1F] text-white relative"
    >
      <FloatingLeaves />
      <Sidebar />
      <div className="ml-20 p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold font-serif">Insights</h1>
          </div>
          <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/20">
            Logout
          </Button>
        </header>

        <Tabs value={period} onValueChange={handlePeriodChange} className="w-full mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/10">
            <TabsTrigger value="week" className="text-white data-[state=active]:bg-sage-600">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-white data-[state=active]:bg-sage-600">Month</TabsTrigger>
            <TabsTrigger value="year" className="text-white data-[state=active]:bg-sage-600">Year</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                <Activity size={16} /> Total Moods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light">{data.total_moods}</p>
              <p className="text-xs text-gray-400">entries this {period}</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                <Clock size={16} /> Avg. Screen Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-light">{data.avg_screen_minutes} min</p>
              <p className="text-xs text-gray-400">per day</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-300 flex items-center gap-2">
                <Calendar size={16} /> Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-light">
                {new Date(data.start_date).toLocaleDateString()} – {new Date(data.end_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sage-400" />
              Seren's Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 leading-relaxed">{data.insight}</p>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-white">Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {data.mood_chart.length > 0 ? (
              <StackedMoodChart data={data.mood_chart} />
            ) : (
              <p className="text-gray-400 text-center py-8">No mood data for this period.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">Screen Time</CardTitle>
          </CardHeader>
          <CardContent>
            {data.screen_chart.length > 0 ? (
              <ScreenBarChart data={data.screen_chart} />
            ) : (
              <p className="text-gray-400 text-center py-8">No screen time data for this period.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}