import { api } from './api'

export interface MoodEntry {
  id?: string
  mood: 'calm' | 'happy' | 'neutral' | 'anxious' | 'sad'
  note?: string
  createdAt?: string // ISO string after mapping
}

export const logMood = async (mood: MoodEntry) => {
  const response = await api.post('/api/moods/', mood)
  return response.data
}

export const getMoods = async (limit = 50) => {
  const response = await api.get(`/api/moods/?limit=${limit}`)
  return response.data.map((item: any) => {
    // Convert MySQL datetime string to ISO format (replace space with T)
    let createdAt = item.created_at
    if (createdAt && typeof createdAt === 'string') {
      // If it contains a space, replace it with 'T' to make it ISO-compatible
      createdAt = createdAt.replace(' ', 'T')
    }
    return {
      id: item.id,
      mood: item.mood,
      note: item.note,
      createdAt // Now it's a valid ISO string or undefined
    }
  })
}