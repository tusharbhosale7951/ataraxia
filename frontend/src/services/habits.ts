import { api } from './api'

export interface Habit {
  id: number
  title: string
  category: string
  target_minutes: number
  current_streak: number
  longest_streak: number
  is_active: boolean
  logs: any[]
}

export interface HabitLog {
  habit_id: number
  minutes_spent: number
  notes?: string
}

export const getHabits = async () => {
  const response = await api.get<Habit[]>('/api/habits/habits')
  return response.data
}

export const createHabit = async (habit: { title: string; category: string; target_minutes: number }) => {
  const response = await api.post('/api/habits/habits', habit)
  return response.data
}

export const logHabit = async (log: HabitLog) => {
  const response = await api.post('/api/habits/habits/log', log)
  return response.data
}