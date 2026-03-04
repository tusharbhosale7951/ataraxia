import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Timer, TreePine, Droplets, Wind, Cloud, Leaf } from 'lucide-react'
import { logForestSession, getForestStats, ForestStats } from '@/services/forest'
import { toast } from 'sonner'

const soundscapes = {
  forest: {
    name: 'Deep Forest',
    icon: TreePine,
    color: 'from-emerald-600 to-emerald-800',
    src: '/sounds/forest.mp3',
    description: 'Birds chirping, gentle wind through leaves'
  },
  stream: {
    name: 'Mountain Stream',
    icon: Droplets,
    color: 'from-blue-600 to-blue-800',
    src: '/sounds/stream.mp3',
    description: 'Flowing water, distant birds'
  },
  rain: {
    name: 'Forest Rain',
    icon: Cloud,
    color: 'from-slate-600 to-slate-800',
    src: '/sounds/rain.mp3',
    description: 'Gentle rain on canopy, thunder far away'
  },
  wind: {
    name: 'Wind in Trees',
    icon: Wind,
    color: 'from-sage-600 to-sage-800',
    src: '/sounds/wind.mp3',
    description: 'Soft breeze through leaves'
  }
}

const timerOptions = [5, 10, 15, 20, 30, 45, 60]

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function ForestBathing() {
  const [selectedSoundscape, setSelectedSoundscape] = useState<keyof typeof soundscapes>('forest')
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [selectedTimer, setSelectedTimer] = useState<number | null>(15)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [stats, setStats] = useState<ForestStats>({ 
    weekly_minutes: 0, 
    sessions_count: 0, 
    favorite_soundscape: null 
  })
  const [showGuide, setShowGuide] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)  // ✅ Fixed: ReturnType instead of NodeJS
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
    audioRef.current = new Audio()
    audioRef.current.loop = true
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current && selectedSoundscape) {
      audioRef.current.src = soundscapes[selectedSoundscape].src
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      }
    }
  }, [selectedSoundscape])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (isPlaying && selectedTimer && timeRemaining === null) {
      setTimeRemaining(selectedTimer * 60)
    }
  }, [isPlaying, selectedTimer])

  useEffect(() => {
    if (timeRemaining === 0) {
      handleSessionComplete()
    }
    if (timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeRemaining])

  const fetchStats = async () => {
    try {
      const data = await getForestStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch forest stats', error)
    }
  }

  const togglePlay = () => {
    if (!isPlaying) {
      audioRef.current?.play()
      setIsPlaying(true)
      if (selectedTimer) {
        setTimeRemaining(selectedTimer * 60)
      }
    } else {
      audioRef.current?.pause()
      setIsPlaying(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleSessionComplete = async () => {
    audioRef.current?.pause()
    setIsPlaying(false)
    if (selectedTimer) {
      try {
        await logForestSession({
          duration_minutes: selectedTimer,
          soundscape: selectedSoundscape
        })
        toast.success('Session Complete! 🌿', {
          description: `You spent ${selectedTimer} minutes in the forest.`,
          duration: 5000
        })
        fetchStats()
      } catch (error) {
        console.error('Failed to log session', error)
      }
    }
    setTimeRemaining(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-linear-to-b from-emerald-950 to-slate-900 text-white relative"
    >
      <FloatingLeaves />
      <Sidebar />
      <div className="ml-20 p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold bg-linear-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Shinrin-yoku
            </h1>
            <p className="text-emerald-200/70 mt-1">Forest Bathing • Digital Sanctuary</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            Dashboard
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-300">This Week</p>
              <p className="text-3xl font-light">{stats.weekly_minutes} min</p>
              <p className="text-xs text-gray-400">in the forest</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-300">Sessions</p>
              <p className="text-3xl font-light">{stats.sessions_count}</p>
              <p className="text-xs text-gray-400">this week</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <p className="text-sm text-emerald-300">Favorite</p>
              <p className="text-xl font-light capitalize">{stats.favorite_soundscape || '—'}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 backdrop-blur border-white/10 overflow-hidden">
          <div className={`h-2 bg-linear-to-r ${soundscapes[selectedSoundscape].color}`} />
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-400" />
              Choose Your Forest
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Object.keys(soundscapes) as Array<keyof typeof soundscapes>).map((key) => {
                const sound = soundscapes[key]
                const Icon = sound.icon
                const isSelected = selectedSoundscape === key
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSoundscape(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `bg-linear-to-br ${sound.color} border-emerald-400 shadow-lg`
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-emerald-300'}`} />
                    <p className="font-medium">{sound.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{sound.description}</p>
                  </motion.button>
                )
              })}
            </div>

            <div>
              <p className="text-sm text-gray-300 mb-3 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Session Duration
              </p>
              <div className="flex flex-wrap gap-2">
                {timerOptions.map((mins) => (
                  <Button
                    key={mins}
                    variant={selectedTimer === mins ? 'default' : 'outline'}
                    onClick={() => setSelectedTimer(mins)}
                    className={selectedTimer === mins ? 'bg-emerald-600' : 'border-white/20 text-white'}
                  >
                    {mins} min
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume
                </p>
                <span className="text-xs text-gray-400">{volume}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={([val]) => setVolume(val)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className={`w-40 ${
                    isPlaying
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  } text-white`}
                >
                  {isPlaying ? 'Pause' : 'Start Forest Bathing'}
                </Button>
              </motion.div>
              
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button
                    onClick={handleSessionComplete}
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    End Early
                  </Button>
                </motion.div>
              )}
            </div>

            <AnimatePresence>
              {isPlaying && timeRemaining !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <p className="text-sm text-gray-400">Time Remaining</p>
                  <p className="text-5xl font-light text-emerald-300 font-mono">
                    {formatTime(timeRemaining)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowGuide(!showGuide)}
                className="text-emerald-300 hover:text-emerald-200 hover:bg-white/5"
              >
                {showGuide ? 'Hide Guide' : 'Show Forest Bathing Guide'}
              </Button>
              
              <AnimatePresence>
                {showGuide && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-white/5 rounded-lg text-gray-300 text-sm space-y-2"
                  >
                    <p>🌿 <span className="text-emerald-300">Find a comfortable position.</span> Sit or lie down in a quiet space.</p>
                    <p>👁️ <span className="text-emerald-300">Close your eyes gently.</span> Let the sounds guide you.</p>
                    <p>🌬️ <span className="text-emerald-300">Breathe naturally.</span> Don't force it – just observe.</p>
                    <p>🍃 <span className="text-emerald-300">Imagine yourself in a forest.</span> Feel the breeze, smell the earth.</p>
                    <p>💭 <span className="text-emerald-300">If thoughts come, let them pass.</span> Return to the sounds.</p>
                    <p className="pt-2 text-xs text-gray-500">*Inspired by Japanese Shinrin-yoku practice</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur border-white/10 mt-6">
          <CardContent className="pt-6">
            <p className="text-sm text-emerald-300 italic">
              "Shinrin-yoku – forest bathing – is like a bridge. By opening our senses, it bridges the gap between us and the natural world."
            </p>
            <p className="text-xs text-gray-500 mt-2 text-right">— Dr. Qing Li, Forest Medicine</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}