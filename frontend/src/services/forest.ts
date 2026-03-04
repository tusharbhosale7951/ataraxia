import { api } from './api'

export interface ForestSession {
  duration_minutes: number
  soundscape: string
}

export interface ForestStats {
  weekly_minutes: number
  sessions_count: number
  favorite_soundscape: string | null
}

export const logForestSession = async (session: ForestSession) => {
  const response = await api.post('/api/forest/session', session)
  return response.data
}

export const getForestStats = async () => {
  const response = await api.get<ForestStats>('/api/forest/stats')
  return response.data
}