import { api } from './api'

export interface OverviewResponse {
  period: 'week' | 'month' | 'year'
  start_date: string
  end_date: string
  total_moods: number
  avg_screen_minutes: number
  mood_chart: Array<{ date: string; calm: number; happy: number; neutral: number; anxious: number; sad: number }>
  screen_chart: Array<{ date: string; minutes: number }>
  insight: string
}

export const getPeriodOverview = async (period: 'week' | 'month' | 'year') => {
  const response = await api.get<OverviewResponse>(`/api/insights/overview?period=${period}`)
  return response.data
}