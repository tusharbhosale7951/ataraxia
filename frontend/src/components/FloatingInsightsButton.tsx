import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export const FloatingInsightsButton = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={() => navigate('/insights')}
        className="rounded-full w-14 h-14 bg-sage-600 hover:bg-sage-700 shadow-lg flex items-center justify-center"
      >
        <BarChart3 size={24} />
      </Button>
    </motion.div>
  )
}