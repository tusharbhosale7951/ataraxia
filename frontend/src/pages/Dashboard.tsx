import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { logMood, getMoods, MoodEntry } from '@/services/mood'
import { useScreenTime } from '@/hooks/useScreenTime'
import { BreakReminder } from '@/components/BreakReminder'
import { WeeklyInsightCard } from '@/components/WeeklyInsightCard'
import { FloatingInsightsButton } from '@/components/FloatingInsightsButton'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { Sidebar } from '@/components/Sidebar'
import { Wind, Sparkles, Clock, Calendar, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const moodEmojis = {
  calm: '😌',
  happy: '😊',
  neutral: '😐',
  anxious: '😰',
  sad: '😢'
}

const moodColors = {
  calm: 'bg-emerald-500/20 border-emerald-500 shadow-emerald-500/20',
  happy: 'bg-amber-500/20 border-amber-500 shadow-amber-500/20',
  neutral: 'bg-stone-500/20 border-stone-500 shadow-stone-500/20',
  anxious: 'bg-orange-500/20 border-orange-500 shadow-orange-500/20',
  sad: 'bg-sky-500/20 border-sky-500 shadow-sky-500/20'
}

type MoodType = keyof typeof moodEmojis

// More dynamic gradient animation
const gradientVariants = {
  animate: {
    background: [
      'radial-gradient(circle at 20% 20%, #1A2A1F, #2C3E2F, #1E2F1A)',
      'radial-gradient(circle at 80% 30%, #1A2A1F, #2C3E2F, #1E2F1A)',
      'radial-gradient(circle at 40% 80%, #1A2A1F, #2C3E2F, #1E2F1A)',
      'radial-gradient(circle at 70% 70%, #1A2A1F, #2C3E2F, #1E2F1A)',
      'radial-gradient(circle at 30% 60%, #1A2A1F, #2C3E2F, #1E2F1A)',
    ],
    transition: {
      duration: 25,
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  }
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

// Your custom tagline
const tagline = "Master your mind live with clarity."

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm')
  const [note, setNote] = useState('')
  const [intention, setIntention] = useState('')
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    showBreakReminder,
    dismissReminder,
    stats,
    refreshStats
  } = useScreenTime(30)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    fetchMoods()
    refreshStats()
  }, [])

  useEffect(() => {
    if (recentMoods.length === 5) {
      toast.success('✨ Milestone!', {
        description: 'You have logged 5 moods this week!',
        duration: 5000,
        icon: '🌟'
      })
    } else if (recentMoods.length === 10) {
      toast.success('🌈 Amazing!', {
        description: '10 mood entries this week – you are doing great!',
        duration: 5000,
        icon: '🎉'
      })
    }
  }, [recentMoods.length])

  const fetchMoods = async () => {
    try {
      const data = await getMoods(7)
      setRecentMoods(data)
    } catch (error) {
      console.error('Failed to fetch moods', error)
    }
  }

  const handleLogMood = async () => {
    setLoading(true)
    try {
      await logMood({ mood: selectedMood, note })
      setNote('')
      await fetchMoods()
      toast.success('Mood logged!', {
        description: 'Thank you for sharing.',
        duration: 3000
      })
    } catch (error) {
      console.error('Failed to log mood', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartBreathing = () => {
    dismissReminder()
    navigate('/breathing')
  }

  const handleSnooze = () => {
    dismissReminder()
  }

  return (
    <motion.div
      variants={gradientVariants}
      animate="animate"
      className="min-h-screen text-white relative overflow-hidden"
    >
      <FloatingLeaves />
      <Sidebar />

      <BreakReminder
        open={showBreakReminder}
        onClose={dismissReminder}
        onStartBreathing={handleStartBreathing}
        onSnooze={handleSnooze}
      />

      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="ml-20 p-8 space-y-10 relative z-10 max-w-7xl"
      >
        {/* 🏷️ Centered Modern White Brand Header - Larger */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
          className="mb-10 text-center"
        >
          {/* Decorative lines with animated dot */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <motion.div 
              className="h-px w-16 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
            <motion.span 
              className="text-white/40 text-lg"
              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✦
            </motion.span>
            <motion.div 
              className="h-px w-16 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
          </div>
          
          {/* Ataraxia - Bigger, bolder */}
          <motion.h1 
            className="text-6xl md:text-7xl font-serif font-bold text-white tracking-tight drop-shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Ataraxia
          </motion.h1>
          
          {/* Tagline - Larger */}
          <motion.p 
            className="text-white/80 text-lg md:text-xl italic mt-3 tracking-wide max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {tagline}
          </motion.p>
          
          {/* Bottom animated line */}
          <motion.div 
            className="h-px w-24 bg-white/30 mx-auto mt-4"
            animate={{ width: ['4rem', '8rem', '4rem'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Greeting Section */}
        <motion.section
          variants={itemVariants}
          className="text-center md:text-left"
        >
          <h2 className="text-5xl md:text-6xl font-light font-serif bg-linear-to-r from-sage-300 to-sage-500 bg-clip-text text-transparent">
            {getGreeting()}
          </h2>
          <p className="text-gray-400 mt-3 text-xl">How are you feeling today?</p>
        </motion.section>

        {/* Stats Cards with stagger animation */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: "Today's Screen Time", value: stats?.todayMinutes ?? 0, unit: 'min', sub: `Goal: ${stats?.goalMinutes ?? 30} min`, icon: Clock, color: 'text-sage-300' },
            { title: 'Weekly Average', value: stats?.weeklyAverage?.toFixed(1) ?? '0', unit: 'min', sub: 'per day', icon: Calendar, color: 'text-amber-300' },
            { title: 'Mood Streak', value: recentMoods.length, unit: '', sub: 'entries this week', icon: Activity, color: 'text-emerald-300' }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -8,
                boxShadow: '0 25px 40px -12px rgba(0,0,0,0.6)'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="glass-card border-none overflow-hidden group">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-gray-300">{item.title}</CardTitle>
                  <item.icon className={`h-6 w-6 ${item.color} group-hover:rotate-12 transition-transform`} />
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-light text-white">{item.value} {item.unit}</p>
                  <p className="text-sm text-gray-400 mt-2">{item.sub}</p>
                </CardContent>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-sage-500/30"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Insight Card with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <WeeklyInsightCard />
        </motion.div>

        {/* Quick Actions Row with hover animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-card border-none cursor-pointer group" onClick={() => navigate('/breathing')}>
              <CardContent className="pt-8 pb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-300 mb-1">Quick Breathing</p>
                  <p className="text-2xl font-light">Take a 1-minute break</p>
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-white/10 p-4 rounded-full"
                >
                  <Wind size={48} className="text-sage-400 group-hover:text-sage-300 transition-colors" />
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass-card border-none">
              <CardContent className="pt-8 pb-8">
                <p className="text-sm text-gray-300 mb-3">Today's Progress</p>
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <span>Mood entries</span>
                    <span className="text-sage-300 font-semibold text-2xl">{recentMoods.length}/7</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-sage-400 to-sage-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(recentMoods.length / 7) * 100}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-right">
                    {recentMoods.length === 7 ? 'Goal reached! 🎉' : `${7 - recentMoods.length} more to reach goal`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mood Picker with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sage-400" />
                How are you feeling?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="flex gap-6 flex-wrap justify-center"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
              >
                {(Object.keys(moodEmojis) as MoodType[]).map((mood) => (
                  <motion.button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`text-6xl p-6 rounded-2xl border-2 transition-all ${
                      selectedMood === mood
                        ? moodColors[mood] + ' scale-110 shadow-2xl'
                        : 'border-transparent hover:border-white/20 hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    variants={{
                      hidden: { opacity: 0, scale: 0.6 },
                      show: { opacity: 1, scale: 1 }
                    }}
                  >
                    {moodEmojis[mood]}
                  </motion.button>
                ))}
              </motion.div>

              <div className="space-y-3">
                <label className="text-base text-gray-300">Add a note (optional)</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind?"
                  className="bg-white/5 border-white/10 text-white text-lg placeholder:text-white/30 focus:border-sage-400/50 transition-colors"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <label className="text-base text-gray-300">Today's intention</label>
                <input
                  type="text"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="e.g., Be kind to myself"
                  className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-lg placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-sage-400/50 transition-all"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleLogMood}
                  disabled={loading}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white text-lg py-6 border-none shadow-xl hover:shadow-2xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Logging...
                    </span>
                  ) : 'Log Mood'}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Moods with enhanced list animations */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Recent Moods</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMoods.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 text-center py-12 text-lg"
              >
                No moods logged yet. Start by picking one above!
              </motion.p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {recentMoods.map((mood, index) => {
                    let formattedDate = 'Invalid date';
                    if (mood.createdAt) {
                      const date = new Date(mood.createdAt);
                      if (!isNaN(date.getTime())) {
                        formattedDate = format(date, 'MMM d, h:mm a');
                      }
                    }
                    return (
                      <motion.div
                        key={mood.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                      >
                        <span className="text-4xl">{moodEmojis[mood.mood]}</span>
                        <div className="flex-1">
                          <p className="font-medium capitalize text-sage-300 text-lg">{mood.mood}</p>
                          {mood.note && <p className="text-sm text-gray-400 mt-1">{mood.note}</p>}
                        </div>
                        <span className="text-sm text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">
                          {formattedDate}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.main>

      <FloatingInsightsButton />
    </motion.div>
  )
}