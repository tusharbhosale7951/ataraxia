import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { sendChatMessage, ChatMessage } from '@/services/chat'
import { Sidebar } from '@/components/Sidebar'
import { FloatingLeaves } from '@/components/FloatingLeaves'
import { Mic, Send, MicOff } from 'lucide-react'
import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      console.warn('Speech recognition not supported in this browser.')
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await sendChatMessage(input, messages)
      const assistantMessage: ChatMessage = { role: 'assistant', content: response.reply }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
          <h1 className="text-3xl font-bold font-serif">Chat with Seren</h1>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/20">
            Dashboard
          </Button>
        </header>

        <Card className="glass-card h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Seren – Your Calm Companion</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto flex flex-col space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p className="text-lg">Hello, I'm Seren. How are you feeling today?</p>
                <p className="text-sm mt-2">You can type or use voice input.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-sage-600 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-white p-3 rounded-lg">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t border-white/20 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              className={`${isListening ? 'text-red-500' : 'text-white'} hover:bg-white/20`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/30 text-white"
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-sage-600 hover:bg-sage-700">
              <Send size={18} />
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}