import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageCircle, 
  Activity, 
  Wind, 
  LogOut, 
  TreePine, 
  Target, 
  Moon 
} from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/chat', icon: MessageCircle, label: 'Chat with Seren' },
  { path: '/insights', icon: Activity, label: 'Insights' },
  { path: '/forest', icon: TreePine, label: 'Forest Bathing' },
  { path: '/habits', icon: Target, label: 'Habits' },
  { path: '/sleep', icon: Moon, label: 'Sleep' },
  { path: '/breathing', icon: Wind, label: 'Breathing' },
]

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 glass flex flex-col items-center py-8 gap-8 z-50"
    >
      <div className="text-3xl font-bold text-sage-400 font-serif">A</div>
      <nav className="flex flex-col gap-6 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              onClick={() => navigate(item.path)}
              className={`relative text-white hover:bg-white/20 ${
                isActive ? 'bg-white/10' : ''
              }`}
            >
              <item.icon size={24} />
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-sage-400 rounded-r-full"
                />
              )}
            </Button>
          )
        })}
      </nav>
      <Button variant="ghost" size="icon" onClick={logout} className="text-white hover:bg-white/20">
        <LogOut size={24} />
      </Button>
    </motion.aside>
  )
}