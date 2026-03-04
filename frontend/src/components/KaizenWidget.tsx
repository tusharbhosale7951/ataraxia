import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Target } from 'lucide-react'
import { getHabits, createHabit, logHabit } from '@/services/habits'
import { toast } from 'sonner'

export const KaizenWidget = () => {
  const [habits, setHabits] = useState<any[]>([])
  const [newHabit, setNewHabit] = useState('')
  const [target, setTarget] = useState(5)

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    const data = await getHabits()
    setHabits(data)
  }

  const handleCreateHabit = async () => {
    if (!newHabit) return
    await createHabit({
      title: newHabit,
      category: 'custom',
      target_minutes: target
    })
    setNewHabit('')
    setTarget(5)
    loadHabits()
    toast.success('Habit created! 1% better every day 🎯')
  }

  const handleLog = async (habitId: number) => {
    await logHabit({
      habit_id: habitId,
      minutes_spent: 5
    })
    loadHabits()
    toast.success('Small step done! Keep going ✨')
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-sage-400" />
          Kaizen • 1% Better Every Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Read 5 mins"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          <Input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-20 bg-white/5 border-white/10"
          />
          <Button onClick={handleCreateHabit} className="bg-sage-600">Add</Button>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">{habit.title}</p>
                <p className="text-xs text-gray-400">Streak: {habit.current_streak} days</p>
              </div>
              <Button size="sm" onClick={() => handleLog(habit.id)} className="bg-sage-600">Done</Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 italic mt-2">
          "Small steps, big changes." – Kaizen philosophy
        </p>
      </CardContent>
    </Card>
  )
}