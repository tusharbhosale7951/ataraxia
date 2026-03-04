import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

const quotes = [
  "Peace comes from within. Do not seek it without. – Buddha",
  "Calm mind brings inner strength and self-confidence. – Dalai Lama",
  "The gift of learning to meditate is the greatest gift you can give yourself in this life. – Sogyal Rinpoche",
  "Within you, there is a stillness and a sanctuary to which you can retreat at any time. – Hermann Hesse",
  "The mind is everything. What you think you become. – Buddha",
  "You cannot control the waves, but you can learn to surf. – Jon Kabat-Zinn",
  "Almost everything will work again if you unplug it for a few minutes, including you. – Anne Lamott",
  "Rest and self-care are so important. When you take time to replenish your spirit, it allows you to serve others from the overflow. – Eleanor Brownn"
]

export const QuoteCard = () => {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="bg-white/10 backdrop-blur border-white/20">
      <CardContent className="pt-6">
        <div className="flex gap-2">
          <Sparkles className="h-5 w-5 text-sage-400 shrink-0" />
          <p className="text-gray-200 italic">{quote}</p>
        </div>
      </CardContent>
    </Card>
  )
}