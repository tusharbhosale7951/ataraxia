import { api } from './api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  message: string
  history?: ChatMessage[]
}

export interface ChatResponse {
  reply: string
  suggested_activity?: string
}

export const sendChatMessage = async (message: string, history: ChatMessage[] = []) => {
  const response = await api.post<ChatResponse>('/api/chat/', { message, history })
  return response.data
}