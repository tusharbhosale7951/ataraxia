import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { motion } from 'framer-motion'

const phases = [
  { name: 'Inhale', duration: 4, color: 'bg-green-500' },
  { name: 'Hold', duration: 7, color: 'bg-yellow-500' },
  { name: 'Exhale', duration: 8, color: 'bg-blue-500' },
]

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function Breathing() {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration)
  const [isActive, setIsActive] = useState(false)
  // navigate is not used here, so we removed it

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (isActive && secondsLeft > 0) {
      timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000)
    } else if (isActive && secondsLeft === 0) {
      const nextIndex = (phaseIndex + 1) % phases.length
      setPhaseIndex(nextIndex)
      setSecondsLeft(phases[nextIndex].duration)
    }
    return () => clearTimeout(timer)
  }, [isActive, secondsLeft, phaseIndex])

  const startExercise = () => {
    setIsActive(true)
    setPhaseIndex(0)
    setSecondsLeft(phases[0].duration)
  }

  const stopExercise = () => {
    setIsActive(false)
  }

  const currentPhase = phases[phaseIndex]

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
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-serif">4-7-8 Breathing</h1>
        </header>

        <div className="max-w-md mx-auto">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white text-center">Guided Breathing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <motion.div
                  className={`w-48 h-48 rounded-full ${currentPhase.color} opacity-70`}
                  animate={{
                    scale: phaseIndex === 0 ? [1, 1.5] : phaseIndex === 1 ? 1.5 : [1.5, 1],
                  }}
                  transition={{
                    duration: currentPhase.duration,
                    repeat: phaseIndex === 0 || phaseIndex === 2 ? Infinity : 0,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                  }}
                />
              </div>

              <div className="text-center">
                <p className="text-4xl font-light mb-2">{currentPhase.name}</p>
                <p className="text-6xl font-bold">{secondsLeft}</p>
              </div>

              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <Button onClick={startExercise} className="bg-sage-600 hover:bg-sage-700">
                    Start
                  </Button>
                ) : (
                  <Button onClick={stopExercise} variant="destructive">
                    Stop
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}